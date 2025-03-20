import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './LoginSignup.css';
import img from '../Assets/Group.png';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [signupValues, setSignupValues] = useState({ username: '', email: '', password: '' });

  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupValues({ ...signupValues, [name]: value });
  };

  useEffect(() => {
    if (Object.keys(loginErrors).length === 0 && isSubmitted && isLogin) {
      handleLogin();
    }
    if (Object.keys(signupErrors).length === 0 && isSubmitted && !isLogin) {
      handleSignup();
    }
  }, [loginErrors, signupErrors]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", loginValues);
      if (response.data.status === "success") {
        console.log("Login Successful", loginValues);
        navigate("/task");
      } else {
        setLoginErrors({ general: response.data.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginErrors({ general: "Server error. Try again later." });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:5000/signup", signupValues);
      if (response.data.status === "success") {
        console.log("Signup Successful", signupValues);
        navigate("/task");
      } else {
        setSignupErrors({ general: response.data.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupErrors({ general: "Server error. Try again later." });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin(loginValues);
    setLoginErrors(errors);
    setIsSubmitted(true);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignup(signupValues);
    setSignupErrors(errors);
    setIsSubmitted(true);
  };

  const validateLogin = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email.trim()) {
      errors.email = "Email cannot be blank";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password.trim()) {
      errors.password = "Password cannot be blank";
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    }
    return errors;
  };

  const validateSignup = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username.trim()) {
      errors.username = "Username cannot be blank";
    }
    if (!values.email.trim()) {
      errors.email = "Email cannot be blank";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password.trim()) {
      errors.password = "Password cannot be blank";
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    }
    return errors;
  };

  return (
    <div className='container'>
      <div className="img-container">
        <img src={img} alt='Login or Signup' />
      </div>
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>SignUp</button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form">
              <h2>Login</h2>
              <input type='email' name='email' placeholder='Email' value={loginValues.email} onChange={handleLoginChange} />
              {loginErrors.email && <p className="error">{loginErrors.email}</p>}
              <input type='password' name='password' placeholder='Password' value={loginValues.password} onChange={handleLoginChange} />
              {loginErrors.password && <p className="error">{loginErrors.password}</p>}
              {loginErrors.general && <p className="error">{loginErrors.general}</p>}
              <button type="submit">Login</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="form">
              <h2>Signup</h2>
              <input type='text' name='username' placeholder='Full Name' value={signupValues.username} onChange={handleSignupChange} />
              {signupErrors.username && <p className="error">{signupErrors.username}</p>}
              <input type='email' name='email' placeholder='Email' value={signupValues.email} onChange={handleSignupChange} />
              {signupErrors.email && <p className="error">{signupErrors.email}</p>}
              <input type='password' name='password' placeholder='Password' value={signupValues.password} onChange={handleSignupChange} />
              {signupErrors.password && <p className="error">{signupErrors.password}</p>}
              {signupErrors.general && <p className="error">{signupErrors.general}</p>}
              <button type="submit">Signup</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
