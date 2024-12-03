import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence, 
  Auth,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} as const;

// Debug logging for environment variables
console.log('Environment Variables Status:', {
  apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: !!import.meta.env.VITE_FIREBASE_APP_ID
});

type FirebaseConfigKey = keyof typeof firebaseConfig;

// Validate configuration
const validateConfig = () => {
  const requiredFields: FirebaseConfigKey[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }

  // Log sanitized config for debugging
  console.log('Firebase Configuration:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    // Omit sensitive data
    apiKey: '***',
    appId: '***'
  });
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  console.log('Starting Firebase initialization...');
  validateConfig();
  
  // Check if Firebase is already initialized
  if (!getApps().length) {
    console.log('Initializing new Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    console.log('Using existing Firebase app');
    app = getApps()[0];
  }

  // Initialize Auth
  auth = getAuth(app);
  console.log('Firebase auth initialized successfully');

  // Set persistence
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase persistence set to local');
    })
    .catch((error: AuthError) => {
      console.error('Error setting persistence:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    });

  // Test auth state
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? 'User is signed in' : 'No user signed in');
  });

} catch (error) {
  if (error instanceof Error) {
    console.error('Firebase initialization error:', {
      message: error.message,
      stack: error.stack
    });
  }
  throw error;
}

// Export initialized auth instance
export { auth };

// Export a function to check Firebase initialization status
export const checkFirebaseInitialization = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      reject(new Error('Firebase Auth not initialized'));
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        console.log('Firebase initialization check:', user ? 'User is signed in' : 'No user signed in');
        unsubscribe();
        resolve(true);
      },
      (error: Error) => {
        console.error('Firebase initialization check error:', error);
        unsubscribe();
        reject(error);
      }
    );
  });
};
