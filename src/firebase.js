import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; 

// Your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZGmlfS6AsqWsPBqpDZanoTbX67J-eK3c",
    authDomain: "mova-a0951.firebaseapp.com",
    databaseURL: "https://mova-a0951-default-rtdb.firebaseio.com",
    projectId: "mova-a0951",
    storageBucket: "mova-a0951.appspot.com",
    messagingSenderId: "880422966579",
    appId: "1:880422966579:web:fdc7759b5f22155b989a46",
    measurementId: "G-TZPJ4KMT5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

const storage = getStorage(app); // Initialize Firebase Storage

// Get an Auth instance
const auth = getAuth(app);

export { db, auth,storage };

