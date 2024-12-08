import * as React from 'react';
import axios from 'axios';
import { TrendingUp, Zap, Lock, Cpu } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { sampleNews } from '../data/sampleNews';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

const getIconForCategory = (title: string): JSX.Element => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('bitcoin') || lowerTitle.includes('btc')) {
    return React.createElement(TrendingUp, { className: "h-5 w-5" });
  }
  if (lowerTitle.includes('ethereum') || lowerTitle.includes('eth') || 
      lowerTitle.includes('altcoin')) {
    return React.createElement(Zap, { className: "h-5 w-5" });
  }
  if (lowerTitle.includes('defi') || lowerTitle.includes('protocol')) {
    return React.createElement(Lock, { className: "h-5 w-5" });
  }
  if (lowerTitle.includes('nft') || lowerTitle.includes('token')) {
    return React.createElement(Cpu, { className: "h-5 w-5" });
  }
  return React.createElement(TrendingUp, { className: "h-5 w-5" });
};

const categorizeNews = (title: string): { category: string; subCategory: string } => {
  const content = title.toLowerCase();
  
  // Bitcoin
  if (content.includes('bitcoin') || content.includes('btc')) {
    if (content.includes('price') || content.includes('market')) {
      return { category: 'bitcoin', subCategory: 'Price Analysis' };
    }
    if (content.includes('mining')) {
      return { category: 'bitcoin', subCategory: 'Mining' };
    }
    if (content.includes('adoption')) {
      return { category: 'bitcoin', subCategory: 'Adoption' };
    }
    return { category: 'bitcoin', subCategory: 'Technology' };
  }

  // Altcoins
  if (content.includes('ethereum') || content.includes('eth')) {
    return { category: 'altcoins', subCategory: 'Ethereum' };
  }
  if (content.includes('ripple') || content.includes('xrp')) {
    return { category: 'altcoins', subCategory: 'Ripple' };
  }
  if (content.includes('cardano') || content.includes('ada')) {
    return { category: 'altcoins', subCategory: 'Cardano' };
  }
  if (content.includes('polkadot') || content.includes('dot')) {
    return { category: 'altcoins', subCategory: 'Polkadot' };
  }

  // DeFi
  if (content.includes('defi') || content.includes('protocol')) {
    if (content.includes('lending') || content.includes('loan')) {
      return { category: 'defi', subCategory: 'Lending' };
    }
    if (content.includes('dex') || content.includes('exchange')) {
      return { category: 'defi', subCategory: 'DEXs' };
    }
    if (content.includes('yield') || content.includes('farming')) {
      return { category: 'defi', subCategory: 'Yield Farming' };
    }
    if (content.includes('stablecoin')) {
      return { category: 'defi', subCategory: 'Stablecoins' };
    }
    return { category: 'defi', subCategory: 'Lending' };
  }

  // NFTs
  if (content.includes('nft') || content.includes('token')) {
    if (content.includes('art')) {
      return { category: 'nft', subCategory: 'Art' };
    }
    if (content.includes('game') || content.includes('gaming')) {
      return { category: 'nft', subCategory: 'Gaming' };
    }
    if (content.includes('collectible')) {
      return { category: 'nft', subCategory: 'Collectibles' };
    }
    if (content.includes('metaverse')) {
      return { category: 'nft', subCategory: 'Metaverse' };
    }
    return { category: 'nft', subCategory: 'Art' };
  }

  return { category: 'bitcoin', subCategory: 'Technology' };
};

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
    const response = await axios.get('/api/getCryptoNews');

    return response.data.map((item: any) => {
      const { category, subCategory } = categorizeNews(item.title);
      
      return {
        id: item.url,
        title: item.title,
        description: item.description || item.title,
        source: item.source || 'Crypto News',
        link: item.url,
        icon: getIconForCategory(item.title),
        category,
        subCategory,
        publishedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    throw error;
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
