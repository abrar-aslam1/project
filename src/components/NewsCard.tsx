import { NewsArticle } from '../types/news';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuthContext } from '../hooks/useAuthContext';
import { ExternalLink, Heart, Repeat2, Twitter } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { user } = useAuthContext();
  const { 
    title, 
    description, 
    source, 
    icon, 
    category, 
    subCategory, 
    link, 
    type,
    metrics,
    author 
  } = article;

  // Only show articles that match user preferences if they exist
  if (user?.newsPreferences) {
    const { categories, subCategories } = user.newsPreferences;
    const categoryMatch = categories.includes(category);
    const subCategoryMatch = subCategories.includes(subCategory);
    
    if (!categoryMatch || (subCategories.length > 0 && !subCategoryMatch)) {
      return null;
    }
  }

  // Function to clean and format the description text
  const formatDescription = (text: string) => {
    // Remove HTML tags but preserve line breaks
    return text
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<a.*?>/g, '')
      .replace(/<\/a>/g, '')
      .trim();
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-900">
      <CardHeader className="space-y-3 pb-4 px-6">
        <div className="flex items-center gap-3">
          <div className="text-purple-600 dark:text-purple-400 flex-shrink-0">
            {type === 'twitter' ? <Twitter className="h-5 w-5" /> : icon}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
            {type === 'twitter' ? `@${author}` : source}
          </span>
        </div>
        <CardTitle className="text-xl font-bold leading-tight hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line line-clamp-3">
          {formatDescription(description)}
        </CardDescription>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {category}
            </span>
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {subCategory}
            </span>
            {type === 'twitter' && metrics && (
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="h-4 w-4" />
                  {metrics.likes}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Repeat2 className="h-4 w-4" />
                  {metrics.retweets}
                </span>
              </div>
            )}
          </div>
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline"
          >
            {type === 'twitter' ? 'View Tweet' : 'Read more'}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
