import { NewsCard } from './NewsCard';
import { NewsArticle } from '../types/news';

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <section>
      <h3 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Latest Crypto News</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={article.id || index} article={article} />
        ))}
      </div>
    </section>
  );
}
