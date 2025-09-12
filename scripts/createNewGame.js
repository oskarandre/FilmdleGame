import { doc, setDoc } from "firebase/firestore";
import { db } from '../src/lib/firebase.js'; 
import fetchDailyMovie  from './fetchDailyMovie';
import updateUserData from "./updateUserData";

const createNewGame = async (userEmail, date, localUser = false) => {
  try {
    const userRef = doc(db, "games", userEmail);
    let movieData = await fetchDailyMovie(date);

    if (movieData) {
      console.log(`Fetched movie for: ${date}`, movieData);
      // Extract the movie ID from the document
      const movieId = movieData.id || movieData.movie_id;
      if (!movieId) {
        console.error("No movie ID found in movie data:", movieData);
        movieData = {
          correct_movie: "Error: No movie ID found",
          finished: false
        };
      } else {
        // Store just the movie ID, not the entire object
        movieData = {
          correct_movie: movieId,
          finished: false
        };
      }
    } else {
      console.log("No movie found for the specified date.");
      movieData = {
        correct_movie: "Error fetching todays movie",
        finished: false
      };
    }

    const updateData = {
      [date]: {
        correct_movie : movieData.correct_movie,
        finished: false,
        guesses_title: [],
        guesses_id: [],
        gave_up: false
      }
    };

    if (!localUser) {
      await setDoc(userRef, updateData, { merge: true });
    }

    console.log(`New game created for ${userEmail} on ${date}`);
  } catch (error) {
    console.error("Error creating new game:", error);
  }
};

export default createNewGame;
