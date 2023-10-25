import { initializeApp, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAmHjn779EEJZPH9lUL_zseWdo4eY8-M44",
    authDomain: "chatapp-39c2b.firebaseapp.com",
    projectId: "chatapp-39c2b",
    storageBucket: "chatapp-39c2b.appspot.com",
    messagingSenderId: "552496471104",
    appId: "1:552496471104:web:4ba0bed09db37bf9ad13a5",
    measurementId: "G-X3SQ65RRQG"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export { db, auth };
