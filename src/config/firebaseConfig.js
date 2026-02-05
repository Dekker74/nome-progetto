y// Firebase Configuration Template
// Follow these steps to set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing one)
// 3. Click on "Add app" and select Web (</>) icon
// 4. Register your app with a nickname
// 5. Copy the firebaseConfig object below
// 6. Go to Authentication → Sign-in method → Enable "Email/Password"

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// You can find this in: Project Settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
