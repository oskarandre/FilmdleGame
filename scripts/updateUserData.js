import { doc, setDoc } from "firebase/firestore";
import { db } from '../src/lib/firebase.js'; 


const updateUserData = async (userEmail) => {
  try {
    const userRef = doc(db, "games", userEmail);
    
    console.log("userRef: " , userRef);

    const updateData = {
      ["userData"]: {
        games_played: 1
      }
    };

    await setDoc(userRef, updateData, { merge: true });

    console.log(`Info updated for ${userEmail}`);
  } catch (error) {
    console.error("Error updating user info:", error);
  }
};

export default updateUserData;
