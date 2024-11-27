import * as React from 'react';
import axios from 'axios';
import { TrendingUp, Zap, Lock, Cpu } from 'lucide-react';
import { NewsArticle } from '../types/news';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

const getIconForCategory = (title: string): React.ReactElement => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('bitcoin') || lowerTitle.includes('btc')) {
    return <TrendingUp className="h-5 w-5" />;
  }
  if (lowerTitle.includes('ethereum') || lowerTitle.includes('eth') || 
      lowerTitle.includes('altcoin')) {
    return <Zap className="h-5 w-5" />;
  }
  if (lowerTitle.includes('defi') || lowerTitle.includes('protocol')) {
    return <Lock className="h-5 w-5" />;
  }
  if (lowerTitle.includes('nft') || lowerTitle.includes('token')) {
    return <Cpu className="h-5 w-5" />;
  }
  return <TrendingUp className="h-5 w-5" />;
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

export const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://crypto-news16.p.rapidapi.com/news/top/5',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

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
};
