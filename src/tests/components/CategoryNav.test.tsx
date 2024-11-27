import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryNav } from '../../components/CategoryNav';
import { vi } from 'vitest';

describe('CategoryNav', () => {
  const mockProps = {
    categories: [
      {
        id: 'all',
        name: 'All News',
        icon: <span>🌐</span>,
        subCategories: []
      },
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        icon: <span>₿</span>,
        subCategories: ['Mining', 'Trading']
      }
    ],
    activeCategory: 'all',
    activeSubCategory: 'all',
    onCategoryChange: vi.fn(),
    onSubCategoryChange: vi.fn()
  };

  it('renders categories correctly', () => {
    render(<CategoryNav {...mockProps} />);
    expect(screen.getByText('All News')).toBeInTheDocument();
  });

  it('calls onCategoryChange when clicking a category', () => {
    render(<CategoryNav {...mockProps} />);
    userEvent.click(screen.getByText('All News'));
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('all');
  });
});
