import { Users, Star, TrendingUp, ChartBar, Search, Grid, List, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";
import { useTwitterFeed } from '../hooks/useTwitterFeed';

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

export function CallersHub() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaller, setSelectedCaller] = useState<string | null>(null);

  // Use the cached Twitter feed
  const { data: tweets = [], isLoading: isFetchingTweets, isFetching } = useTwitterFeed(selectedCaller);

  const handleCallerClick = (handle: string) => {
    setSelectedCaller(selectedCaller === handle ? null : handle);
  };

  // Enhanced caller data
  const callerGroups: CallerGroup[] = [
    {
      title: "Top Callers",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      description: "Most accurate and reliable crypto analysts",
      callers: [
        {
          handle: '@CryptoWizardd',
          followers: '125K',
          performance: '+245% (30d)',
          accuracy: '89%',
          specialties: ['Bitcoin', 'Macro Analysis']
        },
        {
          handle: '@Crypto_Jopp',
          followers: '89K',
          performance: '+180% (30d)',
          accuracy: '85%',
          specialties: ['Altcoins', 'Technical Analysis']
        },
        {
          handle: '@TheCryptoKazi',
          followers: '76K',
          performance: '+156% (30d)',
          accuracy: '82%',
          specialties: ['DeFi', 'NFTs']
        }
      ]
    },
    {
      title: "Technical Analysis",
      icon: <ChartBar className="h-4 w-4 text-blue-500" />,
      description: "Expert chart analysis and trading signals",
      callers: [
        {
          handle: '@AltcoinSensei',
          followers: '92K',
          performance: '+198% (30d)',
          accuracy: '87%',
          specialties: ['Chart Patterns', 'Trading Setups']
        },
        {
          handle: '@AltcoinMiyagi',
          followers: '67K',
          performance: '+167% (30d)',
          accuracy: '84%',
          specialties: ['Price Action', 'Risk Management']
        },
        {
          handle: '@CryptoTony__',
          followers: '154K',
          performance: '+210% (30d)',
          accuracy: '88%',
          specialties: ['Market Structure', 'Swing Trading']
        }
      ]
    },
    {
      title: "Alpha Hunters",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      description: "Early opportunities and market insights",
      callers: [
        {
          handle: '@rare10x',
          followers: '45K',
          performance: '+289% (30d)',
          accuracy: '79%',
          specialties: ['Emerging Projects', 'IDOs']
        },
        {
          handle: '@CryptoShilllz',
          followers: '38K',
          performance: '+145% (30d)',
          accuracy: '76%',
          specialties: ['Microcaps', 'Gem Hunting']
        },
        {
          handle: '@alanrog3',
          followers: '82K',
          performance: '+178% (30d)',
          accuracy: '83%',
          specialties: ['Layer 1s', 'Gaming']
        }
      ]
    }
  ];

  const filteredGroups = callerGroups.map(group => ({
    ...group,
    callers: group.callers.filter(caller =>
      caller.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caller.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  })).filter(group => group.callers.length > 0);

  const TweetCard = ({ tweet }: { tweet: Tweet }) => (
    <div className="p-4 rounded-lg bg-white/5 border border-gray-800 space-y-2">
      <p className="text-sm text-gray-300">{tweet.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
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
    const isSelected = selectedCaller === caller.handle;
    const isLoading = isSelected && (isFetchingTweets || isFetching);

    return (
      <div className="space-y-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button
              onClick={() => handleCallerClick(caller.handle)}
              className={`w-full group flex ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col'} 
                p-4 rounded-lg transition-all
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                hover:border-purple-300 dark:hover:border-purple-700
                hover:shadow-md
                ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              <div className={`flex ${viewMode === 'list' ? 'items-center gap-4' : 'flex-col gap-2'}`}>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{caller.handle}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{caller.followers} followers</span>
                  <span className="text-green-500">{caller.performance}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isSelected ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </button>
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

        {isSelected && (
          <div className="pl-4 border-l-2 border-purple-600 dark:border-purple-400 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : tweets.length > 0 ? (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No tweets available</p>
            )}
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
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Callers Hub</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Follow top crypto callers and their latest market insights. Track their calls, analysis, and trading strategies in real-time.
          </p>
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
