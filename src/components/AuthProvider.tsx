import { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, NewsPreferences } from '../types/news';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (newDisplayName: string) => Promise<void>;
  loading: boolean;
  showPreferences: boolean;
  saveUserPreferences: (uid: string, preferences: NewsPreferences) => Promise<void>;
  tempUser: FirebaseUser | null;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  createAccount: async () => {},
  signOut: async () => {},
  updateDisplayName: async () => {},
  loading: false,
  showPreferences: false,
  saveUserPreferences: async () => {},
  tempUser: null,
  signInWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const authHook = useAuth();

  useEffect(() => {
    // Use onAuthStateChanged as a way to ensure Firebase Auth is initialized
    const unsubscribe = onAuthStateChanged(auth, () => {
      console.log('Firebase Auth is fully initialized');
      setIsFirebaseInitialized(true);
    }, (error) => {
      console.error('Error initializing Firebase Auth:', error);
      setIsFirebaseInitialized(true); // Set to true even on error to prevent infinite loading
    });

    return () => unsubscribe();
  }, []);

  if (!isFirebaseInitialized) {
    // Show loading state while Firebase initializes
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authHook}>
      {children}
    </AuthContext.Provider>
  );
}
