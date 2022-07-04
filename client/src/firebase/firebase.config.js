import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDVxdoUYk1oy51Ny6YfiPUwAAGWR4x86bk",
   authDomain: "tm-auth-30721.firebaseapp.com",
   projectId: "tm-auth-30721",
   storageBucket: "tm-auth-30721.appspot.com",
   messagingSenderId: "491752604789",
   appId: "1:491752604789:web:64abcf9c804a1d7bcde43c",
}

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app);
