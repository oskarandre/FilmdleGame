import React, { useState, useEffect } from 'react';
import { setDoc, getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase.js";
import DailyGame from './DailyGame';
import createNewGame from '../scripts/createNewGame';
import fetchDailyMovie from '../scripts/fetchDailyMovie';
import { useCurrentGameCache } from './hooks/useGameCache.js';

const UserGameData = ({ userEmail, date }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correctMovieId, setCorrectMovieId] = useState(null);
  const [movieGuesses, setMovieGuesses] = useState(null);
  const [newGameCreated, setNewGameCreated] = useState(false);
  const [finishedGame, setFinishedGame] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  
  // Use cache for guest users
  const isGuest = !userEmail;
  const {
    gameData: cachedGameData,
    isGameCached,
    isLoaded: cacheLoaded,
    correctMovieId: cachedCorrectMovieId,
    guesses: cachedGuesses,
    finished: cachedFinished,
    gaveUp: cachedGaveUp,
    updateGameData,
    clearCache
  } = useCurrentGameCache();

  useEffect(() => {
    const fetchUserGameData = async () => {
      try {
        // Handle guest users with local cache
        if (isGuest) {
          // Wait for cache to be loaded before proceeding
          if (!cacheLoaded) {
            console.log("Waiting for cache to load...");
            return;
          }
          
          // Check if we have cached data for today
          const today = new Date().toISOString().split('T')[0];
          const hasCachedData = cachedGameData && Object.keys(cachedGameData).length > 0;
          
          console.log("Cache check - hasCachedData:", hasCachedData, "cachedCorrectMovieId:", cachedCorrectMovieId, "cachedGameData:", cachedGameData);
          
          if (hasCachedData) {
            console.log("Loading guest game from cache:", cachedGameData);
            setCorrectMovieId(cachedCorrectMovieId);
            setMovieGuesses(cachedGuesses);
            setFinishedGame(cachedFinished);
            setGaveUp(cachedGaveUp);
            setIsLoading(false);
            return;
          } else {
            // No cached data at all - create new game
            console.log("No cached data found, creating new guest game");
            
            const movieData = await fetchDailyMovie(date);
            if (movieData) {
              const movieId = movieData.id || movieData.movie_id;
              if (movieId) {
                console.log("Guest user movie data:", movieData);
                console.log("Guest user movie ID:", movieId);
                
                // Save to cache
                updateGameData({
                  correctMovieId: movieId,
                  guesses: [],
                  finished: false,
                  gaveUp: false
                });
                
                setCorrectMovieId(movieId);
                setMovieGuesses([]);
                setFinishedGame(false);
                setGaveUp(false);
              } else {
                console.error("No movie ID found in guest user movie data:", movieData);
                setError("Error: No movie ID found");
              }
            } else {
              setError("Error fetching today's movie");
            }
            setIsLoading(false);
            return;
          }
        }

        // Handle registered users with Firebase
        let localUser = false;
        if (!userEmail) {
          userEmail = "guest";
          localUser = true;
        }

        const userGameDocRef = doc(db, "games", userEmail);
        const userGameDocSnap = await getDoc(userGameDocRef);

        if (userGameDocSnap.exists() && !localUser) {
          const userGameData = userGameDocSnap.data();

          if (userGameData.hasOwnProperty(date)) {
            // Handle both old format (correct_movie.id) and new format (correct_movie is just the ID)
            const correctMovie = userGameData[date].correct_movie;
            console.log("Correct movie data:", correctMovie);
            const movieId = correctMovie && typeof correctMovie === 'object' && correctMovie.id 
              ? correctMovie.id 
              : correctMovie; // fallback for old format or new format where it's just the ID
            console.log("Extracted movie ID:", movieId);
            setCorrectMovieId(movieId);
            setMovieGuesses(userGameData[date].guesses_id);
            setFinishedGame(userGameData[date].finished);
            setGaveUp(userGameData[date].gave_up);
          } else {
            console.log(`No game data found for ${date}, creating new game for user ${userEmail}`);
            await createNewGame(userEmail, date);
            // Refetch the data after creating the game
            const refetchUserGameDocSnap = await getDoc(userGameDocRef);
            if (refetchUserGameDocSnap.exists()) {
              const refetchUserGameData = refetchUserGameDocSnap.data();
              if (refetchUserGameData.hasOwnProperty(date)) {
                const correctMovie = refetchUserGameData[date].correct_movie;
                console.log("Correct movie data after refetch:", correctMovie);
                const movieId = correctMovie && typeof correctMovie === 'object' && correctMovie.id 
                  ? correctMovie.id 
                  : correctMovie; // fallback for old format or new format where it's just the ID
                console.log("Extracted movie ID after refetch:", movieId);
                setCorrectMovieId(movieId);
                setMovieGuesses(refetchUserGameData[date].guesses_id);
                setFinishedGame(refetchUserGameData[date].finished);
                setGaveUp(refetchUserGameData[date].gave_up);
              }
            }
            setNewGameCreated(true);
          }
        } else {
          console.log(`Creating new game for registered user on ${date}`);
          await createNewGame(userEmail, date, localUser);
          // Refetch the data after creating the game
          const refetchUserGameDocSnap = await getDoc(userGameDocRef);
          if (refetchUserGameDocSnap.exists()) {
            const refetchUserGameData = refetchUserGameDocSnap.data();
            if (refetchUserGameData.hasOwnProperty(date)) {
              const correctMovie = refetchUserGameData[date].correct_movie;
              console.log("Correct movie data after refetch:", correctMovie);
              const movieId = correctMovie && typeof correctMovie === 'object' && correctMovie.id 
                ? correctMovie.id 
                : correctMovie; // fallback for old format or new format where it's just the ID
              console.log("Extracted movie ID after refetch:", movieId);
              setCorrectMovieId(movieId);
              setMovieGuesses(refetchUserGameData[date].guesses_id);
              setFinishedGame(refetchUserGameData[date].finished);
              setGaveUp(refetchUserGameData[date].gave_up);
            }
          }
          setNewGameCreated(true);
        }
      } catch (error) {
        setError("Error fetching user game data");
        console.error("Error fetching user game data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGameData();
  }, [userEmail, date, newGameCreated, isGuest, cacheLoaded, isGameCached, cachedCorrectMovieId, cachedGuesses, cachedFinished, cachedGaveUp, updateGameData]);

  if (isLoading) {
    return <p>Loading game data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <DailyGame userEmail={userEmail} date={date} gameStatus={finishedGame} gaveUpStatus={gaveUp} correctMovieId={correctMovieId} movieGuesses={movieGuesses} />
    </div>
  );
};

export default UserGameData;