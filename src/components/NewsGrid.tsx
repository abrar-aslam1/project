import { useNews } from '../hooks/useNews';
import { NewsCard } from './NewsCard';
import { memo, useCallback, useRef, useEffect } from 'react';

interface NewsGridProps {
  category: string;
  subCategory?: string;
}

export const NewsGrid = memo(function NewsGrid({ category, subCategory }: NewsGridProps) {
  const { news, loading, error } = useNews(category, subCategory);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Callback for intersection observer
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-4');
        entry.target.classList.add('opacity-100', 'translate-y-0');
      }
    });
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (gridRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      });

      const cards = gridRef.current.children;
      Array.from(cards).forEach(card => {
        if (observerRef.current) {
          observerRef.current.observe(card);
        }
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, news]);

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{
              animationDelay: `${i * 100}ms`
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {news.map((article, index) => (
        <div 
          key={article.id}
          className="opacity-0 translate-y-4 transition-all duration-500 ease-out"
          style={{
            transitionDelay: `${index * 100}ms`
          }}
        >
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
});
