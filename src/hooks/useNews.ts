import { useState, useEffect } from 'react';
import axios from 'axios';
import { NewsArticle } from '../types/news';
import { sampleNews } from '../data/sampleNews';

export function useNews(activeCategory: string, activeSubCategory: string) {
  const [news, setNews] = useState<NewsArticle[]>(sampleNews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, this would be an API call
        // const response = await axios.get('/api/news', {
        //   params: { category: activeCategory, subCategory: activeSubCategory }
        // });
        // setNews(response.data);
        
        // For now, we'll filter the sample news
        const filtered = sampleNews.filter(article => {
          const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
          const matchesSubCategory = activeSubCategory === 'all' || article.subCategory === activeSubCategory;
          return matchesCategory && matchesSubCategory;
        });
        
        setNews(filtered);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory, activeSubCategory]);

  return { news, loading, error };
}
