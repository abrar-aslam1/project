import { createContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, UserPreferences } from '../types/news';
import { User as FirebaseUser } from 'firebase/auth';

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
  const authHook = useAuth();

  // Show a minimal loading indicator in the corner instead of blocking the whole UI
  const loadingIndicator = authHook.loading && (
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
