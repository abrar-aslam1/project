import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult
} from 'firebase/auth';
import { auth, saveUserPreferencesToFirestore, getUserPreferencesFromFirestore } from '../lib/firebase';
import { User, UserPreferences } from '../types/news';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [tempUser, setTempUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const initializeAuth = async () => {
      try {
        // Set up the auth state listener
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
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.customData) {
      console.error('Custom data:', error.customData);
    }
    
    let errorMessage = 'An error occurred. Please try again.';
    
    if (!navigator.onLine) {
      errorMessage = 'No internet connection. Please check your network and try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please try again later.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in window was closed. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Only one sign-in window can be open at a time.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
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
      
      console.log('Using popup for sign in');
      const result = await signInWithPopup(auth, provider).catch(error => {
        console.error('Popup error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (error.customData) {
          console.error('Custom data:', error.customData);
        }
        throw error;
      });

      if (result.user) {
        console.log('Google sign-in successful:', result.user.email);
        const preferences = await getUserPreferencesFromFirestore(result.user.uid);
        if (!preferences) {
          setShowPreferences(true);
          setTempUser(result.user);
        }
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
