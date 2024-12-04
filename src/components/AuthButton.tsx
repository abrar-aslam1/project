import { useState } from 'react';
import { LogIn, LogOut, User, Edit2, Loader2, UserPlus } from 'lucide-react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuthContext } from '../hooks/useAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NewsPreferencesDialog } from './NewsPreferencesDialog';
import { NewsPreferences } from '../types/news';
import { Separator } from './ui/separator';

export function AuthButton() {
  const { 
    user, 
    signIn, 
    createAccount, 
    signOut, 
    updateDisplayName, 
    loading,
    showPreferences,
    saveUserPreferences,
    tempUser,
    signInWithGoogle
  } = useAuthContext();
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
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Failed to sign in. Please try again');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Creating account with:', { email });
      await createAccount(email, password);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Account creation error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(error.message || 'Failed to create account. Please try again');
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

  const handleSavePreferences = async (preferences: NewsPreferences) => {
    if (tempUser) {
      try {
        await saveUserPreferences(tempUser.uid, preferences);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        setError('Failed to save preferences. Please try again.');
      }
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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSignIn} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      minLength={6}
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      minLength={6}
                      autoComplete="new-password"
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
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <NewsPreferencesDialog
        open={showPreferences}
        onClose={() => {
          // Do nothing here since the dialog state is managed by useAuth
          // The dialog will close automatically when preferences are saved
        }}
        onSave={handleSavePreferences}
      />
    </>
  );
}
