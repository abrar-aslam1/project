import { NewsArticle } from '../types/news';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuthContext } from '../hooks/useAuthContext';
import { ExternalLink, Heart, MessageCircle, Repeat, Bookmark, Link } from 'lucide-react';

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
    metrics
  } = article;

  // Only show articles that match user preferences if they exist
  if (user?.preferences?.newsPreferences) {
    const { categories, subCategories } = user.preferences.newsPreferences;
    const categoryMatch = categories.includes(category);
    const subCategoryMatch = subCategories.includes(subCategory);
    
    if (!categoryMatch || (subCategories.length > 0 && !subCategoryMatch)) {
      return null;
    }
  }

  // Function to clean and format the text
  const formatText = (text: string) => {
    // Remove HTML tags but preserve line breaks
    let formattedText = text
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<a.*?>/g, '')
      .replace(/<\/a>/g, '')
      .trim();

    // Remove t.co URLs from the end of the text
    formattedText = formattedText.replace(/\s*https:\/\/t\.co\/\w+\s*$/g, '');

    return formattedText;
  };

  // Function to format numbers (e.g., 1000 -> 1K)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Get the formatted title and description
  const formattedTitle = formatText(title);
  const formattedDescription = formatText(description);

  // For tweets that are just URLs, show a more user-friendly title
  const displayTitle = formattedTitle || 'View Tweet Content';
  const shouldShowDescription = formattedDescription && formattedDescription !== displayTitle;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-900">
      <CardHeader className="space-y-3 pb-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="text-purple-600 dark:text-purple-400 flex-shrink-0">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
            {source}
          </span>
        </div>
        <CardTitle className="text-base sm:text-xl font-bold leading-tight hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2">
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
        {shouldShowDescription && (
          <CardDescription className="text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line line-clamp-3">
            {formattedDescription}
          </CardDescription>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2 flex-1">
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                {category}
              </span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                {subCategory}
              </span>
            </div>
          </div>
          
          {/* Twitter Metrics */}
          {type === 'tweet' && metrics && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(metrics.like_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="h-4 w-4" />
                <span>{formatNumber(metrics.retweet_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(metrics.reply_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                <span>{formatNumber(metrics.bookmark_count)}</span>
              </div>
            </div>
          )}

          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline"
          >
            {type === 'tweet' ? 'View Tweet' : 'Read more'}
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
