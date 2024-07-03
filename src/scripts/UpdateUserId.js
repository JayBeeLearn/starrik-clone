import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; 
import { v4 as uuidv4 } from 'uuid'; 

const UpdateUserId = async () => {
  try {
    const usersCollection = collection(db, "independentriders");
    const usersSnapshot = await getDocs(usersCollection);
    
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (!userData.uniqueId) {
        const uniqueId = uuidv4();
        await updateDoc(doc(db, "independentriders", userDoc.id), { uniqueId });
        console.log(`Updated user ${userDoc.id} with uniqueId ${uniqueId}`);
      }
    });
    console.log("All users have been updated with unique IDs.");
  } catch (error) {
    console.error("Error updating users with unique IDs:", error);
  }
};

UpdateUserId();
