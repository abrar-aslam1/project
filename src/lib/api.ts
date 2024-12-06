import { NewsArticle } from '../types/news';
import { sampleNews } from '../data/sampleNews';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export async function fetchTwitterFeed(account?: string): Promise<NewsArticle[]> {
  try {
    console.log('Fetching tweets for account:', account);
    const response = await fetch(`${API_BASE_URL}/twitterFeed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accounts_input: account // If no account is provided, the function will use default
      })
    });

    if (!response.ok) {
      throw new Error(`Twitter API request failed with status ${response.status}`);
    }

    const tweets = await response.json();
    console.log('Fetched tweets:', tweets);
    return tweets;
  } catch (error) {
    console.error('Error fetching Twitter feed:', error);
    return []; // Return empty array on error
  }
}

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cryptoNews`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to match our NewsArticle type
    const articles: NewsArticle[] = data.map((item: any, index: number) => {
      // Extract category and subcategory from title/description
      const categoryInfo = getCategoryInfo(item.title, item.description || '');
      
      return {
        id: index.toString(),
        title: item.title,
        description: item.description || item.title,
        source: item.source || 'Crypto News',
        link: item.url,
        icon: getIconForCategory(),
        category: categoryInfo.category,
        subCategory: categoryInfo.subCategory,
        publishedAt: item.date || new Date().toISOString(),
        isFavorite: false,
        type: 'article'
      };
    });

    return articles;
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    throw error; // Let the caller handle the error
  }
}

// Fetch all news (combining crypto news and Twitter feed)
export async function fetchAllNews(category?: string, subCategory?: string): Promise<NewsArticle[]> {
  try {
    console.log('Fetching news...', { category, subCategory });

    // If category is social and a subcategory (Twitter account) is specified
    if (category === 'social' && subCategory && subCategory.startsWith('@')) {
      const tweets = await fetchTwitterFeed(subCategory);
      console.log(`Successfully fetched ${tweets.length} tweets for ${subCategory}`);
      return tweets;
    }

    // If category is social but no specific account is selected
    if (category === 'social') {
      const tweets = await fetchTwitterFeed();
      console.log(`Successfully fetched ${tweets.length} tweets`);
      return tweets;
    }

    // For other categories, fetch both crypto news and tweets
    const [cryptoNews, twitterNews] = await Promise.all([
      fetchCryptoNews(),
      fetchTwitterFeed()
    ]);
    
    const allNews = [...cryptoNews, ...twitterNews];
    console.log(`Successfully fetched ${allNews.length} articles`);

    // Filter by category if specified
    if (category && category !== 'all') {
      return allNews.filter(article => article.category === category);
    }

    return allNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    console.log('Falling back to sample data');
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
