import { NewsPreferences } from '../types/news';
import { fetchAllNews } from '../lib/api';
import { sampleNews } from '../data/sampleNews';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useNews(category: string, subCategory?: string, preferences?: NewsPreferences) {
  // Use React Query for data fetching and caching
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['news', category, subCategory],
    queryFn: async () => {
      try {
        console.log('Fetching news...', { category, subCategory });
        const data = await fetchAllNews(category, subCategory);
        return data;
      } catch (err) {
        console.warn('Failed to fetch from API, using sample data');
        // Use sample data as fallback
        if (category === 'all') {
          return sampleNews;
        }
        return sampleNews.filter(article => {
          if (subCategory) {
            return article.category === category && article.subCategory === subCategory;
          }
          return article.category === category;
        });
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    retry: 1, // Only retry failed requests once
  });

  // Memoize filtered news to prevent unnecessary recalculations
  const filteredNews = useMemo(() => {
    if (!articles) return [];

    if (preferences) {
      return articles.filter(article => {
        // Check if the article's category is in user's preferred categories
        const categoryMatch = preferences.categories.includes(article.category);
        
        // If subcategories exist for this category, check for subcategory match
        if (categoryMatch && preferences.subCategories.length > 0) {
          return preferences.subCategories.includes(article.subCategory);
        }
        
        return categoryMatch;
      });
    }

    return articles;
  }, [articles, preferences]);

  // Format error message
  const errorMessage = error 
    ? 'Failed to fetch latest news. Showing sample data.'
    : null;

  return { 
    news: filteredNews, 
    loading: isLoading, 
    error: errorMessage,
    // Additional metadata for optimizations
    isStale: false, // React Query handles staleness
    lastUpdated: new Date().toISOString(),
  };
}
