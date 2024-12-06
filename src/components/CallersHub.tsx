import { Users, Star, TrendingUp, ChartBar } from 'lucide-react';

interface CallerGroup {
  title: string;
  icon: JSX.Element;
  description: string;
  callers: string[];
}

export function CallersHub() {
  // Organize callers into groups
  const callerGroups: CallerGroup[] = [
    {
      title: "Top Callers",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      description: "Most accurate and reliable crypto analysts",
      callers: ['@CryptoWizardd', '@Crypto_Jopp', '@TheCryptoKazi']
    },
    {
      title: "Technical Analysis",
      icon: <ChartBar className="h-4 w-4 text-blue-500" />,
      description: "Expert chart analysis and trading signals",
      callers: ['@AltcoinSensei', '@AltcoinMiyagi', '@CryptoTony__']
    },
    {
      title: "Alpha Hunters",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      description: "Early opportunities and market insights",
      callers: ['@rare10x', '@CryptoShilllz', '@alanrog3', '@ChadCaff', '@fitforcrypto_', '@luxe_spoon']
    }
  ];

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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {callerGroups.map((group) => (
            <div key={group.title} className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center gap-3">
                {group.icon}
                <h3 className="text-xl font-semibold">{group.title}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
              <div className="flex flex-wrap gap-2">
                {group.callers.map((caller) => (
                  <a
                    key={caller}
                    href={`https://twitter.com/${caller.substring(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full text-sm transition-colors
                      bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 
                      border border-gray-200 dark:border-gray-700 
                      hover:border-purple-300 dark:hover:border-purple-700
                      hover:bg-purple-50 dark:hover:bg-purple-900/30
                      hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    {caller}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
