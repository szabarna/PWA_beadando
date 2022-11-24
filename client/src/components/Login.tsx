import { useState } from 'react';
import '../App.scss';
import gsap, { Circ } from 'gsap';

export default function Login() {

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 async function loginUser(event: React.FormEvent) {
    event.preventDefault();

    const response =  await fetch('http://localhost:1337/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email, 
          password,

        }),

    });

    const data = await response.json()

    if(data.user) {
        alert('Login successful')
        localStorage.removeItem('token')
        localStorage.setItem('token', JSON.stringify(data.user) );
        window.location.href = '/main'
    }
    else {
        alert('Please check your email and password!')
    }

    // console.log(data);
    
 }


  return (
    <div className="App">

      <form className='loginForm' onSubmit={loginUser} >
        <h1 className='formH1'>Log in</h1>

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

            }}

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
            <h3>No account yet?</h3>
            <a href="/register">To Register</a>
        </div>  
        <input type="submit" className='loginSubmit' value="Login" />
          
      </form>
    </div>
  );
}


