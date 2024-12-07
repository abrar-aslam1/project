import { useState } from 'react';
import { LogIn, LogOut, User, Edit2, Loader2, UserPlus } from 'lucide-react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuthContext } from '../hooks/useAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserPreferencesDialog } from './UserPreferencesDialog';
import { UserPreferences } from '../types/news';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="currentColor"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="currentColor"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="currentColor"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="currentColor"
    />
  </svg>
);

export function AuthButton() {
  const { 
    user, 
    signIn, 
    createAccount, 
    signOut, 
    updateDisplayName, 
    loading: authLoading,
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
      setError(error.message || 'Failed to sign in');
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
      await createAccount(email, password);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Account creation error:', error);
      setError(error.message || 'Failed to create account');
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
    } catch (error: any) {
      console.error('Failed to update display name:', error);
    }
  };

  const handleSavePreferences = async (preferences: UserPreferences) => {
    if (tempUser) {
      try {
        await saveUserPreferences(tempUser.uid, preferences);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        setError('Failed to save preferences. Please try again.');
      }
    }
  };

  // Show minimal loading state while checking auth
  if (authLoading && !user) {
    return (
      <Button variant="ghost" size="sm" className="min-w-[40px] h-8 sm:h-10" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
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
                <span className="hidden sm:inline text-sm font-medium text-purple-600 dark:text-purple-400">
                  {user.displayName}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditingName(true);
                    setNewDisplayName(user.displayName || '');
                  }}
                  className="hidden sm:flex h-6 w-6 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900">
            <User className="h-4 w-4" />
            <span className="text-sm truncate max-w-[150px]">{user.email}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={signOut} 
          disabled={authLoading}
          className="min-w-[40px] h-8 sm:h-10"
        >
          {authLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 sm:h-10 px-3 sm:px-4">
            <LogIn className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] w-[calc(100%-2rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>
              Sign in to your account or create a new one to continue.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-10"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </Button>
                <div className="relative my-4">
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
                      className="h-10"
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
                      className="h-10"
                    />
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
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
                  className="w-full h-10"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </Button>
                <div className="relative my-4">
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
                      className="h-10"
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
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
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

      <UserPreferencesDialog
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
