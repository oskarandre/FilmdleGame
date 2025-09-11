import React, { useState } from 'react';
import { login } from './lib/auth.js';
import SignUp from './SignUp.jsx';
import loginLogo from './assets/logo_white.png';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false); 


  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await login(email, password);
    if (response.error) {
      setError(response.error);
    } else {
      setError(null);
    }
  };

  return (
    <div className='login-background'>
    {showSignUp ? (
      <div  className='login-page'> 
      <b className="back-to-login" onClick={() => setShowSignUp(false)}>Back</b>,
      <SignUp />
      </div>
    ) : (
    <div className='login-page'>
      <div className='close-btn'>
      <b className="close-login" onClick={onClose}>X</b>
      </div>
      <div className='login-header'> 
      <img className="logo-login" src={loginLogo} />
      <h2>Login</h2>
      </div>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>

        <div className= "input-box">
          <label>Email</label>
          <div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className= "input-box">
          <label>Password</label>
          <div>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <button type="submit">Login</button>
      </form>

      <a href="">Forgot your password?</a>
      <br />
      <br />
      <div>
      <b>New to Filmdle?</b>
      <a href="#" onClick={() => setShowSignUp(true)}>Create account</a>
      </div>
    </div>

    )}
      </div>

  );
};

export default Login;
