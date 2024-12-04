import { NewsArticle } from '../types/news';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p className="text-lg text-gray-600 dark:text-gray-400">No news articles found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {articles.map((article) => (
          <div key={article.id} className="h-full">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
