import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgffBgHNXRAw9NoxrHW5NRBVlbPuI0c8w",
  authDomain: "mess-3c72e.firebaseapp.com",
  projectId: "mess-3c72e",
  storageBucket: "mess-3c72e.appspot.com",
  messagingSenderId: "934962786207",
  appId: "1:934962786207:web:2ae4415d96511de67657aa",
  measurementId: "G-GFBBRJ9G4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return { success: true, user };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { success: false, error };
  }
};

// Email link authentication
const sendSignInLink = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending sign in link:', error);
    return { success: false, error };
  }
};

// Check if the current URL is a sign-in link
const isSignInLinkUrl = () => {
  return isSignInWithEmailLink(auth, window.location.href);
};

// Complete the sign in with email link
const signInWithEmail = async (email) => {
  try {
    let emailForSignIn = email || window.localStorage.getItem('emailForSignIn');
    if (!emailForSignIn) {
      emailForSignIn = window.prompt('Please provide your email for confirmation');
    }
    const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
    window.localStorage.removeItem('emailForSignIn');
    await result.user.reload();
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error signing in with email link:', error);
    return { success: false, error };
  }
};

// Sign out function
const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

export {
  app,
  analytics,
  auth,
  googleProvider,
  signInWithGoogle,
  sendSignInLink,
  isSignInLinkUrl,
  signInWithEmail,
  signOut,
  onAuthStateChanged
};