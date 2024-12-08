import { vi } from 'vitest';
import axios from 'axios';
import { fetchCryptoNews } from '../../lib/api';

vi.mock('axios');

describe('fetchCryptoNews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and transforms news data correctly', async () => {
    const mockNewsData = [
      {
        title: 'Bitcoin Price Surges to New Heights',
        description: 'Bitcoin reaches new all-time high...',
        url: 'https://example.com/article1',
        source: 'CryptoNews'
      }
    ];

    (axios.request as any).mockResolvedValueOnce({ data: mockNewsData });

    const result = await fetchCryptoNews();

    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'https://example.com/article1',
        title: 'Bitcoin Price Surges to New Heights',
        category: 'bitcoin',
        subCategory: 'Price Analysis',
      })
    );
  });

  it('handles API errors', async () => {
    (axios.request as any).mockRejectedValueOnce(new Error('API Error'));

    await expect(fetchCryptoNews()).rejects.toThrow('API Error');
  });
});
