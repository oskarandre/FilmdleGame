import React from "react";

const LoginBtn = ({ onLoginClick }) => {

    const handleLogin = () => {
        onLoginClick();
    };

  return (
    <div>
      <button id="login-btn" className="btn btn-danger ml-1" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginBtn;
