import { ArrowLeft, ExternalLink, Users, ChartLine, Target } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useTwitterFeed } from '../hooks/useTwitterFeed';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

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

// Filter function for ticker symbol tweets (reused from CallersHub)
const filterTickerTweets = (tweets: Tweet[]): Tweet[] => {
  return tweets.filter(tweet => /^\$[A-Za-z]{3,5}\b/.test(tweet.description));
};

// Get caller data from handle
const getCallerData = (handle: string) => {
  const allCallers = [
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
    },
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
    },
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
  ];

  return allCallers.find(caller => caller.handle === handle);
};

export function CallerPage() {
  const { handle } = useParams<{ handle: string }>();
  const decodedHandle = handle ? decodeURIComponent(handle) : '';
  const caller = getCallerData(decodedHandle);
  
  const { data: tweets = [], isLoading: isFetchingTweets } = useTwitterFeed(decodedHandle);
  const filteredTweets = filterTickerTweets(tweets);

  if (!caller) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link to="/callers">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to $Call Hub
          </Button>
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Caller not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The caller you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/callers">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to $Call Hub
        </Button>
      </Link>

      <Card className="p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              {caller.handle}
            </h1>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-lg">{caller.followers} followers</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartLine className="h-5 w-5 text-green-500" />
                <span className="text-lg text-green-500">{caller.performance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-lg">Accuracy Rate: {caller.accuracy}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {caller.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <h2 className="text-2xl font-bold mb-6">Ticker Symbol Calls</h2>
      
      {isFetchingTweets ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filteredTweets.length > 0 ? (
        <div className="grid gap-4">
          {filteredTweets.map((tweet) => (
            <Card key={tweet.id} className="p-4">
              <p className="text-lg mb-2">{tweet.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center gap-1"
                >
                  View on Twitter
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">
          No ticker symbol calls found
        </p>
      )}
    </div>
  );
}
