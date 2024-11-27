import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryNav } from '@/components/CategoryNav';
import { Globe } from 'lucide-react';

describe('CategoryNav', () => {
  const mockCategories = [
    {
      id: 'all',
      name: 'All News',
      icon: <Globe className="h-5 w-5" />,
      subCategories: [],
    },
  ];

  const mockProps = {
    categories: mockCategories,
    activeCategory: 'all',
    activeSubCategory: 'all',
    onCategoryChange: vi.fn(),
    onSubCategoryChange: vi.fn(),
  };

  it('renders categories correctly', () => {
    render(<CategoryNav {...mockProps} />);
    expect(screen.getByText('All News')).toBeInTheDocument();
  });

  it('calls onCategoryChange when clicking a category', () => {
    render(<CategoryNav {...mockProps} />);
    fireEvent.click(screen.getByText('All News'));
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('all');
  });
});