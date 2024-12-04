import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { categories } from '../data/categories';
import { UserPreferences } from '../types/news';
import { ArrowLeft } from 'lucide-react';

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
        darkMode: initialPreferences?.darkMode || false
      });
      setError(null);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedCategories, selectedSubCategories, initialPreferences?.darkMode, onSave]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={onClose}
      modal={true}
    >
      <DialogContent className="w-[95vw] max-w-2xl bg-gray-900 border-gray-800 p-4 sm:p-6">
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
            <h2 className="text-xl font-bold text-white">News Preferences</h2>
          </div>
        </DialogTitle>

        <div className="space-y-6">
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
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm transition-all ${
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
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm transition-all ${
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
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6">
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
