import { db } from '../src/lib/firebase.js';
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getStats(userEmail) {
    try {
        const userRef = doc(db, "games", userEmail);
        const userDoc = await getDoc(userRef);
        
        const stats = {
            gamesPlayed: 0,
            averageGuesses: 0,
            totalUnderTen: 0,
            dailyStreak: 0,
            maxStreak: 0,
            total_guesses: 0,
            wins: 0
        };

        if (userDoc.exists()) {
            const userData = userDoc.data();

            stats.gamesPlayed = userData["userData"].gamesPlayed;
            stats.averageGuesses = userData["userData"].averageGuesses;
            stats.totalUnderTen = userData["userData"].totalUnderTen;
            stats.dailyStreak = userData["userData"].dailyStreak;
            stats.maxStreak = userData["userData"].maxStreak;
            
            stats.total_guesses = userData["userData"].total_guesses
            stats.wins = userData["userData"].wins

        }    
        return stats;
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
    }
}

export async function uploadStats (userEmail, gamesPlayed, averageGuesses, totalUnderTen, dailyStreak, maxStreak) {
    try {
        const userRef = doc(db, "games", userEmail);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {

            const userData = userDoc.data();

            if(gamesPlayed){userData["userData"].gamesPlayed = gamesPlayed;}
            if(averageGuesses){userData["userData"].averageGuesses = averageGuesses;}
            if(totalUnderTen){userData["userData"].totalUnderTen = totalUnderTen;}
            if(dailyStreak){userData["userData"].dailyStreak = dailyStreak;}
            if(maxStreak){userData["userData"].maxStreak = maxStreak;}

            console.log(userData);
            
            await setDoc(userRef, {userData}, {merge: true});
        }
    } catch (error) {
        console.error("Error uploading user stats:", error);
    }
}