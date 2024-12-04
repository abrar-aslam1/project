export interface NewsPreferences {
  categories: string[];
  subCategories: string[];
}

export interface TwitterAccount {
  username: string;
  displayName?: string;
  addedAt: string;
}

export interface UserPreferences {
  newsPreferences: NewsPreferences;
  twitterAccounts: TwitterAccount[];
  darkMode?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  favorites?: string[];
  preferences?: UserPreferences;
}

export interface TwitterMetrics {
  likes: number;
  retweets: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  link: string;
  icon: React.ReactNode;
  category: string;
  subCategory: string;
  publishedAt: string;
  isFavorite: boolean;
  type?: 'article' | 'twitter';
  author?: string;
  metrics?: TwitterMetrics;
  content?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subCategories: string[];
}
