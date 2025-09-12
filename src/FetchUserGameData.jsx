import React, { useState, useEffect } from 'react';
import { setDoc, getDocs, collection, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase.js";
import DailyGame from './DailyGame';
import createNewGame from '../scripts/createNewGame';
import fetchDailyMovie from '../scripts/fetchDailyMovie';

const UserGameData = ({ userEmail, date }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correctMovieId, setCorrectMovieId] = useState(null);
  const [movieGuesses, setMovieGuesses] = useState(null);
  const [newGameCreated, setNewGameCreated] = useState(false);
  const [finishedGame, setFinishedGame] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const fetchUserGameData = async () => {
      try {
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
          console.log(`Creating new game for guest user on ${date}`);
          await createNewGame(userEmail, date, localUser);
          // For guest users, we need to fetch the movie data directly since it's not stored in the database
          const movieData = await fetchDailyMovie(date);
          if (movieData) {
            const movieId = movieData.id || movieData.movie_id;
            if (movieId) {
              console.log("Guest user movie data:", movieData);
              console.log("Guest user movie ID:", movieId);
              setCorrectMovieId(movieId);
              setMovieGuesses([]);
              setFinishedGame(false);
              setGaveUp(false);
            } else {
              console.error("No movie ID found in guest user movie data:", movieData);
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
  }, [userEmail, date, newGameCreated, correctMovieId]);

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