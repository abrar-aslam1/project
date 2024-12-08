import { useQuery } from '@tanstack/react-query';
import { getApiBaseUrl } from '../lib/config';

interface Tweet {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
  };
}

const fetchTwitterFeed = async (handle: string): Promise<Tweet[]> => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/.netlify/functions/getTwitterFeed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accounts_input: handle }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tweets');
  }

  return response.json();
};

export function useTwitterFeed(handle: string | null) {
  return useQuery({
    queryKey: ['twitter-feed', handle],
    queryFn: () => (handle ? fetchTwitterFeed(handle) : Promise.resolve([])),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in garbage collection for 30 minutes
    refetchOnWindowFocus: false,
  });
}
