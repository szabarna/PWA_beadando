import '../App.scss';
import React, { useEffect, useState } from 'react';
import * as jose from 'jose'
import { HiXMark } from 'react-icons/hi2'
import Modal from 'react-modal';
import NavBar from './NavBar';
import AddMusicModal from './AddMusicModal';

Modal.setAppElement('#root');

export default function EditUserModal(props:any) {


    const [currentUser, setUser] = useState(Object);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpen2, setIsOpen2] = useState(false);

    const toggleModal = () => {
        setIsOpen(!modalIsOpen)
    }

    const toggleModal2 = () => {
      setIsOpen2(!modalIsOpen2)
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
        <NavBar function={ toggleModal } func={ toggleModal2 } />
        <AddMusicModal func={ toggleModal2 } toggleFunc={ props.func } ourState={ modalIsOpen2 } />
        <Modal
             isOpen={modalIsOpen}
             className="Modal"
             overlayClassName="Overlay"
             onRequestClose={toggleModal}
             shouldCloseOnOverlayClick={true}
          >
            <form action="" className='modalForm'>
                
                <HiXMark className='exitIcon' onClick={ toggleModal } />

                <div className='modalImgHolder'>
                </div>

                <div className="usernameDivM formElement">
                  <label htmlFor="usernameInput" className='email'>Username</label>
                  <input
                    type="text" 
                    name="usernameInput" 
                    id="usernameInput" 
                    required
                    defaultValue={ currentUser.name }
                  //  onChange={(e) => setEmail(e.target.value) }

                    />
                </div>

                <div className="emailDivM formElement">
                  <label htmlFor="emailInput" className='email'>Email</label>
                  <input
                    type="email" 
                    name="emailInput" 
                    id="emailInput" 
                    required
                    defaultValue={ currentUser.email }
                  //  onChange={(e) => setEmail(e.target.value) }

                    />
                </div>

                <div className="passwordDivM formElement">
                  <label htmlFor="passwordInput" className='password'>Password</label>
                  <input type="password" 
                    name="passwordInput" 
                    id="passwordInput"
                    defaultValue={ currentUser.password } 
                    required
                    // onChange={(e) => setPassword(e.target.value) }

                    />
                </div>
                <input type="submit" className='modalSubmit' value="Save changes" />

            </form>
          </Modal >
        </>

    )
}