import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4ScXY0w40sR68Dj4PHfmy8d1z1rTw67M",
    authDomain: "social-map-app-52315.firebaseapp.com",
    projectId: "social-map-app-52315",
    storageBucket: "social-map-app-52315.firebasestorage.app",
    messagingSenderId: "175731710290",
    appId: "1:175731710290:web:cf5ced377b0ca12a21828b"
  };  

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);