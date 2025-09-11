import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where} from 'firebase/firestore';
import { db } from './lib/firebase.js';


//fetch movie from database based on date

export const secretMovie = async (date) => {
    //convert date to string
    date = date.toISOString().split('T')[0];
        console.log(date);
        const q = query(collection(db, "Movies"), where("date", "==", date));
        const querySnapshot = await getDocs(q);
      
        if (querySnapshot.empty) {
          console.log("No movies found for the specified date.");
          return null;
        }
      
        const movieData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      
        return movieData;
};