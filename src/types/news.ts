export interface TwitterMetrics {
  like_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
}

export interface TwitterMedia {
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  preview_image_url?: string;
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
  type: 'article' | 'tweet';
  metrics?: TwitterMetrics;
  media?: TwitterMedia[];
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subCategories: string[];
}

export interface NewsPreferences {
  categories: string[];
  subCategories: string[];
}

export interface UserPreferences {
  newsPreferences: NewsPreferences;
  darkMode?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  preferences?: UserPreferences;
  favorites?: string[];
}
