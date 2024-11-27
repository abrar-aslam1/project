export interface Category {
  id: string;
  name: string;
  icon: JSX.Element;
  subCategories: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  link: string;
  icon: JSX.Element;
  category: string;
  subCategory: string;
  publishedAt: string;
  isFavorite?: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  favorites: string[];
}