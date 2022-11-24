import { useState } from 'react';
import '../App.scss';
import gsap, { Circ } from 'gsap';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const history = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 async function registerUser(event: React.FormEvent) {

    event.preventDefault();

    const response =  await fetch('http://localhost:1337/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name, 
          email, 
          password,
        }),

    });

    const data = await response.json()

    if(data.status === 'ok') history('/login')
    
    console.log(data);
 }


  return (
    <div className="App">

      <form className='loginForm' onSubmit={registerUser} >
        <h1 className='formH1'>Sign Up</h1>

        <div className="usernameDiv">
          <label htmlFor="usernameInput" data-placeholder='Username' className='username' >
            <input 
            type="text" 
            name="usernameInput" 
            id="usernameInput" 
            required
            onChange={(e) => {
              setName(e.target.value)
              if(e.target.value !== "") {

                gsap.to('html', {
                  "--offset3": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            } }

            onFocus={(e) => {

              gsap.to('html', {
                  "--offset3": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
            }}
            onBlur={(e) => {
             
              if(e.target.value === "") {

                gsap.to('html', {
                  "--offset3": "0%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            }}
              />
          </label>
        </div>

        <div className="emailDiv">
          <label htmlFor="emailInput" data-placeholder='Email' className='email'>
            <input 
            type="email" 
            name="emailInput" 
            id="emailInput" 
            required
            onChange={(e) => {
              setEmail(e.target.value)
              if(e.target.value !== "") {

                gsap.to('html', {
                  "--offset": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            } }

            onFocus={(e) => {

              gsap.to('html', {
                  "--offset": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
            }}
            onBlur={(e) => {
             
              if(e.target.value === "") {

                gsap.to('html', {
                  "--offset": "0%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            }}
             />
          </label>
        </div>

        <div className="passwordDiv">
          <label htmlFor="passwordInput" data-placeholder='Password' className='password'>
            <input type="password" 
            name="passwordInput" 
            id="passwordInput" 
            required
            onChange={(e) => {
              setPassword(e.target.value)
              if(e.target.value !== "") {

                gsap.to('html', {
                  "--offset2": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            } }
            onFocus={(e) => {

              gsap.to('html', {
                  "--offset2": "-75%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
            }}
            onBlur={(e) => {
             
              if(e.target.value === "") {

                gsap.to('html', {
                  "--offset2": "0%",
                  duration: 0.1,
                  ease: Circ.easeInOut
              })
              }
            }}
             />
          </label>
        </div>
        <div className='alreadyContainer'>
            <h3>Already registered?</h3>
            <a href="/login">To Login</a>
        </div>  
        <input type="submit" className='loginSubmit' value="Register" />
      </form>
    </div>
  );
}


