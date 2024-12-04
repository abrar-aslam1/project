import { Category } from '../types/news';
import { useAuthContext } from '../hooks/useAuthContext';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  activeSubCategory: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  activeSubCategory,
  onCategoryChange,
  onSubCategoryChange,
}: CategoryNavProps) {
  const { user } = useAuthContext();

  // Filter categories based on user preferences if they exist
  const filteredCategories = user?.preferences?.newsPreferences
    ? categories.filter(category => 
        category.id === 'all' || user.preferences?.newsPreferences.categories.includes(category.id)
      )
    : categories;

  return (
    <div className="space-y-4">
      {/* Main Categories */}
      <div className="flex flex-wrap gap-2">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onCategoryChange(category.id);
              onSubCategoryChange('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Subcategories */}
      {activeCategory !== 'all' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSubCategory === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories
            .find((c) => c.id === activeCategory)
            ?.subCategories.filter(sub => 
              !user?.preferences?.newsPreferences || user.preferences.newsPreferences.subCategories.includes(sub)
            )
            .map((subCategory) => (
              <button
                key={subCategory}
                onClick={() => onSubCategoryChange(subCategory)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeSubCategory === subCategory
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {subCategory}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
