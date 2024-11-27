import { useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types/news';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          favorites: []
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // If user doesn't have a display name, set it to the email username
      if (!userCredential.user.displayName) {
        const defaultDisplayName = email.split('@')[0];
        await updateProfile(userCredential.user, {
          displayName: defaultDisplayName
        });
        // Update local user state
        setUser(prev => prev ? {
          ...prev,
          displayName: defaultDisplayName
        } : null);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const updateDisplayName = async (newDisplayName: string) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: newDisplayName
        });
        // Update local user state
        setUser(prev => prev ? {
          ...prev,
          displayName: newDisplayName
        } : null);
      }
    } catch (error) {
      console.error('Update display name error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return { user, signIn, signOut, updateDisplayName };
}
