import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
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

  const handleToggle = (item: string, isSubCategory: boolean = false) => {
    if (isSubCategory) {
      setSelectedSubCategories(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setSelectedCategories(prev => 
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  };

  const handleSave = () => {
    if (selectedCategories.length === 0) return;
    onSave({
      categories: selectedCategories,
      subCategories: selectedSubCategories
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-white">Interests</h2>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">
          Pick things you'd like to see in your news feed.
        </p>

        <div className="space-y-8">
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
                    onClick={() => handleToggle(category.id)}
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
                      onClick={() => handleToggle(sub, true)}
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
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={selectedCategories.length === 0}
            className={`w-full py-3 rounded-lg text-center font-medium transition-all ${
              selectedCategories.length === 0
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {selectedCategories.length === 0 ? 'Select at least 1 to continue' : 'Continue'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
