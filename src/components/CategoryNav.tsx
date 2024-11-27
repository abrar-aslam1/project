import { Category } from '../types/news';

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
  const activeMainCategory = categories.find(cat => cat.id === activeCategory);
  const hasSubCategories = activeMainCategory?.subCategories && activeMainCategory.subCategories.length > 0;

  return (
    <nav className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {hasSubCategories && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSubCategoryChange('all')}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              activeSubCategory === 'all'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          {activeMainCategory?.subCategories.map((subCategory) => (
            <button
              key={subCategory}
              onClick={() => onSubCategoryChange(subCategory)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                activeSubCategory === subCategory
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {subCategory}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
