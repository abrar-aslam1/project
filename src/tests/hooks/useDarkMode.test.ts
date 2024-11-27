import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '@/hooks/useDarkMode';

describe('useDarkMode', () => {
  it('toggles dark mode correctly', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDarkMode).toBe(false);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.isDarkMode).toBe(true);
  });

  it('updates body class when dark mode changes', () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(document.body.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(document.body.classList.contains('dark')).toBe(false);
  });
});