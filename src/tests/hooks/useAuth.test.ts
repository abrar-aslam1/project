import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { vi } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
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
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    };

    (auth.onAuthStateChanged as any).mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({
      ...mockUser,
      favorites: [],
    });
  });

  it('handles sign out', async () => {
    (auth.signOut as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(auth.signOut).toHaveBeenCalled();
  });
});