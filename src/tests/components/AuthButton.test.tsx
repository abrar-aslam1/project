import { render, screen, fireEvent } from '@testing-library/react';
import { AuthButton } from '@/components/AuthButton';
import { useAuth } from '@/hooks/useAuth';
import { vi } from 'vitest';

vi.mock('@/hooks/useAuth');

describe('AuthButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in button when user is not authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AuthButton />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders user email and sign out button when authenticated', () => {
    const mockUser = {
      email: 'test@example.com',
    };

    (useAuth as any).mockReturnValue({
      user: mockUser,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AuthButton />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls signOut when clicking sign out button', () => {
    const mockSignOut = vi.fn();
    (useAuth as any).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: mockSignOut,
    });

    render(<AuthButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSignOut).toHaveBeenCalled();
  });
});