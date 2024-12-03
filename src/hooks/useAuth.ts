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
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types/news';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('User authenticated:', firebaseUser.email);
        console.log('User details:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified
        });
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          favorites: []
        });
      } else {
        console.log('No user authenticated');
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthError = async (error: AuthError) => {
    console.error('Authentication error details:', {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack,
      customData: error.customData
    });

    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    // Map Firebase error codes to user-friendly messages
    let errorMessage = 'An error occurred. Please try again.';
    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        errorMessage = 'An account already exists with this email.';
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        errorMessage = 'Invalid email format.';
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        errorMessage = 'Password is too weak. It must be at least 6 characters.';
        break;
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        errorMessage = 'Email/Password authentication is not enabled.';
        break;
      case AuthErrorCodes.USER_DISABLED:
        errorMessage = 'This account has been disabled.';
        break;
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        errorMessage = 'Too many attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection and try again.';
        break;
      case 'auth/internal-error':
        errorMessage = 'An internal error occurred. Please try again.';
        break;
      default:
        errorMessage = `Authentication error: ${error.message}`;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.name = error.name;
    enhancedError.stack = error.stack;
    throw enhancedError;
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      setLoading(true);

      // Check if email exists first
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        throw new Error('No account exists with this email. Please create an account first.');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.email);
      
      if (!userCredential.user.displayName) {
        const defaultDisplayName = email.split('@')[0];
        await updateProfile(userCredential.user, {
          displayName: defaultDisplayName
        });
        console.log('Display name set to:', defaultDisplayName);
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Creating new account for:', email);
      setLoading(true);
      
      // Validate email and password before attempting creation
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error('An account already exists with this email. Please sign in instead.');
      }

      console.log('Attempting to create user account with Firebase...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created successfully:', userCredential.user.email);
      
      const defaultDisplayName = email.split('@')[0];
      console.log('Setting display name to:', defaultDisplayName);
      
      await updateProfile(userCredential.user, {
        displayName: defaultDisplayName
      });
      console.log('Display name set successfully');
    } catch (error: any) {
      console.error('Detailed account creation error:', {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack,
        customData: error.customData,
        email: email,
        passwordLength: password?.length
      });
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    try {
      console.log('Updating display name to:', newDisplayName);
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      await updateProfile(currentUser, {
        displayName: newDisplayName
      });
      console.log('Display name updated successfully');
      
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
      console.log('Attempting sign out');
      setLoading(true);
      await firebaseSignOut(auth);
      console.log('Sign out successful');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return { user, signIn, createAccount, signOut, updateDisplayName, loading };
}
