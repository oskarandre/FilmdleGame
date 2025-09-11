import { db } from '../src/lib/firebase.js';
import { doc, getDoc } from "firebase/firestore";

export default async function findFinishedGames(userEmail) {
    try {
        const userRef = doc(db, "games", userEmail);
        const userDoc = await getDoc(userRef);

        const finishedDates = [];
        const giveUpDates = [];
        
        if (userDoc.exists()) {
            const gameData = userDoc.data();
            Object.keys(gameData).forEach(key => {
                const game = gameData[key];
                if(game.gave_up){
                    giveUpDates.push(game.correct_movie.date);
                }
                else if(game.finished) {
                    finishedDates.push(game.correct_movie.date);
                }
            });
        }
        
        return {finishedDates, giveUpDates};
    } catch (error) {
        console.error("Error fetching finished games:", error);
        return null;
    }
}