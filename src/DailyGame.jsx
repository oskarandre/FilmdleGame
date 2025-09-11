import React, { useState, useEffect } from 'react';
import AddMovie from './addMovie.jsx';
import SearchBar from './SearchBar.jsx';
import guessMovie from '../scripts/guessMovie.js';
import { CollectInfo } from './CollectInfo';
import './index.css';
import startConfetti from './YouWin.jsx';
import GiveUp from './GiveUp.jsx';

import { db } from './lib/firebase.js';
import { setDoc, doc, increment, updateDoc } from "firebase/firestore";
import filmdleLogo from './assets/filmdle-text.png';

function finishedGame(userEmail, date) {
  if (!userEmail) return; // Skip for guest user

  const userGameDocRef = doc(db, 'games', userEmail);

  const initData = {
    [date]: {
      finished: true
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

//updating stats for personal view.
function setUserStats(userEmail, guesses, win) {
  if (!userEmail) return; // Skip for guest user

  // Reference to the game document in Firestore
  const userGameDocRef = doc(db, 'games', userEmail);

  const data = {
    finished: true,                             // Mark the game as finished
    "userData.total_guesses": increment(guesses + 1), // Increment total_guesses by the number of guesses in this game
    "userData.wins": win ? increment(1) : increment(0), // Increment wins by 1 if it's a win
    "userData.gamesPlayed": increment(1),
    "userData.totalUnderTen": guesses < 11 ? increment(1) : increment(0)
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

function DailyGame({ userEmail, date, gameStatus, gaveUpStatus, correctMovieId, movieGuesses: initialMovieGuesses }) {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [hasLoadedGuesses, setHasLoadedGuesses] = useState(false); // New state to track if guesses are loaded
  const [isFinished, setIsFinished] = useState(false); // New state to track if game is finished
  const [gaveUp, setGaveUp] = useState(false); // New state to track if user gave up

  useEffect(() => {
    if (!hasLoadedGuesses && initialMovieGuesses && initialMovieGuesses.length > 0) {
      loadGuesses(initialMovieGuesses);
      setHasLoadedGuesses(true);
    }
  }, [initialMovieGuesses, hasLoadedGuesses]);

  async function loadGuesses(movieGuesses) {
    for (const movieId of movieGuesses) {
      await handleMovieSelectById(movieId);
    }
  }

  const handleMovieSelectById = async (movieId) => {
    const information = await CollectInfo({ movie_id: movieId });
    setSelectedMovies((prevSelectedMovies) => {
      if (!prevSelectedMovies.some(movie => movie.id === movieId)) {
        return [information, ...prevSelectedMovies];
      }
      return prevSelectedMovies;
    });
    return information;
  };

  const handleMovieSelect = async (movie) => {
    if (isFinished || gameStatus === false) {
      const information = await CollectInfo({ movie_id: movie.id });
      setSelectedMovies((prevSelectedMovies) => {
        if (!prevSelectedMovies.some(m => m.id === movie.id)) {
          return [information, ...prevSelectedMovies];
        }
        return prevSelectedMovies;
      });

      await guessMovie(userEmail, date, information);

      if (movie.id === correctMovieId) {
        finishedGame(userEmail, date);
        setUserStats(userEmail, selectedMovies.length, true);
        setIsFinished(true);
        startConfetti();
      }
    } else {
      console.log('Game is already finished');
    }
  };

  return (
    <div className="Game">
      <div className="game-interface">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-10 text-center">
            <div className="search-logo-container">
              <div className="logo-box">
                <img src={filmdleLogo} className="logo" alt="Logo" />
              </div>
              {isFinished || gameStatus ? (
                <div className="Winning-Card">
                  {gaveUp || gaveUpStatus ? (
                    <h2>You gave up. Better luck next time...</h2>
                  ) : (
                    <h2>Well played! You guessed the movie!</h2>
                  )}
                </div>
              ) : (
                <>
                  <SearchBar handleMovieSelect={handleMovieSelect} />
                </>
              )}
            </div>
          </div>
          <div className="col-md-1 text-right">
            <div className="game-info">
              <div className="display-date">
                <h2 className="text-white">{date}</h2>
              </div>
              <div className="display-guesses">
                <h3 className="text-white">Guesses: {selectedMovies.length}</h3>
              </div>
              <GiveUp userEmail={userEmail} date={date} handleMovieSelectById={handleMovieSelectById} correctMovieId={correctMovieId} setIsFinished={setIsFinished} setGaveUp={setGaveUp} nGuesses={selectedMovies.length} />
            </div>
          </div>
        </div>

        <div id="game-container" className="game-container">
          <div className="row">
            <div className="col">
              <div className="movie_poster">
                <h2>Movie</h2>
              </div>
            </div>

            <div className="col">
              <div className="movie_genre">
                <h2>Genre</h2>
                <div className="genre_list"></div>
              </div>
            </div>

            <div className="col">
              <div className="movie_year">
                <h2>Release year</h2>
              </div>
            </div>

            <div className="col">
              <div className="movie_director">
                <h2>Director</h2>
              </div>
            </div>

            <div className="col">
              <div className="movie_actors">
                <h2>Actors</h2>
              </div>
            </div>

            <div className="col">
              <div className="movie_rating">
                <h2>Rating</h2>
              </div>
            </div>
          </div>

          <div className="row">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="col" id="separator">
                <hr />
              </div>
            ))}
          </div>

          <div className="answers">
            <AddMovie movies={selectedMovies} correctMovieId={correctMovieId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyGame;