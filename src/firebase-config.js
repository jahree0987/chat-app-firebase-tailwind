// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAc6x1hzyc3F-o93g0pCxufXh-zjfHU3mg",
    authDomain: "chatapp-7d2f6.firebaseapp.com",
    projectId: "chatapp-7d2f6",
    storageBucket: "chatapp-7d2f6.appspot.com",
    messagingSenderId: "888977641878",
    appId: "1:888977641878:web:3225cbc65ffdc68412cdb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)