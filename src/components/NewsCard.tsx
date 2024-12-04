import { NewsArticle } from '../types/news';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuthContext } from '../hooks/useAuthContext';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { user } = useAuthContext();
  const { title, description, source, icon, category, subCategory } = article;

  // Only show articles that match user preferences if they exist
  if (user?.newsPreferences) {
    const { categories, subCategories } = user.newsPreferences;
    const categoryMatch = categories.includes(category);
    const subCategoryMatch = subCategories.includes(subCategory);
    
    if (!categoryMatch || (subCategories.length > 0 && !subCategoryMatch)) {
      return null;
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-500 dark:text-gray-400">{source}</span>
        </div>
        <CardTitle className="text-lg font-bold leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            {category}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {subCategory}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
