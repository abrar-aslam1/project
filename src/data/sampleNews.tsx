import { TrendingUp, Zap, Lock, Cpu } from 'lucide-react';
import { NewsArticle } from '../types/news';

export const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: "Bitcoin Surges Past $50,000 Mark",
    description: "The world's leading cryptocurrency has broken through a key resistance level...",
    source: "CryptoDaily",
    link: "#",
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'bitcoin',
    subCategory: 'Price Analysis',
    publishedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: '2',
    title: "Ethereum 2.0 Upgrade: What You Need to Know",
    description: "The long-awaited upgrade to the Ethereum network is set to revolutionize...",
    source: "BlockchainInsider",
    link: "#",
    icon: <Zap className="h-5 w-5" />,
    category: 'altcoins',
    subCategory: 'Ethereum',
    publishedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: '3',
    title: "DeFi Protocol Hacked: $100M Lost",
    description: "In a shocking turn of events, a popular decentralized finance protocol...",
    source: "DeFiWatch",
    link: "#",
    icon: <Lock className="h-5 w-5" />,
    category: 'defi',
    subCategory: 'Lending',
    publishedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: '4',
    title: "Bored Ape NFT Sells for Record $3.4 Million",
    description: "A rare Bored Ape Yacht Club NFT has sold for an unprecedented amount...",
    source: "NFTWorld",
    link: "#",
    icon: <Cpu className="h-5 w-5" />,
    category: 'nft',
    subCategory: 'Art',
    publishedAt: new Date().toISOString(),
    isFavorite: false
  },
];
