import { renderHook, waitFor } from '@testing-library/react';
import { useNews } from '../../hooks/useNews';

describe('useNews', () => {
  it('returns filtered news based on category and subcategory', async () => {
    const { result } = renderHook(() => useNews('bitcoin', 'Price Analysis'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.news).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'bitcoin',
          subCategory: 'Price Analysis',
        }),
      ])
    );
  });

  it('returns all news when category is "all"', async () => {
    const { result } = renderHook(() => useNews('all', 'all'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.news.length).toBeGreaterThan(0);
  });
});
