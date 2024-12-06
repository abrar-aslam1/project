import { useState } from 'react';
import { CategoryNav } from './CategoryNav';
import { NewsGrid } from './NewsGrid';
import { HeroSection } from './HeroSection';

export function Home() {
  const [category, setCategory] = useState('all');
  const [subCategory, setSubCategory] = useState<string | undefined>();

  const handleCategoryChange = (newCategory: string, newSubCategory?: string) => {
    setCategory(newCategory);
    setSubCategory(newSubCategory);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories */}
        <CategoryNav onCategoryChange={handleCategoryChange} />

        {/* News Grid */}
        <NewsGrid category={category} subCategory={subCategory} />
      </div>
    </main>
  );
}
