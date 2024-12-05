import { NewsArticle } from '../types/news';
import { Bitcoin, Coins, Wallet, Frame, MessageCircle } from 'lucide-react';

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
    id: 'tweet-1',
    title: 'BREAKING: Bitcoin hits new ATH! 🚀',
    description: 'Bitcoin just broke through $100k! This is not a drill. The institutional adoption we\'ve been waiting for is finally here. Hold on tight! 🌕 #Bitcoin #BTC',
    source: 'Twitter',
    link: 'https://twitter.com/example/status/1',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'social',
    subCategory: 'Twitter',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'tweet',
    metrics: {
      like_count: 15200,
      retweet_count: 3400,
      reply_count: 892,
      quote_count: 450,
      bookmark_count: 1200,
      impression_count: 150000
    }
  },
  {
    id: 'tweet-2',
    title: 'Major Ethereum Upgrade Coming 🔥',
    description: 'Just got insider info: The next ETH upgrade will reduce gas fees by 90%! This is going to be a game changer for DeFi. Not financial advice, but you might want to stack some ETH... 👀 #Ethereum #DeFi',
    source: 'Twitter',
    link: 'https://twitter.com/example/status/2',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'social',
    subCategory: 'Twitter',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'tweet',
    metrics: {
      like_count: 8900,
      retweet_count: 2100,
      reply_count: 445,
      quote_count: 280,
      bookmark_count: 780,
      impression_count: 95000
    }
  },
  {
    id: 'tweet-3',
    title: 'AI x Crypto Integration Alert 🤖',
    description: 'Just discovered an incredible AI-powered DeFi protocol that\'s using machine learning to optimize yields. This could revolutionize automated trading. Full thread below... 🧵 #AI #DeFi #Crypto',
    source: 'Twitter',
    link: 'https://twitter.com/example/status/3',
    icon: <MessageCircle className="h-5 w-5" />,
    category: 'social',
    subCategory: 'Twitter',
    publishedAt: new Date().toISOString(),
    isFavorite: false,
    type: 'tweet',
    metrics: {
      like_count: 5600,
      retweet_count: 1800,
      reply_count: 234,
      quote_count: 165,
      bookmark_count: 890,
      impression_count: 75000
    }
  }
];
