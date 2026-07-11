/**
 * ============================================================
 *  FIREBASE CONFIGURATION
 * ============================================================
 *  1. Go to https://console.firebase.google.com/
 *  2. Create a free project (or use an existing one).
 *  3. In the project, go to Project settings > General,
 *     scroll to "Your apps", click the "</>" (web) icon,
 *     register an app, and Firebase will show you an object
 *     that looks just like the one below.
 *  4. Copy YOUR values and paste them in place of the
 *     placeholders ("YOUR_..._HERE").
 *  5. Make sure you've also enabled Firestore Database
 *     (see the README instructions at the end of the chat
 *     for step-by-step guidance).
 * ============================================================
 */

const firebaseConfig = {
  apiKey: "AIzaSyDK8g4D17RUm2J0eddTWTz38ZmVdjJfy2w",
  authDomain: "silvia-5cc41.firebaseapp.com",
  projectId: "silvia-5cc41",
  storageBucket: "silvia-5cc41.firebasestorage.app",
  messagingSenderId: "silvia-5cc41.firebasestorage.app",
  appId: "1:194212500531:web:dbb8e369e79cdd0b413f46"
};

// Initialize Firebase (compat SDK — no bundler required)
firebase.initializeApp(firebaseConfig);

// Shared Firestore reference used by script.js and admin.js
const db = firebase.firestore();
