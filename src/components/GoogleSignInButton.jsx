import React, { useState } from 'react';
import { signInWithGoogle } from '../lib/auth.js';

const GoogleSignInButton = ({ onSuccess, onError, className = "", disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        onError?.(result.error);
      } else {
        onSuccess?.(result.user);
      }
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={`google-signin-btn ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '10px 20px',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#3c4043',
        fontSize: '13px',
        fontWeight: '500',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        minWidth: '180px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
          e.target.style.borderColor = '#c1c7cd';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          e.target.style.borderColor = '#dadce0';
        }
      }}
    >
      {isLoading ? (
        <div 
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #4285f4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleSignInButton;
