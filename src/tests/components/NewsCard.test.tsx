import { render, screen } from '@testing-library/react';
import { NewsCard } from '@/components/NewsCard';
import { TrendingUp } from 'lucide-react';

describe('NewsCard', () => {
  const mockArticle = {
    id: '1',
    title: 'Test Article',
    description: 'Test Description',
    source: 'Test Source',
    link: 'https://test.com',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'bitcoin',
    subCategory: 'Price Analysis',
    publishedAt: '2024-03-20',
  };

  it('renders article information correctly', () => {
    render(<NewsCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  it('links to the article URL', () => {
    render(<NewsCard article={mockArticle} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://test.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});