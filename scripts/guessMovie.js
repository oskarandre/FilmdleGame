import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../src/lib/firebase.js';

const guessMovie = async (userEmail, date, information) => {
    // Early return for guest user before any Firestore operations
    if (!userEmail || userEmail === 'guest') {
        console.log("Guest user - skipping Firestore operations");
        return;
    }

    try {
        const userRef = doc(db, "games", userEmail);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const gameData = userDoc.data();
            // Check if a game exists for the specified date
            if (gameData[date]) {
                // Initialize guesses_title and guesses_id if they don't exist
                const guessesTitle = gameData[date].guesses_title || [];
                const guessesId = gameData[date].guesses_id || [];

                // Check for duplicate guesses
                if (guessesTitle.includes(information.title)) {
                    console.log("You already guessed this movie!");
                    return;
                } else {
                    // Add guess to array
                    const updatedGuessTitle = [...guessesTitle, information.title];
                    const updatedGuessId = [...guessesId, information.id];

                    await setDoc(userRef, {
                        [date]: {
                            ...gameData[date],
                            guesses_title: updatedGuessTitle,
                            guesses_id: updatedGuessId
                        }
                    }, { merge: true });
                }
            } else {
                // Initialize the game data for the specified date if it doesn't exist
                const newGameData = {
                    [date]: {
                        guesses_title: [information.title],
                        guesses_id: [information.id],
                        correct_movie: gameData[date]?.correct_movie || null,
                        finished: gameData[date]?.finished || false,
                        gave_up: gameData[date]?.gave_up || false
                    }
                };
                await setDoc(userRef, newGameData, { merge: true });
                console.log(`No game found for ${userEmail} on ${date}, initializing new game data.`);
            }
        } else {
            console.log(`User ${userEmail} not found.`);
        }
    } catch (error) {
        console.error("Error adding guess to game:", error);
    }
};

export default guessMovie;