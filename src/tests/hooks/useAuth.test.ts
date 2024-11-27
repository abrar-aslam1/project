import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../lib/firebase';
import { User } from 'firebase/auth';

// Mock firebase auth
vi.mock('../../lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    (auth.onAuthStateChanged as any).mockImplementation((callback: (user: User | null) => void) => {
      callback(mockUser as User);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
    });
  });

  it('handles sign out', async () => {
    const { result } = renderHook(() => useAuth());
    await result.current.signOut();
    expect(auth.signOut).toHaveBeenCalled();
  });
});
