export interface NewsPreferences {
  categories: string[];
  subCategories: string[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  favorites?: string[];
  newsPreferences?: NewsPreferences;
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
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subCategories: string[];
}
