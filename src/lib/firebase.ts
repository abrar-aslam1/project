import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence, 
  Auth,
  onAuthStateChanged,
  User,
  AuthError,
  initializeAuth,
  indexedDBLocalPersistence
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

// Initialize Firebase lazily
let app: FirebaseApp;
let auth: Auth;
let db: ReturnType<typeof getFirestore>;

const initializeFirebase = () => {
  if (!app) {
    // Check if Firebase is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    try {
      // Try to initialize auth with IndexedDB for better performance
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence]
      });
    } catch (error) {
      // Fallback to default auth if IndexedDB is not available
      auth = getAuth(app);
      // Set persistence without blocking initialization
      setPersistence(auth, browserLocalPersistence).catch((error: AuthError) => {
        console.error('Error setting persistence:', error);
      });
    }

    // Initialize Firestore
    db = getFirestore(app);
  }
  return { auth, db };
};

// Helper functions for Firestore operations
export const saveUserPreferencesToFirestore = async (uid: string, preferences: UserPreferences) => {
  const { db } = initializeFirebase();
  try {
    await setDoc(doc(db, 'users', uid), { preferences }, { merge: true });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

export const getUserPreferencesFromFirestore = async (uid: string) => {
  const { db } = initializeFirebase();
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

// Initialize Firebase on first import
const { auth: initializedAuth, db: initializedDb } = initializeFirebase();

// Export initialized instances
export { initializedAuth as auth, initializedDb as db };

// Export a function to check Firebase initialization status
export const checkFirebaseInitialization = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const { auth } = initializeFirebase();
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
