import { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, UserPreferences } from '../types/news';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, getRedirectResult, browserPopupRedirectResolver } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateDisplayName: (newDisplayName: string) => Promise<void>;
  loading: boolean;
  showPreferences: boolean;
  saveUserPreferences: (uid: string, preferences: UserPreferences) => Promise<void>;
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
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);
  const authHook = useAuth();

  useEffect(() => {
    let mounted = true;

    // Handle redirect result and set up auth state listener
    const initialize = async () => {
      try {
        // Handle any pending redirect result first
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth, browserPopupRedirectResolver);
        if (result) {
          console.log('Redirect result processed:', result.user.email);
        } else {
          console.log('No redirect result found');
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      } finally {
        if (mounted) {
          setIsHandlingRedirect(false);
        }
      }
    };

    // Initialize redirect handling
    initialize();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('Auth state changed:', user ? 'User is signed in' : 'No user signed in');
        if (mounted) {
          setIsFirebaseInitialized(true);
        }
      },
      (error) => {
        console.error('Error initializing Firebase Auth:', error);
        if (mounted) {
          setIsFirebaseInitialized(true);
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Show loading state while Firebase initializes or handling redirect
  if (!isFirebaseInitialized || isHandlingRedirect) {
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
