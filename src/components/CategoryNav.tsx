import { categories } from '../data/categories';
import { useState } from 'react';

interface CategoryNavProps {
  onCategoryChange: (category: string, subCategory?: string) => void;
}

export function CategoryNav({ onCategoryChange }: CategoryNavProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(undefined);
    onCategoryChange(categoryId);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    onCategoryChange(selectedCategory, subCategory);
  };

  return (
    <div className="space-y-4">
      {/* Main categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {selectedCategory !== 'all' && (
        <div className="flex flex-wrap gap-2">
          {categories
            .find((cat) => cat.id === selectedCategory)
            ?.subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryClick(sub)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedSubCategory === sub
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {sub}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
