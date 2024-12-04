import { useState, useCallback, MouseEvent } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { categories } from '../data/categories';
import { NewsPreferences } from '../types/news';
import { ArrowLeft } from 'lucide-react';

interface NewsPreferencesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: NewsPreferences) => void;
}

export function NewsPreferencesDialog({ open, onClose, onSave }: NewsPreferencesDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = useCallback((e: MouseEvent<HTMLButtonElement>, item: string, isSubCategory: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null); // Clear any previous error
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

  const handleSave = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        categories: selectedCategories,
        subCategories: selectedSubCategories
      });
      // Reset state after successful save
      setSelectedCategories([]);
      setSelectedSubCategories([]);
      setError(null);
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedCategories, selectedSubCategories, onSave]);

  const handleClose = useCallback(() => {
    // Only allow closing if not saving and no categories are selected
    if (!isSaving && selectedCategories.length === 0) {
      onClose();
    }
  }, [isSaving, selectedCategories.length, onClose]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleClose} 
      modal={true}
    >
      <DialogContent 
        className="max-w-md bg-gray-900 border-gray-800" 
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside if saving or categories selected
          if (isSaving || selectedCategories.length > 0) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with escape key if saving or categories selected
          if (isSaving || selectedCategories.length > 0) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Prevent any outside interactions if saving or categories selected
          if (isSaving || selectedCategories.length > 0) {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          // Prevent dialog from closing when clicking inside
          e.preventDefault();
          e.stopPropagation();
        }}
        onOpenAutoFocus={(e) => {
          // Prevent focus from causing dialog to close
          e.preventDefault();
        }}
      >
        <DialogTitle asChild>
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Only allow closing if not saving and no categories selected
                if (!isSaving && selectedCategories.length === 0) {
                  onClose();
                }
              }}
              className="text-white hover:text-white/80"
              disabled={isSaving || selectedCategories.length > 0}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Interests</h2>
          </div>
        </DialogTitle>
        
        <div className="space-y-8" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <p className="text-sm text-gray-400 mb-6">
            Pick things you'd like to see in your news feed.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Main Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              <h3 className="font-semibold text-white">Trending</h3>
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
                    disabled={isSaving}
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
                      disabled={isSaving}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedCategories.length === 0 || isSaving}
            className={`w-full py-3 rounded-lg text-center font-medium transition-all ${
              selectedCategories.length === 0 || isSaving
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {isSaving ? 'Saving...' : selectedCategories.length === 0 ? 'Select at least 1 to continue' : 'Continue'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
