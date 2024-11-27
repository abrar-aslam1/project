import { NewsCard } from './NewsCard';
import { NewsArticle } from '../types/news';

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No news articles found.
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Latest Crypto News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div key={article.id || index} className="h-full">
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
