import { useState, useEffect } from 'react';
import { NewsArticle, NewsPreferences } from '../types/news';
import { fetchCryptoNews } from '../lib/api';
import { sampleNews } from '../data/sampleNews';

export function useNews(category: string, subCategory: string, preferences?: NewsPreferences) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Attempting to fetch news from API...');
        const articles = await fetchCryptoNews();
        
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
        } else {
          // If no preferences, filter based on selected category/subcategory
          filteredNews = articles.filter(article => {
            if (category === 'all') return true;
            if (subCategory === 'all') return article.category === category;
            return article.category === category && article.subCategory === subCategory;
          });
        }

        console.log('Final filtered news count:', filteredNews.length);
        console.log('Final filtered news:', filteredNews);
        
        setNews(filteredNews);
        setError(null);
      } catch (err) {
        console.error('Error fetching crypto news:', err);
        console.warn('Failed to fetch from API, using sample data:', err);
        
        // Use sample data as fallback
        console.log('Using sample news, articles:', sampleNews.length);
        console.log('First sample article:', sampleNews[0]);
        
        // Apply the same filtering logic to sample data
        let filteredNews = sampleNews;
        if (preferences) {
          filteredNews = sampleNews.filter(article => {
            const categoryMatch = preferences.categories.includes(article.category);
            if (categoryMatch && preferences.subCategories.length > 0) {
              return preferences.subCategories.includes(article.subCategory);
            }
            return categoryMatch;
          });
        } else {
          filteredNews = sampleNews.filter(article => {
            if (category === 'all') return true;
            if (subCategory === 'all') return article.category === category;
            return article.category === category && article.subCategory === subCategory;
          });
        }

        console.log('Final filtered news count:', filteredNews.length);
        console.log('Final filtered news:', filteredNews);
        
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
