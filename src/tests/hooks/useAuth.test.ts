import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { User } from 'firebase/auth';
import { UserPreferences } from '../../types/news';

// Mock firebase auth
const mockAuth = {
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  signInWithRedirect: vi.fn(),
  signInWithPopup: vi.fn(),
  getRedirectResult: vi.fn(),
};

vi.mock('../../lib/firebase', () => ({
  auth: mockAuth,
  saveUserPreferencesToFirestore: vi.fn(),
  getUserPreferencesFromFirestore: vi.fn(),
}));

// Mock navigator.userAgent for mobile detection
Object.defineProperty(navigator, 'userAgent', {
  value: '',
  writable: true
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset userAgent to desktop
    Object.defineProperty(navigator, 'userAgent', { value: 'Mozilla/5.0 Chrome' });
  });

  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('updates user on auth state change', async () => {
    const mockUser: Partial<User> = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
    };

    mockAuth.onAuthStateChanged.mockImplementation((callback: (user: User | null) => void) => {
      callback(mockUser as User);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      favorites: []
    });
  });

  it('handles sign out', async () => {
    const { result } = renderHook(() => useAuth());
    await result.current.signOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  describe('Google Sign In', () => {
    it('uses popup for desktop devices', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockAuth.signInWithPopup).toHaveBeenCalled();
      expect(mockAuth.signInWithRedirect).not.toHaveBeenCalled();
    });

    it('uses redirect for mobile devices', async () => {
      // Set userAgent to mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 iPhone'
      });

      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(mockAuth.signInWithRedirect).toHaveBeenCalled();
      expect(mockAuth.signInWithPopup).not.toHaveBeenCalled();
    });

    it('handles redirect result on mobile', async () => {
      // Set userAgent to mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 iPhone'
      });

      const mockRedirectUser: Partial<User> = {
        uid: '456',
        email: 'redirect@example.com',
        displayName: 'Redirect User',
      };

      mockAuth.getRedirectResult.mockResolvedValue({
        user: mockRedirectUser
      });

      renderHook(() => useAuth());

      // Wait for redirect result to be processed
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockAuth.getRedirectResult).toHaveBeenCalled();
    });
  });

  describe('User Preferences', () => {
    it('shows preferences dialog for new users', async () => {
      const mockUser: Partial<User> = {
        uid: '123',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockAuth.onAuthStateChanged.mockImplementation((callback: (user: User | null) => void) => {
        callback(mockUser as User);
        return () => {};
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.showPreferences).toBe(true);
      expect(result.current.tempUser).toBeTruthy();
    });

    it('saves user preferences', async () => {
      const mockPreferences: UserPreferences = {
        newsPreferences: {
          categories: ['tech', 'science'],
          subCategories: []
        },
        darkMode: false
      };

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.saveUserPreferences('123', mockPreferences);
      });

      expect(result.current.showPreferences).toBe(false);
      expect(result.current.tempUser).toBeNull();
    });
  });
});
