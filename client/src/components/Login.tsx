import { useEffect, useState } from 'react';
import '../App.scss';
import gsap, { Circ } from 'gsap';
import { from, map, switchMap } from 'rxjs';

export default function Login() {

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const emailInput = (document.querySelector('#emailInput') as HTMLInputElement);
    const passwordInput = (document.querySelector('#passwordInput') as HTMLInputElement);

    if(userEmail != null) {
      console.log(userEmail);
      emailInput.value = userEmail;
      setEmail(userEmail);
    }

    if(emailInput.value != "") {

      gsap.to('html', {
        "--offset": "-75%",
        duration: 0.1,
        ease: Circ.easeInOut
    })

    }

  }, [])

 async function loginUser(event: React.FormEvent) {
    event.preventDefault();
  if(email != null && password != null) {

      let loginUser$ = from(fetch('http://localhost:1337/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email, 
        password,

      }),

    })).pipe(
      switchMap((res) => res.json()),
      map((item:any) => {

          if(item.user) {
            alert('Login successful :happyface:')
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.setItem('token', JSON.stringify(item.user) );
            window.location.href = '/main'
          } else {
            alert('Please check your email and password!')
          }
      })
    ).subscribe();
    // console.log(data);
  } 
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


