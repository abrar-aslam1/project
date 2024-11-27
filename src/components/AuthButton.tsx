import { useState } from 'react';
import { LogIn, LogOut, User, Edit2, Loader2 } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from '../hooks/useAuth';

export function AuthButton() {
  const { user, signIn, signOut, updateDisplayName, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later');
      } else {
        setError('Failed to sign in. Please try again');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) return;
    try {
      await updateDisplayName(newDisplayName);
      setIsEditingName(false);
      setNewDisplayName('');
    } catch (error) {
      console.error('Failed to update display name:', error);
    }
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setError(null);
      setEmail('');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="New display name"
                  className="h-6 text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleUpdateDisplayName}
                  className="h-6 px-2"
                >
                  Save
                </Button>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {user.displayName}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditingName(true);
                    setNewDisplayName(user.displayName || '');
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900">
            <User className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut} disabled={loading}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In or Create Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
            />
            <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Sign In / Create Account'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
