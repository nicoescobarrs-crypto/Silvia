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
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Initialize Firebase (compat SDK — no bundler required)
firebase.initializeApp(firebaseConfig);

// Shared Firestore reference used by script.js and admin.js
const db = firebase.firestore();
