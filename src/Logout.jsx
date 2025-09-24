import React, { useState } from 'react';
import { logout } from './lib/auth.js';

const Logout = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    const response = await logout();
    if (response.error) {
      setError(response.error);
    } else {
      setMessage(response.message);
      // window.location.reload(); // Reload the page to reset the state
    }
  };

  return (
    
    <div>
      <button id="logout-btn" className="btn btn-danger ml-1" onClick={handleLogout}>Logout</button>
    </div>
    
  );
};

export default Logout;
