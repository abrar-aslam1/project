import { Category } from '../types/news';
import { Bitcoin, Coins, Wallet, Frame, Twitter } from 'lucide-react';

export const categories: Category[] = [
  {
    id: 'all',
    name: 'All News',
    icon: <Bitcoin className="h-5 w-5" />,
    subCategories: []
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="h-5 w-5" />,
    subCategories: ['Influencers', 'Projects', 'Trading']
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: <Bitcoin className="h-5 w-5" />,
    subCategories: ['Price Analysis', 'Mining', 'Adoption', 'Technology']
  },
  {
    id: 'altcoins',
    name: 'Altcoins',
    icon: <Coins className="h-5 w-5" />,
    subCategories: ['Ethereum', 'Cardano', 'Solana', 'Layer 2']
  },
  {
    id: 'defi',
    name: 'DeFi',
    icon: <Wallet className="h-5 w-5" />,
    subCategories: ['Lending', 'Yield', 'DEX', 'Governance']
  },
  {
    id: 'nft',
    name: 'NFTs',
    icon: <Frame className="h-5 w-5" />,
    subCategories: ['Art', 'Gaming', 'Music', 'Collectibles']
  }
];
