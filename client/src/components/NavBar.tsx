import '../App.scss';
import React, { useEffect, useState } from 'react';
import * as jose from 'jose'
import { FaUser } from 'react-icons/fa';
import { BsFileEarmarkMusic } from 'react-icons/bs';

export default function NavBar(props:any) {

    const [currentUser, setUser] = useState(Object);

    const logOutUser = () => {
        localStorage.removeItem('token');
        props.indexedDB.table("songs").clear();
        console.log(props);
        window.location.href = '/login'
      }


      useEffect(() => {
        const token = localStorage.getItem('token');
  
         if( token ) {
       
               const user = jose.decodeJwt(token);
           
               if(user) {
                 setUser(user);
 
               }
             
               if(!user) {
               localStorage.removeItem('token');
               window.location.href = '/login'
               }
          }
 
    }, [])

    return (
        <>
            <nav className='navbar' >
              <ul className='list' >
                <li className='li' id='addMusic'>
                    <button 
                    onClick={ props.func }
                    className='musicButton'><BsFileEarmarkMusic className='musicIcon' />Add new music</button>
                </li>   
                <li className='li' id='userLi' ><FaUser className='userIcon' />{ currentUser.name }</li>
                <li className='li'>
                  <button 
                  onClick={ props.function } 
                  className='editUserButton btn' >Edit Profile</button>
                </li>
                <li className='li' id='logOut'>
                  <button className='btn' onClick={ logOutUser } >Logout</button>
                </li>
              </ul>
            </nav>
           
        </>
      );
}