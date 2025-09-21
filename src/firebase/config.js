// Firebase configuration for OficioGo
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For development/demo purposes - in production, use environment variables
const firebaseConfig = {
  apiKey: "demo-api-key-for-local-development",
  authDomain: "oficiogo-demo.firebaseapp.com",
  projectId: "oficiogo-demo",
  storageBucket: "oficiogo-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id-for-development"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;