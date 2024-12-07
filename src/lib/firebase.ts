import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence, 
  Auth,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { UserPreferences } from '../types/news';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} as const;

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: ReturnType<typeof getFirestore>;

// Initialize Firebase if not already initialized
if (!getApps().length) {
  console.log('Initializing new Firebase app...');
  try {
    // Log the current URL for debugging
    console.log('Current URL:', window.location.origin);
    console.log('Firebase config:', {
      ...firebaseConfig,
      apiKey: '***' // Hide API key in logs
    });
    
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    throw error;
  }
} else {
  console.log('Using existing Firebase app');
  app = getApps()[0];
}

// Initialize Auth and Firestore
auth = getAuth(app);
db = getFirestore(app);

// Set persistence without blocking initialization
setPersistence(auth, browserLocalPersistence).catch((error: AuthError) => {
  console.error('Error setting persistence:', error);
});

// Helper functions for Firestore operations
export const saveUserPreferencesToFirestore = async (uid: string, preferences: UserPreferences) => {
  try {
    await setDoc(doc(db, 'users', uid), { preferences }, { merge: true });
    console.log('User preferences saved successfully');
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

export const getUserPreferencesFromFirestore = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().preferences;
    }
    return null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

// Export initialized instances
export { auth, db };

// Export a function to check Firebase initialization status
export const checkFirebaseInitialization = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      () => {
        unsubscribe();
        resolve(true);
      },
      () => {
        unsubscribe();
        resolve(true);
      }
    );
  });
};
