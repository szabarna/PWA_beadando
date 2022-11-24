import '../App.scss';
import { useEffect, useState } from 'react';
import EditUserModal from './EditUserModal';
import * as jose from 'jose';
import { Buffer } from 'buffer';
import { MdPauseCircleFilled, MdPlayCircle } from 'react-icons/md'
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from 'react-icons/bs';
import Dexie from 'dexie';
import gsap from 'gsap';
import { HiXMark } from 'react-icons/hi2';

export default function Main() {

  const db = new Dexie("SongDatabase");

  db.version(1).stores({
    songs: "title, img, artist, audio"
  });

  db.open().catch((err) => {
    console.log(err.stack || err);
  });

  let user:jose.JWTPayload;
  const [curr_track, setCurrentTrack] = useState(Object);
  const [song_slider, setCurrentSlider] = useState(Object);
  const [curr_time, setCurrTime] = useState(Object);
  const [curr_totalTime, setTotalTime] = useState(Object);
  const [curr_Volume, setVolume] = useState(Object);
  const [curr_slider_range, setSliderRange] = useState(0);
  const [curr_volume_range, setVolumeRange] = useState(0);

  let current_track:HTMLAudioElement;
  let updateTimer:any;

  const [renderedSongs, setRenderedSongs] = useState<JSX.Element>();

 // gsap.to('html', { "--appOpacity": 1, "--imgUrl": "none", "--background": "transparent" } )

 function AddCurrentMusic(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    resetTime();
    clearInterval(updateTimer);

    let currentSongSlider = (document.querySelector('.currentSongTimeSlider') as any);
    let currentTime = (document.querySelector('.currentSongCurrentTime') as HTMLHeadingElement);
    let currentTotalDuration = (document.querySelector('.currentSongEndTime') as HTMLHeadingElement);
    let currentSongVolume = (document.querySelector('.currentSongVolume') as any);
    let currentImg = (document.querySelector('.currentSongImage') as HTMLImageElement);
    let currentTitle = (document.querySelector('.currentSongTitle') as HTMLHeadingElement);
    let currentArtist = (document.querySelector('.currentSongArtist') as HTMLHeadingElement);
    let playIcon = (document.querySelector('.playIcon') as HTMLElement);
    let pauseIcon = (document.querySelector('.pauseIcon') as HTMLElement);

    let target = (e.target as HTMLDivElement);
    console.log(target)
    currentImg.src = (target.children[0] as HTMLImageElement).currentSrc;
    currentTitle.innerText = (target.children[1].children[0] as HTMLHeadingElement).innerText;
    currentArtist.innerText = (target.children[1].children[1] as HTMLHeadingElement).innerText;
    current_track = (target.children[2] as HTMLAudioElement);

    // for mobile view
    if(window.innerWidth <= 700) {
      const mainAudioContainer = (document.querySelector('.mainAudioContainer') as HTMLDivElement);
      const divForMobileView = (document.querySelector('.divForMobileView') as HTMLDivElement);
      const mobileTitle = (document.querySelector('.mobileTitle') as HTMLHeadingElement);
      const mobileArtist = (document.querySelector('.mobileArtist') as HTMLHeadingElement);

      divForMobileView.style.display = "grid";
     
      divForMobileView.style.backgroundImage = `url(${currentImg.src})`;
      mobileTitle.innerText = currentTitle.innerText;
      mobileArtist.innerText = currentArtist.innerText;

      gsap.to(mainAudioContainer, { height: "100vh", duration: 0.35, ease: 'power1.inOut' });

    }

    document.querySelectorAll('audio').forEach(el => el.pause());
    current_track.currentTime = 0;
    current_track.volume = 0.1;
    current_track.play();

    playIcon.style.display = "none";
    pauseIcon.style.display = "block";

    setCurrentTrack(current_track);
    setCurrentSlider(currentSongSlider);
    setCurrTime(currentTime);
    setTotalTime(currentTotalDuration);
    setVolume(currentSongVolume);
    setVolumeRange(current_track.volume * 100);

    playIcon.onclick = () => {
      PlayPause()
    };

    pauseIcon.onclick = () => {
      PlayPause()
    };

    updateTimer = setInterval(setUpdate, 1000);

 }

 function resetTime() {
  curr_time.textContent = "0:00";
  curr_totalTime.textContent = "0:00";
  song_slider.value = 0;
 }

 function GetCurrentSongTime(e:any) {
  
    let seekTo = curr_track.duration * (song_slider.value / 100);
    curr_track.currentTime = seekTo;
 }

 function GetCurrentSongVolume() {
  curr_track.volume = (curr_Volume.value / 100);
  setVolumeRange(curr_Volume.value);

 }

 function setUpdate() {
    let currentTime = (document.querySelector('.currentSongCurrentTime') as HTMLHeadingElement);
    let currentTotalDuration = (document.querySelector('.currentSongEndTime') as HTMLHeadingElement);

    let seekPosition = 0;

    if(!isNaN(current_track.duration)) {

        seekPosition = current_track.currentTime * (100 / current_track.duration);
        // song_slider.value = seekPosition;
        setSliderRange(seekPosition);

        let currMinutes:string = Math.floor(current_track.currentTime / 60).toString();
        let currSeconds:string = Math.floor(current_track.currentTime - parseInt(currMinutes) * 60).toString();

        let durationMinutes:string = Math.floor(current_track.duration / 60).toString();
        let durationSeconds:string = Math.floor(current_track.duration - parseInt(durationMinutes) * 60).toString();

        if(parseInt(currSeconds) < 10) { currSeconds = "0" + currSeconds.toString();  }
        if(parseInt(durationSeconds) < 10) { durationSeconds = "0" + durationSeconds.toString();  }
        if(parseInt(currMinutes) < 10) { currMinutes = "0" + currMinutes.toString();  }
        if(parseInt(durationMinutes) < 10) { durationMinutes = "0" + durationMinutes.toString();  }

        currentTime.textContent = currMinutes + ":" + currSeconds;
        currentTotalDuration.textContent = durationMinutes + ":" + durationSeconds;

    }
 }

 function PlayPause() {
  let playIcon = (document.querySelector('.playIcon') as HTMLElement);
  let pauseIcon = (document.querySelector('.pauseIcon') as HTMLElement);

    if(current_track.paused) {
      current_track.play()
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }
    else {
      current_track.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
 }

 async function ListSongsMongoFetch() {
  db.table("songs").clear();

  const token = localStorage.getItem('token');
  
  if( token ) {

          user = jose.decodeJwt(token);
    
   }

  const response =  await fetch('http://localhost:1337/api/getFiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
  });

  const data = await response.json()

  if(data) {

      const songData:any = jose.decodeJwt(data.songs);

      const img = () => {
          return (
            <>
            { songData.songs.map((item:any, index:any) => {

              const image = Buffer.from(item.backgroundImg.data).toString('base64');
              const audio = Buffer.from(item.audioFile.data).toString('base64');

              let songToBeAdded = {
                img: image,
                title: item.title,
                artist: item.artist,
                audio: audio
              };

             db.table("songs").add(songToBeAdded);

              (document.querySelector('.songsMainContainer') as HTMLDivElement).style.gridTemplateColumns = `repeat(${songData.songs.length}, auto)`;
              return ( <div className='songHolder' key={index} onClick={e => AddCurrentMusic(e) } >
                   
                    <img
                   src={`data:image/png;base64,${image}`}
                   alt={"songImg"}
                   width={"auto"}
                   height={200}
                  // loading={"lazy"}
                   />     
                   <h1>{ item.title } </h1>
                   <h1>{ item.artist } </h1>
                   <audio controls>
                     <source src={`data:audio/mp3;base64,${audio}`} type="audio/mpeg" />
                   </audio> 
                 </div>);
            }) }
             
           </>
          )
      }

      setRenderedSongs(img)
     // console.log(audio)
  }
  else {
    //  alert('Please check your email and password!')
  }

  // console.log(data);
  
}
 async function ListSongsFromIndexedDB() {

  let songsArray = await db.table("songs").toArray();

  const img = () => {


    return (
      <>
      {  songsArray.map((item:any, index:any) => {

        (document.querySelector('.songsMainContainer') as HTMLDivElement).style.gridTemplateColumns = `repeat(${ songsArray.length}, auto)`;
        return ( <div className='songHolder' key={index} onClick={e => AddCurrentMusic(e) } >
        
                <img
                src={`data:image/png;base64,${item.img}`}
                alt={"songImg"}
                width={"auto"}
                height={200}
                // loading={"lazy"}
                />
                <div className='h1Container'>
                <h1>{ item.title } </h1>
                <h1>{ item.artist } </h1>
                </div>     
                <audio controls>
                  <source src={`data:audio/mp3;base64,${item.audio}`} type="audio/mpeg" />
                </audio>
            
           </div>);
      }) }
       
     </>
    )
}

    setRenderedSongs(img)
}

function closeDiv() {
  const mainAudioContainer = (document.querySelector('.mainAudioContainer') as HTMLDivElement);
  const divForMobileView = (document.querySelector('.divForMobileView') as HTMLDivElement);
  gsap.to(mainAudioContainer, { height: "7.5rem", duration: 0.35, ease: 'power1.inOut' });
  document.querySelectorAll('audio').forEach(el => el.pause());
  let playIcon = (document.querySelector('.playIcon') as HTMLElement);
  let pauseIcon = (document.querySelector('.pauseIcon') as HTMLElement);

  playIcon.style.display = "block";
  pauseIcon.style.display = "none";

  setTimeout(() => {
    divForMobileView.style.display = "none";
  }, 250)
  
}


   useEffect(() => {
      current_track = new Audio();

      db.table("songs").count().then(result => {
        console.log(result)
        if(result === 0) ListSongsMongoFetch(); // no song stored in indexed_db
        else ListSongsFromIndexedDB();
      });
     
 }, [])

  return (
    <>
      <div className='mainContainer' >
        <EditUserModal func={ ListSongsMongoFetch } />
        <div className='section'></div>
        <div className="songsMainContainer">
        { renderedSongs }
        </div>


        <div className="mainAudioContainer">

          <div className="divForMobileView">
            <HiXMark id="mobileViewExitIcon" className='exitIcon' onClick={ closeDiv } />
            <div className='mobileGrid'>
              <h1>Playing</h1>
              <div className='forMobileInfoGrid'>
                <h1 className='mobileTitle'>Title</h1>
                <h1 className='mobileArtist'>Artist</h1>
              </div>
            </div>
          </div>

          <div className='audioPlayerContainer'>
            <div className='audioPlayerFirstElement'>
              <img src="./img/spotify.png" alt="currentSongImage" className='currentSongImage' width={81} height={81} />
              <div className='currentSongTextInfo'>
                <h1 className='currentSongTitle'>currentSongTitle</h1>
                <h2 className='currentSongArtist'>currentSongArtist</h2>
              </div>
            </div>

            <div className='audioPlayerSecondElement'>
              <div className="playIconDiv">
                <MdPlayCircle className='playIcon' />
                <MdPauseCircleFilled className='pauseIcon' />
              </div>
              <div className='currentSongPlayInfo'>
                <h2 className='currentSongCurrentTime'>00:00</h2>
                <input type="range" min={1} max={100} value={ curr_slider_range } onChange={GetCurrentSongTime} name="currentSongTimeSlider" className='currentSongTimeSlider' />
                <h2 className='currentSongEndTime'>00:00</h2>
              </div>
            </div>

            <div className='audioPlayerThirdElement'>
              <div className='volumeDiv'>
                <BsFillVolumeUpFill className='volumeIcon' />
                <BsFillVolumeMuteFill className='muteIcon' />
              </div>
              <input type="range" min={1} max={100} value={ isNaN(curr_volume_range)  ? 0 : curr_volume_range } name="currentSongVolume" className='currentSongVolume' onChange={GetCurrentSongVolume} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}


