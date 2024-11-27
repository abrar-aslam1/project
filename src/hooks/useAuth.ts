import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types/news';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log('User authenticated:', firebaseUser);
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
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      setLoading(true);
      
      // First try to sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign in successful:', userCredential.user);
        
        // Set display name if not set
        if (!userCredential.user.displayName) {
          const defaultDisplayName = email.split('@')[0];
          await updateProfile(userCredential.user, {
            displayName: defaultDisplayName
          });
          console.log('Display name set to:', defaultDisplayName);
        }
      } catch (error: any) {
        // If user doesn't exist, create a new account
        if (error.code === 'auth/user-not-found') {
          console.log('User not found, creating new account');
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('New account created:', userCredential.user);
          
          // Set display name for new user
          const defaultDisplayName = email.split('@')[0];
          await updateProfile(userCredential.user, {
            displayName: defaultDisplayName
          });
          console.log('Display name set for new user:', defaultDisplayName);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error.code, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    try {
      console.log('Updating display name to:', newDisplayName);
      setLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: newDisplayName
        });
        console.log('Display name updated successfully');
        setUser(prev => prev ? {
          ...prev,
          displayName: newDisplayName
        } : null);
      }
    } catch (error) {
      console.error('Update display name error:', error);
      throw error;
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
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, signIn, signOut, updateDisplayName, loading };
}
