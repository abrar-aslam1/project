import { createContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, UserPreferences } from '../types/news';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, getRedirectResult } from 'firebase/auth';

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
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);
  const authHook = useAuth();

  useEffect(() => {
    // Handle redirect result without blocking the UI
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect result processed:', result.user.email);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      } finally {
        setIsCheckingRedirect(false);
      }
    };

    // Start checking redirect result
    checkRedirectResult();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log('Auth state changed:', user ? 'User is signed in' : 'No user signed in');
      },
      (error) => {
        console.error('Error in auth state change:', error);
      }
    );

    return unsubscribe;
  }, []);

  // Show a minimal loading indicator in the corner instead of blocking the whole UI
  const loadingIndicator = (isCheckingRedirect || authHook.loading) && (
    <div className="fixed top-4 right-4 z-50">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <AuthContext.Provider value={authHook}>
      {loadingIndicator}
      {children}
    </AuthContext.Provider>
  );
}
