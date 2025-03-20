import React, { useState } from 'react'
import './LoginSignup.css'
import img from './Components/Assets/Group.png';

const LoginSignup = () => {
  const [isLogin,setIsLogin] = useState(true)
  return (
    <div className='container'>
      <div className="img-container">
        <img src={img} />
      </div>
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? 'active' : ""} onClick={ () => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ""} onClick={ () => setIsLogin(false)}>SignUp</button>
        </div>
        {isLogin ? <>
        <div className="form">
          <h2>Login Form</h2>
          <input type='email' placeholder='email'/>
          <input type='password' placeholder='password'/>
          <button>Login</button>
        </div>
        </> : <>
        <div className="form">
        <input type='text' placeholder='Fullname'/>
        <input type='email' placeholder='email'/>
        <input type='password' placeholder='password'/>
        <button>Signup</button>
        </div>
        </>}
      </div>
    </div>
  )
}

export default LoginSignup
