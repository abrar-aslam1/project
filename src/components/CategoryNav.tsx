import { ChevronDown } from 'lucide-react';
import { Button } from "../components/ui/button";
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
  const activeCategories = categories.find(c => c.id === activeCategory);
  const subCategories = activeCategories?.subCategories || [];

  return (
    <nav className="mb-12 glass-effect rounded-lg overflow-hidden theme-transition">
      <ul className="flex flex-wrap">
        {categories.map((category) => (
          <li key={category.id} className="flex-grow">
            <Button
              variant="ghost"
              className={`
                w-full rounded-none flex items-center justify-center space-x-2 py-6
                theme-transition
                ${activeCategory === category.id
                  ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400"
                  : "hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10 text-gray-400 hover:text-purple-400"
                }
              `}
              onClick={() => {
                onCategoryChange(category.id);
                onSubCategoryChange('all');
              }}
            >
              <span className={`
                ${activeCategory === category.id ? 'text-purple-400' : 'text-gray-400'}
              `}>
                {category.icon}
              </span>
              <span>{category.name}</span>
              {category.subCategories.length > 0 && (
                <ChevronDown className={`
                  h-4 w-4 transition-transform duration-200
                  ${activeCategory === category.id ? 'rotate-180 text-purple-400' : 'text-gray-400'}
                `} />
              )}
            </Button>
          </li>
        ))}
      </ul>
      {activeCategory !== 'all' && subCategories.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 p-4 flex flex-wrap justify-center">
          <Button
            key="all"
            variant={activeSubCategory === 'all' ? "default" : "outline"}
            size="sm"
            className={`
              m-1 rounded-full theme-transition
              ${activeSubCategory === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10'
              }
            `}
            onClick={() => onSubCategoryChange('all')}
          >
            All
          </Button>
          {subCategories.map((subCategory) => (
            <Button
              key={subCategory}
              variant={activeSubCategory === subCategory ? "default" : "outline"}
              size="sm"
              className={`
                m-1 rounded-full theme-transition
                ${activeSubCategory === subCategory
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  : 'hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10'
                }
              `}
              onClick={() => onSubCategoryChange(subCategory)}
            >
              {subCategory}
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
}
