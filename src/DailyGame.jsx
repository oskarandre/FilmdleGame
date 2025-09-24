import React, { useState, useEffect, useRef } from 'react';
import AddMovie from './addMovie.jsx';
import SearchBar from './SearchBar.jsx';
import guessMovie from '../scripts/guessMovie.js';
import { CollectInfo } from './CollectInfo';
import { useCurrentGameCache } from './hooks/useGameCache.js';
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
  const [showScrollIndicator, setShowScrollIndicator] = useState(false); // State for scroll indicator
  const answersRef = useRef(null); // Ref for the answers section
  
  // Use cache for guest users
  const isGuest = !userEmail;
  const { 
    saveGuess, 
    finishGame, 
    giveUpGame, 
    guesses: cachedGuesses, 
    finished: cachedFinished, 
    gaveUp: cachedGaveUp,
    isLoaded: cacheLoaded
  } = useCurrentGameCache();

  useEffect(() => {
    if (!hasLoadedGuesses && initialMovieGuesses && initialMovieGuesses.length > 0) {
      loadGuesses(initialMovieGuesses);
      setHasLoadedGuesses(true);
    }
  }, [initialMovieGuesses, hasLoadedGuesses]);

  // Load cached guesses for guest users
  useEffect(() => {
    if (isGuest && !hasLoadedGuesses && cacheLoaded) {
      console.log("Guest user - checking for cached guesses:", cachedGuesses);
      if (cachedGuesses && cachedGuesses.length > 0) {
        console.log("Loading cached guesses for guest user:", cachedGuesses);
        loadCachedGuesses(cachedGuesses);
      }
      setHasLoadedGuesses(true);
    }
  }, [isGuest, hasLoadedGuesses, cachedGuesses, cacheLoaded]);

  // Also load cached guesses when cache data changes
  useEffect(() => {
    if (isGuest && cacheLoaded && cachedGuesses && cachedGuesses.length > 0 && selectedMovies.length === 0) {
      console.log("Loading cached guesses on cache change:", cachedGuesses);
      loadCachedGuesses(cachedGuesses);
    }
  }, [isGuest, cacheLoaded, cachedGuesses, selectedMovies.length]);

  // Set game state from cache for guest users
  useEffect(() => {
    if (isGuest && cacheLoaded) {
      if (cachedFinished !== undefined) {
        setIsFinished(cachedFinished);
      }
      if (cachedGaveUp !== undefined) {
        setGaveUp(cachedGaveUp);
      }
    }
  }, [isGuest, cacheLoaded, cachedFinished, cachedGaveUp]);

  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [previousGuessCount, setPreviousGuessCount] = useState(0);
  
  // Scroll to top when guesses are first loaded (on page reload) to show most recent guess
  useEffect(() => {
    if (answersRef.current && selectedMovies.length > 0 && isInitialLoad) {
      // Use a small timeout to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        if (answersRef.current) {
          console.log("Scrolling to top on initial load. scrollHeight:", answersRef.current.scrollHeight, "clientHeight:", answersRef.current.clientHeight);
          // Scroll to top on initial load to show the most recent guess (which is at the top of the list)
          answersRef.current.scrollTo({
            top: 0,
            behavior: 'auto'
          });
        }
      }, 100);
      
      setIsInitialLoad(false);
      setPreviousGuessCount(selectedMovies.length);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedMovies.length, isInitialLoad]);

  // Auto-scroll to top when new guesses are added (but not on initial load)
  useEffect(() => {
    if (answersRef.current && selectedMovies.length > 0 && !isInitialLoad) {
      // Only auto-scroll if the number of guesses increased (new guess added)
      if (selectedMovies.length > previousGuessCount && previousGuessCount > 0) {
        answersRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      setPreviousGuessCount(selectedMovies.length);
    }
  }, [selectedMovies.length, previousGuessCount, isInitialLoad]);

  // Check if scroll indicator should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (answersRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = answersRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    if (answersRef.current) {
      checkScroll();
      answersRef.current.addEventListener('scroll', checkScroll);
    }

    return () => {
      if (answersRef.current) {
        answersRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, [selectedMovies.length, isInitialLoad]);

  async function loadGuesses(movieGuesses) {
    if (!movieGuesses || !Array.isArray(movieGuesses)) {
      console.warn("Invalid movieGuesses:", movieGuesses);
      return;
    }
    
    for (const movieId of movieGuesses) {
      if (movieId && typeof movieId === 'number') {
        await handleMovieSelectById(movieId);
      } else {
        console.warn("Skipping invalid movieId:", movieId);
      }
    }
  }

  async function loadCachedGuesses(cachedGuesses) {
    if (!cachedGuesses || !Array.isArray(cachedGuesses)) {
      console.warn("Invalid cached guesses:", cachedGuesses);
      return;
    }
    
    console.log("Loading cached guesses:", cachedGuesses);
    
    // Load each cached guess directly into selectedMovies
    const loadedMovies = [];
    for (const movieData of cachedGuesses) {
      if (movieData && movieData.id) {
        // The cached data should already have the full movie information
        loadedMovies.push(movieData);
      } else {
        console.warn("Skipping invalid cached movie data:", movieData);
      }
    }
    
    if (loadedMovies.length > 0) {
      setSelectedMovies(loadedMovies);
      console.log("Loaded cached movies:", loadedMovies);
    }
  }

  const handleMovieSelectById = async (movieId) => {
    if (!movieId || typeof movieId !== 'number') {
      console.error("Invalid movieId:", movieId);
      return null;
    }
    
    try {
      const information = await CollectInfo({ movie_id: movieId });
      if (information) {
        setSelectedMovies((prevSelectedMovies) => {
          if (!prevSelectedMovies.some(movie => movie.id === movieId)) {
            return [information, ...prevSelectedMovies];
          }
          return prevSelectedMovies;
        });
      }
      return information;
    } catch (error) {
      console.error("Error fetching movie info:", error);
      return null;
    }
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

      // Save guess - use cache for guest users, Firebase for registered users
      if (isGuest) {
        const success = saveGuess(information);
        if (!success) {
          console.log("You already guessed this movie!");
          return;
        }
      } else {
        await guessMovie(userEmail, date, information);
      }

      if (movie.id === correctMovieId) {
        // Mark game as finished
        if (isGuest) {
          finishGame();
        } else {
          finishedGame(userEmail, date);
        }
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

          <div className="answers-container">
            <div className="answers" ref={answersRef}>
              <AddMovie movies={selectedMovies} correctMovieId={correctMovieId} />
            </div>
            {showScrollIndicator && (
              <div className="scroll-indicator">
                <div className="scroll-arrow">↓</div>
                <span>Scroll for more guesses</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyGame;