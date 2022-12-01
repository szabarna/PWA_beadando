import '../App.scss';
import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2'
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function AddMusicModal(props:any) {

  const [audioFile, setAudio] = useState<File>();
  const [backgroundImg, setBackgroundImg] = useState<File>();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');

  
  async function addSong(event: React.FormEvent) {
    event.preventDefault();

    console.log(audioFile)
    console.log(backgroundImg)

    const formData = new FormData();

    if(audioFile !== undefined && backgroundImg !== undefined) {
      
      formData.set("title", title);
      formData.set("artist", artist);
      formData.set("audioFile", audioFile)
      formData.set("backgroundImg", backgroundImg)

    }

    const response =  await fetch('http://localhost:1337/api/addSong', {
        method: 'POST',
        body: formData
    })

    const data = await response.json()

    if(data) {
        alert('Song sent successful')
    }
    else {
        alert('Something went wrong!')
    }

     console.log(data);

     props.toggleFunc();
     props.func();
 }



    return (
        <>
        <Modal
             isOpen={props.ourState}
             className="Modal"
             overlayClassName="Overlay"
             onRequestClose={props.func}
             shouldCloseOnOverlayClick={true} 
          >
            <form encType="multipart/form-data" onSubmit={addSong} className='modalForm'>
                
                <HiXMark className='exitIcon' onClick={ props.func } />


                <div className="fileDivM formElement">
                  <label htmlFor="fileInput" className='file'>Add audio file</label>
                  <input
                    type="file"
                    accept="audio/*" 
                    name="fileInput" 
                    id="fileInput" 
                    required
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setAudio(e.target.files[0]);
                    }}
                    />
                </div>

                <div className="imgDivM formElement">
                  <label htmlFor="imgInput" className='img'>Add image file</label>
                  <input
                    type="file"
                    accept="image/*" 
                    name="imgInput" 
                    id="imgInput" 
                    required
                    onChange={(e) => {
                      if (!e.target.files) return;
                      setBackgroundImg(e.target.files[0]);
                    }}
                    />
                </div>

                <div className="titleDivM formElement">
                  <label htmlFor="titleInput" className=''>Title</label>
                  <input
                    type="text" 
                    name="titleInput" 
                    id="titleInput" 
                    required
                    onChange={ (e) => setTitle( e.target.value ) }
                    />
                </div>

                <div className="artistDivM formElement">
                  <label htmlFor="artistInput" className='artist'>Artist</label>
                  <input type="text" 
                    name="artistInput" 
                    id="artistInput"
                    required
                    onChange={ (e) => setArtist( e.target.value ) }
                    />
                </div>
                <input type="submit" className='modalSubmit' value="Insert music" />

            </form>
          </Modal >
        </>

    )
   
}

