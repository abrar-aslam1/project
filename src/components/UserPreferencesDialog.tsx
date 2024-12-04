import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { categories } from '../data/categories';
import { UserPreferences, TwitterAccount } from '../types/news';
import { ArrowLeft, Trash2, Twitter } from 'lucide-react';

interface UserPreferencesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences;
}

export function UserPreferencesDialog({ 
  open, 
  onClose, 
  onSave,
  initialPreferences 
}: UserPreferencesDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialPreferences?.newsPreferences?.categories || []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    initialPreferences?.newsPreferences?.subCategories || []
  );
  const [twitterAccounts, setTwitterAccounts] = useState<TwitterAccount[]>(
    initialPreferences?.twitterAccounts || []
  );
  const [newTwitterAccount, setNewTwitterAccount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>, item: string, isSubCategory: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    if (isSubCategory) {
      setSelectedSubCategories(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setSelectedCategories(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  }, []);

  const handleAddTwitterAccount = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newTwitterAccount) return;

    const username = newTwitterAccount.replace('@', '').trim();
    if (!username) {
      setError('Please enter a valid Twitter username');
      return;
    }

    if (twitterAccounts.some(account => account.username === username)) {
      setError('This account is already in your list');
      return;
    }

    setTwitterAccounts(prev => [...prev, {
      username,
      addedAt: new Date().toISOString()
    }]);
    setNewTwitterAccount('');
    setError(null);
  }, [newTwitterAccount, twitterAccounts]);

  const handleRemoveTwitterAccount = useCallback((username: string) => {
    setTwitterAccounts(prev => prev.filter(account => account.username !== username));
  }, []);

  const handleSave = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        newsPreferences: {
          categories: selectedCategories,
          subCategories: selectedSubCategories
        },
        twitterAccounts,
        darkMode: initialPreferences?.darkMode || false
      });
      setError(null);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedCategories, selectedSubCategories, twitterAccounts, initialPreferences?.darkMode, onSave]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={onClose}
      modal={true}
    >
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogTitle asChild>
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Preferences</h2>
          </div>
        </DialogTitle>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="news">News Preferences</TabsTrigger>
            <TabsTrigger value="twitter">Twitter Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-8">
            <p className="text-sm text-gray-400">
              Pick categories you'd like to see in your news feed.
            </p>

            {/* Main Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📈</span>
                <h3 className="font-semibold text-white">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  category.id !== 'all' && (
                    <button
                      key={category.id}
                      type="button"
                      onClick={(e) => handleToggle(e, category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCategories.includes(category.id)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  )
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {categories.map(category => (
              category.id !== 'all' && selectedCategories.includes(category.id) && (
                <div key={`sub-${category.id}`} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h3 className="font-semibold text-white">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.subCategories.map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={(e) => handleToggle(e, sub, true)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          selectedSubCategories.includes(sub)
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="twitter" className="space-y-6">
            <p className="text-sm text-gray-400">
              Add Twitter accounts you want to follow for news and updates.
            </p>

            <form onSubmit={handleAddTwitterAccount} className="flex gap-2">
              <Input
                type="text"
                placeholder="@username"
                value={newTwitterAccount}
                onChange={(e) => setNewTwitterAccount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button type="submit" variant="secondary">
                Add Account
              </Button>
            </form>

            <div className="space-y-3">
              {twitterAccounts.map(account => (
                <div 
                  key={account.username}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-purple-400" />
                    <span className="text-white">@{account.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTwitterAccount(account.username)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <Button
            onClick={handleSave}
            disabled={selectedCategories.length === 0 || isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
