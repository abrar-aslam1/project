import { useState, useEffect } from 'react';
import { NewsArticle, NewsPreferences } from '../types/news';
import { fetchCryptoNews } from '../lib/api.tsx';  // Explicitly import from api.tsx
import { sampleNews } from '../data/sampleNews';

export const useNews = (
  selectedCategory: string, 
  selectedSubCategory: string,
  userPreferences?: NewsPreferences
) => {
  const [news, setNews] = useState<NewsArticle[]>(sampleNews); // Initialize with sample news
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        let allNews: NewsArticle[];
        
        try {
          console.log('Attempting to fetch news from API...');
          allNews = await fetchCryptoNews();
          console.log('API fetch successful, received articles:', allNews.length);
          console.log('First article:', JSON.stringify(allNews[0], null, 2));
        } catch (apiError) {
          console.warn('Failed to fetch from API, using sample data:', apiError);
          allNews = sampleNews;
          console.log('Using sample news, articles:', allNews.length);
          console.log('First sample article:', JSON.stringify(allNews[0], null, 2));
        }
        
        let filteredNews = allNews;

        // First apply user preferences if they exist and we're showing all categories
        if (selectedCategory === 'all' && userPreferences?.categories) {
          console.log('Filtering by user preferences:', userPreferences);
          filteredNews = allNews.filter(article => {
            // Check if article category matches any user preferred category
            const categoryMatch = userPreferences.categories.some(
              cat => article.category.toLowerCase() === cat.toLowerCase()
            );
            
            // Check if article subcategory matches any user preferred subcategory
            const subCategoryMatch = userPreferences.subCategories?.some(
              sub => article.subCategory.toLowerCase() === sub.toLowerCase()
            ) || false;
            
            // Show article if either category or subcategory matches
            return categoryMatch || subCategoryMatch;
          });
        }
        // Then apply specific category/subcategory filters if selected
        else if (selectedCategory !== 'all') {
          console.log(`Filtering by category: ${selectedCategory}`);
          filteredNews = allNews.filter(article => {
            const match = article.category.toLowerCase() === selectedCategory.toLowerCase();
            console.log(`Article category: ${article.category}, match: ${match}`);
            return match;
          });
          
          if (selectedSubCategory && selectedSubCategory !== 'all') {
            console.log(`Filtering by subcategory: ${selectedSubCategory}`);
            filteredNews = filteredNews.filter(article => {
              const match = article.subCategory.toLowerCase() === selectedSubCategory.toLowerCase();
              console.log(`Article subcategory: ${article.subCategory}, match: ${match}`);
              return match;
            });
          }
        }
        
        console.log('Final filtered news count:', filteredNews.length);
        console.log('Final filtered news:', JSON.stringify(filteredNews, null, 2));
        // Don't fallback to sample news if no matches are found
        setNews(filteredNews);
        setError(null);
      } catch (err) {
        console.error('Error in useNews hook:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
        setNews([]); // Set empty array instead of falling back to sample news
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, selectedSubCategory, userPreferences]);

  return { news, loading, error };
};
