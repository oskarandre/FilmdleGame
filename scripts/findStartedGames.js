import { db } from '../src/lib/firebase.js';
import { doc, getDoc } from "firebase/firestore";

export default async function findStartedGames(userEmail) {
    try {
        const userRef = doc(db, "games", userEmail);
        const userDoc = await getDoc(userRef);

        const startedGames = [];
        
        if (userDoc.exists()) {
            const gameData = userDoc.data();
            Object.keys(gameData).forEach(key => {
                const game = gameData[key];
                // The date is the key, not a property within correct_movie
                if (game.finished === false && game.guesses_id && game.guesses_id.length > 0) {
                    startedGames.push(key);
                }
            });
        }
        
        return startedGames;
    } catch (error) {
        console.error("Error fetching started games:", error);
        return null;
    }
}