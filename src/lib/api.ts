import { NewsArticle } from '../types/news';
import { sampleNews } from '../data/sampleNews';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

export async function fetchTwitterFeed(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching Twitter feed...');
    const response = await fetch('/api/getTwitterFeed');
    if (!response.ok) {
      throw new Error(`Twitter API request failed with status ${response.status}`);
    }
    const tweets = await response.json();
    
    // Transform tweets to include the new Twitter category
    const transformedTweets = tweets.map((tweet: NewsArticle) => ({
      ...tweet,
      category: 'twitter',
      subCategory: determineTwitterSubCategory(tweet.description),
      type: 'twitter'
    }));
    
    console.log('Fetched tweets:', transformedTweets);
    return transformedTweets;
  } catch (error) {
    console.error('Error fetching Twitter feed:', error);
    return [];
  }
}

// Helper function to determine Twitter subcategory based on content
function determineTwitterSubCategory(content: string): string {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('price') || lowerContent.includes('chart') || 
      lowerContent.includes('buy') || lowerContent.includes('sell')) {
    return 'Trading';
  }
  
  if (lowerContent.includes('project') || lowerContent.includes('launch') || 
      lowerContent.includes('update') || lowerContent.includes('announcement')) {
    return 'Projects';
  }
  
  return 'Influencers'; // Default subcategory
}

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching crypto news...');
    const response = await fetch('https://crypto-news16.p.rapidapi.com/news/top/50', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched crypto news:', data);
    
    // Transform API response to match our NewsArticle type
    const articles: NewsArticle[] = data.map((item: any, index: number) => {
      // Extract category and subcategory from title/description
      const categoryInfo = getCategoryInfo(item.title, item.description);
      
      return {
        id: index.toString(),
        title: item.title,
        description: item.description,
        source: item.source || 'Crypto News',
        link: item.url,
        icon: getIconForCategory(),
        category: categoryInfo.category,
        subCategory: categoryInfo.subCategory,
        publishedAt: new Date().toISOString(), // API doesn't provide date
        isFavorite: false,
        type: 'article'
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return sample news as fallback
    return sampleNews;
  }
}

// Fetch both crypto news and Twitter feed
export async function fetchAllNews(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching all news...');
    const [news, tweets] = await Promise.all([
      fetchCryptoNews(),
      fetchTwitterFeed()
    ]);

    console.log('News count:', news.length);
    console.log('Tweets count:', tweets.length);

    // Combine and sort by date
    const allNews = [...news, ...tweets].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    console.log('Total combined news count:', allNews.length);
    return allNews;
  } catch (error) {
    console.error('Error fetching all news:', error);
    return sampleNews;
  }
}

// Helper function to determine category and subcategory from content
function getCategoryInfo(title: string, description: string): { category: string; subCategory: string } {
  const content = (title + ' ' + description).toLowerCase();
  
  // Default category
  let category = 'bitcoin';
  let subCategory = 'Technology';

  // Bitcoin related
  if (content.includes('bitcoin') || content.includes('btc')) {
    category = 'bitcoin';
    if (content.includes('price') || content.includes('market') || content.includes('trading')) {
      subCategory = 'Price Analysis';
    } else if (content.includes('mining')) {
      subCategory = 'Mining';
    } else if (content.includes('adoption') || content.includes('regulation')) {
      subCategory = 'Adoption';
    }
  }
  // Altcoins
  else if (content.includes('ethereum') || content.includes('eth')) {
    category = 'altcoins';
    subCategory = 'Ethereum';
  }
  else if (content.includes('cardano') || content.includes('ada')) {
    category = 'altcoins';
    subCategory = 'Cardano';
  }
  // DeFi
  else if (content.includes('defi') || content.includes('yield') || content.includes('lending')) {
    category = 'defi';
    if (content.includes('lending') || content.includes('borrow')) {
      subCategory = 'Lending';
    } else if (content.includes('yield') || content.includes('farming')) {
      subCategory = 'Yield';
    }
  }
  // NFTs
  else if (content.includes('nft') || content.includes('token')) {
    category = 'nft';
    if (content.includes('art') || content.includes('artist')) {
      subCategory = 'Art';
    } else if (content.includes('game') || content.includes('gaming')) {
      subCategory = 'Gaming';
    }
  }

  return { category, subCategory };
}

// Helper function to get icon based on category
function getIconForCategory(): React.ReactNode {
  // This should return the appropriate icon component
  // For now, returning null as icons are handled in the UI components
  return null;
}
