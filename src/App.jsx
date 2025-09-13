import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './lib/firebase.js';
import Header from './Header.jsx';
import Logout from './Logout.jsx';
import Login from './Login.jsx';
import LoginBtn from './LoginBtn.jsx';
import Stats from './stats.jsx';
import Archive from './Userarchive.jsx';
import FetchUserGameData from './FetchUserGameData.jsx';
import { GameCacheProvider } from './contexts/GameCacheContext.jsx';
import background from './assets/background_2.png';
import tmdbLogo from './assets/tmdbLogo.svg';

// REMOVE WHEN BUG IS FIXED
import Modal from './modal.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNavItem, setSelectedNavItem] = useState('todaysGame'); 
  const [showLogin, setShowLogin] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  // REMOVE WHEN BUG IS FIXED
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setShowLogin(false);
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLoginClose = () => {
    setSelectedNavItem('todaysGame');
    setShowLogin(false);
  };



  const renderContent = (userEmail) => {
    switch (selectedNavItem) {
      case 'todaysGame':
        return <FetchUserGameData userEmail={userEmail} date={today} />;
      case 'archive':
        if (user) {
          return <Archive userEmail={userEmail} />;
        }
        else{
          setTimeout(() => setShowLogin(true), 0);
          return null;
        }
      case 'stats':
        if (user) {
          return <Stats userEmail={userEmail} />;
        } else {
          setTimeout(() => setShowLogin(true), 0);
          return null;
        }
      default:
        return null;
    }
  };

  return (
    <GameCacheProvider>
      <div>
        <div className='bg'>
          <img className='bg-image' src={background} alt=""></img>
        </div>
        <div className='app'>
          {
            <>
              <div className='HeadWrapper'>
                <Header onNavItemClick={setSelectedNavItem} selectedNavItem={selectedNavItem} />
                {user ? <Logout /> : <LoginBtn onLoginClick={() => setShowLogin(true)} />}
              </div>
              <div className='content'>
                {renderContent(user ? user.email : null)}
              </div>
              {showLogin && <Login onClose={() => handleLoginClose()} />}

              {/* REMOVE WHEN BUG IS FIXED */}
              <Modal show={showModal} onClose={() => setShowModal(false)} /> {/* Add the Modal component */}

            </>
          }      
        
          
        </div>
        <div className='tmdb'>
            <p className='tmdbText'>Powered by</p>
            <img className='tmdbLogo' src={tmdbLogo} alt="TMDB Logo" />
          </div>
      </div>
    </GameCacheProvider>
  );
}


export default App;