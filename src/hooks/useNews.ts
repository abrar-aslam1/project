import { useState, useEffect } from 'react';
import { NewsArticle, NewsPreferences } from '../types/news';
import { fetchAllNews } from '../lib/api';
import { sampleNews } from '../data/sampleNews';

export function useNews(category: string, subCategory?: string, preferences?: NewsPreferences) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Fetching news...', { category, subCategory });
        const articles = await fetchAllNews(category, subCategory);
        
        // Filter news based on user preferences if they exist
        let filteredNews = articles;
        if (preferences) {
          filteredNews = articles.filter(article => {
            // Check if the article's category is in user's preferred categories
            const categoryMatch = preferences.categories.includes(article.category);
            
            // If subcategories exist for this category, check for subcategory match
            if (categoryMatch && preferences.subCategories.length > 0) {
              return preferences.subCategories.includes(article.subCategory);
            }
            
            return categoryMatch;
          });
        }

        console.log('Final filtered news count:', filteredNews.length);
        setNews(filteredNews);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        console.warn('Failed to fetch from API, using sample data');
        
        // Use sample data as fallback
        let filteredNews = sampleNews;
        if (preferences) {
          filteredNews = sampleNews.filter(article => {
            const categoryMatch = preferences.categories.includes(article.category);
            if (categoryMatch && preferences.subCategories.length > 0) {
              return preferences.subCategories.includes(article.subCategory);
            }
            return categoryMatch;
          });
        } else if (category !== 'all') {
          filteredNews = sampleNews.filter(article => {
            if (subCategory) {
              return article.category === category && article.subCategory === subCategory;
            }
            return article.category === category;
          });
        }

        setNews(filteredNews);
        setError('Failed to fetch latest news. Showing sample data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, subCategory, preferences]);

  return { news, loading, error };
}
