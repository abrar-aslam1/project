import { NewsArticle } from '../types/news';
import { Bitcoin, Coins, Wallet, Frame, Twitter } from 'lucide-react';

export const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin Surges Past $50,000 Mark',
    description: 'The world\'s leading cryptocurrency has broken through a key resistance level...',
    source: 'CryptoDaily',
    link: '#',
    icon: <Bitcoin className="h-5 w-5" />,
    category: 'bitcoin',
    subCategory: 'Price Analysis',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'article'
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Upgrade: What You Need to Know',
    description: 'The long-awaited upgrade to the Ethereum network is set to revolutionize...',
    source: 'BlockchainInsider',
    link: '#',
    icon: <Coins className="h-5 w-5" />,
    category: 'altcoins',
    subCategory: 'Ethereum',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'article'
  },
  {
    id: '3',
    title: 'DeFi Protocol Hacked: $100M Lost',
    description: 'In a shocking turn of events, a popular decentralized finance protocol...',
    source: 'DeFiWatch',
    link: '#',
    icon: <Wallet className="h-5 w-5" />,
    category: 'defi',
    subCategory: 'Lending',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'article'
  },
  {
    id: '4',
    title: 'Bored Ape NFT Sells for Record $3.4 Million',
    description: 'A rare Bored Ape Yacht Club NFT has sold for an unprecedented amount...',
    source: 'NFTWorld',
    link: '#',
    icon: <Frame className="h-5 w-5" />,
    category: 'nft',
    subCategory: 'Art',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'article'
  },
  {
    id: '5',
    title: 'Just analyzed the BTC chart patterns...',
    description: 'Looking at the 4H timeframe, we\'re seeing a clear bullish divergence. Key resistance at $48k needs to break for continuation. Stay patient! 📈',
    source: 'CryptoAnalyst',
    link: '#',
    icon: <Twitter className="h-5 w-5" />,
    category: 'twitter',
    subCategory: 'Trading',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'twitter',
    author: 'cryptoanalyst',
    metrics: {
      likes: 1200,
      retweets: 450
    }
  },
  {
    id: '6',
    title: 'Exciting news! Our DeFi protocol just...',
    description: 'We\'re thrilled to announce the launch of our new lending platform with innovative yield strategies. Full details in the thread below! 🚀',
    source: 'DeFiProject',
    link: '#',
    icon: <Twitter className="h-5 w-5" />,
    category: 'twitter',
    subCategory: 'Projects',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'twitter',
    author: 'defiproject',
    metrics: {
      likes: 3500,
      retweets: 890
    }
  },
  {
    id: '7',
    title: 'My thoughts on the current market...',
    description: 'Been in crypto since 2013, and these patterns are familiar. Accumulation phase is key. Don\'t let short-term volatility shake you out! 🧵',
    source: 'CryptoVeteran',
    link: '#',
    icon: <Twitter className="h-5 w-5" />,
    category: 'twitter',
    subCategory: 'Influencers',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'twitter',
    author: 'cryptovet',
    metrics: {
      likes: 5600,
      retweets: 1200
    }
  }
];
