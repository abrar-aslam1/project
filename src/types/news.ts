import { ReactElement } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  link: string;
  icon: ReactElement;
  category: string;
  subCategory: string;
  publishedAt: string;
  isFavorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: ReactElement;
  subCategories: string[];
}

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
