import { useState, useEffect } from 'react';
import { NewsArticle } from '../types/news';
import { fetchCryptoNews } from '../lib/api';

export const useNews = (selectedCategory: string, selectedSubCategory: string) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const allNews = await fetchCryptoNews();
        
        let filteredNews = allNews;
        
        if (selectedCategory !== 'all') {
          filteredNews = allNews.filter(article => 
            article.category.toLowerCase() === selectedCategory.toLowerCase()
          );
          
          if (selectedSubCategory) {
            filteredNews = filteredNews.filter(article =>
              article.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
            );
          }
        }
        
        setNews(filteredNews);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, selectedSubCategory]);

  return { news, loading, error };
};
