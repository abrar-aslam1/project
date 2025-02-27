import { Users, Star, TrendingUp, ChartBar, Search, Grid, List, ExternalLink, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { Progress } from "./ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";
import { useTwitterFeed } from '../hooks/useTwitterFeed';
import { useQueryClient } from '@tanstack/react-query';
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

interface CallerGroup {
  title: string;
  icon: JSX.Element;
  description: string;
  callers: Caller[];
}

interface Caller {
  handle: string;
  followers: string;
  performance: string;
  accuracy: string;
  specialties: string[];
}

// Function to fetch tweets for a handle
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

export function CallersHub() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaller, setSelectedCaller] = useState<string | null>(null);
  const [isPrefetching, setIsPrefetching] = useState(true);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const queryClient = useQueryClient();

  // Use the cached Twitter feed
  const { data: tweets = [], isLoading: isFetchingTweets, isFetching } = useTwitterFeed(selectedCaller);

  // Enhanced caller data
  const callerGroups: CallerGroup[] = [
    {
      title: "Top Callers",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      description: "Most accurate and reliable crypto analysts",
      callers: [
        {
          handle: '@SilverBulletBTC',
          followers: '145K',
          performance: '+265% (30d)',
          accuracy: '91%',
          specialties: ['Bitcoin', 'Macro Analysis']
        },
        {
          handle: '@IncomeSharks',
          followers: '178K',
          performance: '+210% (30d)',
          accuracy: '88%',
          specialties: ['Trading', 'Market Analysis']
        },
        {
          handle: '@iWantCoinNews',
          followers: '132K',
          performance: '+195% (30d)',
          accuracy: '87%',
          specialties: ['News', 'Market Updates']
        }
      ]
    },
    {
      title: "Technical Analysis",
      icon: <ChartBar className="h-4 w-4 text-blue-500" />,
      description: "Expert chart analysis and trading signals",
      callers: [
        {
          handle: '@CryptoKaduna',
          followers: '98K',
          performance: '+188% (30d)',
          accuracy: '86%',
          specialties: ['Chart Patterns', 'Trading Setups']
        },
        {
          handle: '@ZssBecker',
          followers: '112K',
          performance: '+175% (30d)',
          accuracy: '85%',
          specialties: ['Technical Analysis', 'Risk Management']
        },
        {
          handle: '@HawkOfCrypto',
          followers: '95K',
          performance: '+182% (30d)',
          accuracy: '84%',
          specialties: ['Market Structure', 'Price Action']
        }
      ]
    },
    {
      title: "Alpha Hunters",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      description: "Early opportunities and market insights",
      callers: [
        {
          handle: '@cryptostasher',
          followers: '85K',
          performance: '+225% (30d)',
          accuracy: '83%',
          specialties: ['Emerging Projects', 'Gem Hunting']
        },
        {
          handle: '@ShazSMM',
          followers: '76K',
          performance: '+195% (30d)',
          accuracy: '82%',
          specialties: ['DeFi', 'New Listings']
        },
        {
          handle: '@DogusJefferson',
          followers: '92K',
          performance: '+205% (30d)',
          accuracy: '84%',
          specialties: ['Altcoins', 'Market Opportunities']
        },
        {
          handle: '@MMCrypto',
          followers: '120K',
          performance: '+230% (30d)',
          accuracy: '89%',
          specialties: ['Technical Analysis', 'Market Trends']
        }
      ]
    }
  ];

  // Prefetch tweets for all callers when component mounts
  useEffect(() => {
    const prefetchTweets = async () => {
      try {
        const allCallers = callerGroups.flatMap(group => group.callers.map(caller => caller.handle));
        const totalCallers = allCallers.length;
        let completedPrefetches = 0;

        await Promise.all(allCallers.map(async handle => {
          await queryClient.prefetchQuery({
            queryKey: ['twitter-feed', handle],
            queryFn: () => fetchTwitterFeed(handle),
            staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
            gcTime: 30 * 60 * 1000, // Keep data in garbage collection for 30 minutes
          });
          completedPrefetches++;
          setPrefetchProgress(Math.round((completedPrefetches / totalCallers) * 100));
        }));
      } catch (error) {
        console.error('Error prefetching tweets:', error);
      } finally {
        setIsPrefetching(false);
      }
    };

    prefetchTweets();
  }, [queryClient]);


  const filteredGroups = callerGroups.map(group => ({
    ...group,
    callers: group.callers.filter(caller =>
      caller.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caller.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  })).filter(group => group.callers.length > 0);

  // Filter function for ticker symbol tweets
const filterTickerTweets = (tweets: Tweet[]): Tweet[] => {
  return tweets
    .filter(tweet => /^\$[A-Za-z]{3,5}\b/.test(tweet.description))
    .slice(0, 3); // Limit to 3 posts
};

const TweetCard = ({ tweet }: { tweet: Tweet }) => (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 space-y-2">
      <p className="text-sm text-gray-700 dark:text-gray-300">{tweet.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>{new Date(tweet.publishedAt).toLocaleDateString()}</span>
        {tweet.metrics && (
          <>
            <span>🔄 {tweet.metrics.retweet_count}</span>
            <span>💬 {tweet.metrics.reply_count}</span>
            <span>❤️ {tweet.metrics.like_count}</span>
          </>
        )}
      </div>
      <a
        href={tweet.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
      >
        View on Twitter <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );

  const CallerCard = ({ caller }: { caller: Caller }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isSelected = selectedCaller === caller.handle;
    const isLoading = isSelected && (isFetchingTweets || isFetching);
    const filteredTweetCount = filterTickerTweets(tweets).length;

    return (
      <div className="space-y-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="relative">
              <Link 
                to={`/caller/${encodeURIComponent(caller.handle)}`}
                className="absolute inset-0 z-10"
                aria-label={`View ${caller.handle}'s profile`}
              />
              <div
                className={`w-full group flex ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col'} 
                  p-4 rounded-lg transition-all
                  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  hover:border-purple-300 dark:hover:border-purple-700
                  hover:shadow-md`}
              >
                <div className={`flex ${viewMode === 'list' ? 'items-center gap-4' : 'flex-col gap-2'}`}>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{caller.handle}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{caller.followers} followers</span>
                      <span className="text-green-500">{caller.performance}</span>
                    </div>
                    {tweets.length > 0 && filterTickerTweets(tweets).length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Recent calls:</span>
                        <div className="flex gap-1">
                          {filterTickerTweets(tweets).map((tweet) => {
                            const symbol = tweet.description.match(/^\$[A-Za-z]{3,5}\b/)?.[0];
                            return symbol ? (
                              <span key={tweet.id} className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-xs font-medium">
                                {symbol}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{caller.handle}</h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Accuracy Rate: {caller.accuracy}</p>
                <p>Specialties: {caller.specialties.join(', ')}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {tweets.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{filteredTweetCount} Recent Calls</span>
              {isDropdownOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            <div className={`mt-2 space-y-2 transition-all duration-200 ease-in-out ${isDropdownOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              {isFetching ? (
                <div className="space-y-2">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : filterTickerTweets(tweets).length > 0 ? (
                <div className="space-y-2">
                  {filterTickerTweets(tweets).map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No ticker symbol calls found</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">$Call Hub</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track real-time crypto calls and market insights. Filter by ticker symbols and follow top analysts' trading strategies.
          </p>
          {isPrefetching && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading tweets for all callers...</span>
                <span className="font-medium">{prefetchProgress}%</span>
              </div>
              <Progress value={prefetchProgress} className="h-1" />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search callers or specialties..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              pressed={viewMode === 'grid'}
              onPressedChange={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === 'list'}
              onPressedChange={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Callers</TabsTrigger>
            <TabsTrigger value="top">Top Performers</TabsTrigger>
            <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
            <TabsTrigger value="alpha">Alpha Hunters</TabsTrigger>
          </TabsList>

          <>
            <TabsContent value="all">
              <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
                {filteredGroups.map(group => (
                  <div key={group.title} className="space-y-4">
                    <div className="flex items-center gap-2 mt-6">
                      {group.icon}
                      <h3 className="text-lg font-semibold">{group.title}</h3>
                    </div>
                    <div className={viewMode === 'grid' ? 'grid gap-4' : 'space-y-2'}>
                      {group.callers.map(caller => (
                        <CallerCard key={caller.handle} caller={caller} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {['top', 'technical', 'alpha'].map((tab, index) => (
              <TabsContent key={tab} value={tab}>
                <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-2'}>
                  {filteredGroups[index]?.callers.map(caller => (
                    <CallerCard key={caller.handle} caller={caller} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </>
        </Tabs>
      </div>
    </div>
  );
}
