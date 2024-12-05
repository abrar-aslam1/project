import { render, screen } from '@testing-library/react';
import { NewsCard } from '../../components/NewsCard';
import { TrendingUp } from 'lucide-react';
import { NewsArticle } from '../../types/news';
import { AuthContext } from '../../components/AuthProvider';

// Mock AuthContext value
const mockAuthContext = {
  user: null,
  signIn: async () => {},
  createAccount: async () => {},
  signOut: async () => {},
  updateDisplayName: async () => {},
  loading: false,
  showPreferences: false,
  saveUserPreferences: async () => {},
  tempUser: null,
  signInWithGoogle: async () => {},
};

describe('NewsCard', () => {
  const mockArticle: NewsArticle = {
    id: '1',
    title: 'Test Article',
    description: 'Test Description',
    source: 'Test Source',
    link: 'https://test.com',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'bitcoin',
    subCategory: 'Price Analysis',
    publishedAt: '2024-03-20',
    isFavorite: false,
    type: 'article'
  };

  const renderWithAuth = (component: React.ReactNode) => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    );
  };

  it('renders article information correctly', () => {
    renderWithAuth(<NewsCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  it('links to the article URL', () => {
    renderWithAuth(<NewsCard article={mockArticle} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://test.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
