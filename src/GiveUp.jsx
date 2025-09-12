import React from 'react';
import { doc, setDoc, increment, updateDoc } from 'firebase/firestore'; 
import { db } from './lib/firebase.js';
import guessMovie from '../scripts/guessMovie.js'; 
import { useCurrentGameCache } from './hooks/useGameCache.js';
import skullIcon from './assets/skull-white.png'; 

function GiveUp({ userEmail, date, handleMovieSelectById, correctMovieId, setIsFinished, setGaveUp, nGuesses}) {
  const { saveGuess, finishGame, giveUpGame } = useCurrentGameCache();
  
  // Make sure to pass props as an object
  function setUserStats(userEmail, nGuesses) {
    // Reference to the game document in Firestore
    const userGameDocRef = doc(db, 'games', userEmail);
  
    const data = {
      "userData.gamesPlayed" : increment(1),
      "userData.total_guesses" : increment(nGuesses)
    };
  
    // Use updateDoc to merge specific fields without overwriting entire nested objects
    updateDoc(userGameDocRef, data)
      .then(() => {
        console.log('User game data updated successfully!');
      })
      .catch(error => {
        console.error('Error updating user game data:', error);
      });
  }

  async function giveUp(userEmail, date) {
    const isGuest = !userEmail;

    try {
      if (isGuest) {
        // Handle guest user with cache
        console.log('Guest user gave up - saving to cache');
        
        // Mark game as gave up in cache
        giveUpGame();
        
        // Select the correct movie to show the answer
        const information = await handleMovieSelectById(correctMovieId);
        
        // Save the correct movie as a guess in cache
        saveGuess(information);
        
        // Mark the game as finished
        finishGame();
        
        setIsFinished(true);
        setGaveUp(true);
      } else {
        // Handle registered user with Firebase
        const userGameDocRef = doc(db, 'games', userEmail);

        const finalGameData = {
          [date]: {
            finished: true,
            gave_up: true
          },
        };

        await setDoc(userGameDocRef, finalGameData, { merge: true });
        console.log('The user gave up.');

        // Select the correct movie to show the answer
        const information = await handleMovieSelectById(correctMovieId);

        // Simulate guessing the correct movie
        await guessMovie(userEmail, date, information);

        // Mark the game as finished
        setIsFinished(true);
        setUserStats(userEmail, nGuesses);
        setGaveUp(true);
      }
    } catch (error) {
      console.error('Error giving up:', error);
    }
  }

  return (
    <div className="give-up">
      <button className="btn-give-up" onClick={() => giveUp(userEmail, date)}>
        Give up? 
        <img className="skull-icon" src={skullIcon} alt="skull-icon"/>
      </button>
    </div>
  );
}

export default GiveUp;