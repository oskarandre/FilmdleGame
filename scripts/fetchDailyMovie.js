import { db } from '../src/lib/firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

const fetchDailyMovie = async (targetDate) => {
  try {
    if (!targetDate) {
      console.error("Error: targetDate is not defined");
      return null;
    }

    const moviesRef = collection(db, "Movies");

    //Query to find the movie document with specific date
    const q = query(moviesRef, where("date", "==", targetDate));

    // execute query
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const movieData = querySnapshot.docs[0].data();
      return movieData;
    } else {
      console.log(`No movie found for the date ${targetDate}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching daily movie:", error);
    return null;
  }
};

export default fetchDailyMovie;
