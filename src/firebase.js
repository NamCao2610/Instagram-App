import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAL-Pz4U5AA7c_h6SydxZ2ukbN9b5iSWHE",
    authDomain: "instagram-ede5b.firebaseapp.com",
    databaseURL: "https://instagram-ede5b.firebaseio.com",
    projectId: "instagram-ede5b",
    storageBucket: "instagram-ede5b.appspot.com",
    messagingSenderId: "1022772859044",
    appId: "1:1022772859044:web:11c8707bc4ef583887d631",
    measurementId: "G-4RCQJJ6MZ9"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export { db, auth, storage, googleAuthProvider, facebookAuthProvider, firebase };