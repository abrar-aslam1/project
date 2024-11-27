import { Globe, Bitcoin, DollarSign, Lock, Cpu } from 'lucide-react';
import { Category } from '@/types/news';

export const categories: Category[] = [
  { 
    id: 'all', 
    name: 'All News', 
    icon: <Globe className="h-5 w-5" />,
    subCategories: []
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
    icon: <DollarSign className="h-5 w-5" />,
    subCategories: ['Ethereum', 'Ripple', 'Cardano', 'Polkadot']
  },
  { 
    id: 'defi', 
    name: 'DeFi', 
    icon: <Lock className="h-5 w-5" />,
    subCategories: ['Lending', 'DEXs', 'Yield Farming', 'Stablecoins']
  },
  { 
    id: 'nft', 
    name: 'NFTs', 
    icon: <Cpu className="h-5 w-5" />,
    subCategories: ['Art', 'Gaming', 'Collectibles', 'Metaverse']
  },
];