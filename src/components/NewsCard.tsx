import { ExternalLink, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { NewsArticle } from '../types/news';
import { ReactElement, cloneElement } from 'react';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  // Handle icon rendering
  const renderIcon = () => {
    if (article.icon && typeof article.icon !== 'string') {
      return cloneElement(article.icon as ReactElement, {
        className: 'h-5 w-5'
      });
    }
    return <TrendingUp className="h-5 w-5" />;
  };

  return (
    <a 
      href={article.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {article.title}
            </CardTitle>
            <div className="text-purple-600 dark:text-purple-400">
              {renderIcon()}
            </div>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
            {article.description.replace(/<[^>]*>/g, '')}
          </p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-center py-2 px-4 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
            Read more <ExternalLink className="ml-2 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </a>
  );
}
