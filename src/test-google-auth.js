// Test file to verify Google Auth setup
// This file can be removed after testing

import { signInWithGoogle } from './lib/auth.js';

// Test function to verify Google Auth is working
export const testGoogleAuth = async () => {
  console.log('Testing Google Authentication...');
  
  try {
    const result = await signInWithGoogle();
    if (result.error) {
      console.error('Google Auth Error:', result.error);
      return false;
    } else {
      console.log('Google Auth Success:', result.user);
      return true;
    }
  } catch (error) {
    console.error('Google Auth Exception:', error);
    return false;
  }
};

// Uncomment the line below to test when the page loads
// testGoogleAuth();
