import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
