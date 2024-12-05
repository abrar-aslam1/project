import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  AuthError,
  AuthErrorCodes,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { auth, saveUserPreferencesToFirestore, getUserPreferencesFromFirestore } from '../lib/firebase';
import { User, UserPreferences } from '../types/news';

// Helper function to detect mobile devices
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [tempUser, setTempUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initializeAuth = async () => {
      try {
        // First check for any redirect result
        if (isMobileDevice()) {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            console.log('Redirect sign-in successful:', result.user.email);
            // Check for preferences
            const preferences = await getUserPreferencesFromFirestore(result.user.uid);
            if (!preferences) {
              setShowPreferences(true);
              setTempUser(result.user);
            }
          }
        }

        // Then set up the auth state listener
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            console.log('User authenticated:', firebaseUser.email);
            
            try {
              // Check for preferences
              const preferences = await getUserPreferencesFromFirestore(firebaseUser.uid);
              
              if (!preferences) {
                console.log('No preferences found, showing preferences dialog');
                setShowPreferences(true);
                setTempUser(firebaseUser);
                // Set basic user info but don't complete the sign-in flow
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                  photoURL: firebaseUser.photoURL,
                  favorites: []
                });
              } else {
                // If preferences exist, complete the sign-in flow
                console.log('Preferences found, completing sign-in');
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                  photoURL: firebaseUser.photoURL,
                  favorites: [],
                  preferences
                });
                setShowPreferences(false);
                setTempUser(null);
              }
            } catch (error) {
              console.error('Error checking preferences:', error);
              // On error, show preferences dialog
              setShowPreferences(true);
              setTempUser(firebaseUser);
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL: firebaseUser.photoURL,
                favorites: []
              });
            }
          } else {
            console.log('No user authenticated');
            setUser(null);
            setShowPreferences(false);
            setTempUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error in auth initialization:', error);
        setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication error:', error);
    let errorMessage = 'An error occurred. Please try again.';
    
    if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in was cancelled.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Sign-in popup was blocked. Please allow popups for this site.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }

    throw new Error(errorMessage);
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      if (isMobileDevice()) {
        console.log('Using redirect for mobile device');
        await signInWithRedirect(auth, provider);
        // The redirect will reload the page, and the result will be handled in useEffect
      } else {
        console.log('Using popup for desktop device');
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign in successful:', result.user.email);
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email: string, password: string) => {
    try {
      console.log('Creating new account for:', email);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const defaultDisplayName = email.split('@')[0];
      await updateProfile(userCredential.user, {
        displayName: defaultDisplayName
      });
      
      setTempUser(userCredential.user);
      setShowPreferences(true);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserPreferences = async (uid: string, preferences: UserPreferences) => {
    try {
      setLoading(true);
      await saveUserPreferencesToFirestore(uid, preferences);
      
      setUser(prev => prev ? {
        ...prev,
        preferences
      } : null);
      
      setShowPreferences(false);
      setTempUser(null);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      await updateProfile(currentUser, {
        displayName: newDisplayName
      });
      
      setUser(prev => prev ? {
        ...prev,
        displayName: newDisplayName
      } : null);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    signIn, 
    createAccount, 
    signOut, 
    updateDisplayName, 
    loading,
    showPreferences,
    saveUserPreferences,
    tempUser,
    signInWithGoogle
  };
}
