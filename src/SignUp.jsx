import React, { useState } from 'react';
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { signUp } from './lib/auth.js';
import { db } from './lib/firebase.js';
import loginLogo from './assets/logo_white.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function saveUserToDb(userEmail) {
    const userGameDocRef = doc(db, 'games', userEmail);

    const initData = {
      'userData': {
        email: userEmail,
        gamesPlayed: 0,
        averageGuesses: 0,
        totalUnderTen: 0,
        dailyStreak: 0,
        maxStreak: 0,
        dates_finished: [],
        wins: 0,
        total_guesses:0
      },
    };


    setDoc(userGameDocRef, initData, { merge: true })
      .then(() => {
        console.log('User game data saved to Firestore!');
      })
      .catch(error => {
        console.error('Error saving user game data:', error);
      });
  }

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password);
      if (user) {
        setMessage('Sign up successful!');
        saveUserToDb(email);
        setError(null);
      }
    } catch (error) {
      setError('Error signing up: ' + error.message);
      setMessage(null);
    }
  };

  return (
    <div>
      <div className='login-header'>
        <img className="logo-login" src={loginLogo} />
        <h2>Sign up</h2>
      </div>

      <div className="input-box">
        <label>Email</label>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="input-box">
        <label>Password</label>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      <button onClick={handleSignUp}>Sign Up</button>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

    </div>
  );
};

export default SignUp;
