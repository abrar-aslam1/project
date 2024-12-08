import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Star } from "lucide-react"

interface CryptoBot {
  name: string
  description: string
  rating: number
  reviewCount: number
  website: string
  features: string[]
  pricing: string
  exchanges: string[]
}

const cryptoBots: CryptoBot[] = [
  {
    name: "3Commas",
    description: "Advanced platform with user-friendly interface, suitable for all skill levels",
    rating: 4.7,
    reviewCount: 3500,
    website: "https://3commas.io",
    features: ["DCA Bots", "Grid Trading", "Options Strategies", "Smart Trading", "Portfolio Management"],
    pricing: "From $14.50/month",
    exchanges: ["Binance", "Coinbase", "KuCoin", "Bybit"]
  },
  {
    name: "Cryptohopper",
    description: "Cloud-based platform with strategy marketplace and advanced features",
    rating: 4.5,
    reviewCount: 2800,
    website: "https://cryptohopper.com",
    features: ["Strategy Marketplace", "Signal Following", "Backtesting", "Cloud-Based", "Multiple Exchanges"],
    pricing: "From $19/month",
    exchanges: ["Binance", "Kraken", "Bitfinex", "Huobi"]
  },
  {
    name: "Pionex",
    description: "Built-in trading bots with no additional costs beyond trading fees",
    rating: 4.4,
    reviewCount: 2200,
    website: "https://pionex.com",
    features: ["Free Built-in Bots", "Grid Trading", "DCA", "Arbitrage", "Leverage Trading"],
    pricing: "Free (trading fees only)",
    exchanges: ["Pionex Exchange"]
  },
  {
    name: "Bitsgap",
    description: "Versatile platform with advanced tools and multiple bot types",
    rating: 4.6,
    reviewCount: 1900,
    website: "https://bitsgap.com",
    features: ["Grid Bot", "DCA Bot", "Futures Trading", "Demo Mode", "AI Assistant"],
    pricing: "From $19/month",
    exchanges: ["Binance", "Bitfinex", "KuCoin"]
  },
  {
    name: "TradeSanta",
    description: "Feature-rich platform with long/short strategies and advanced tools",
    rating: 4.3,
    reviewCount: 1600,
    website: "https://tradesanta.com",
    features: ["Long/Short Strategies", "Backtesting", "Trailing Stop-Loss", "Multiple Pairs"],
    pricing: "From $14/month",
    exchanges: ["Binance", "OKX", "Huobi"]
  },
  {
    name: "Coinrule",
    description: "Rule-based bot with over 250 customizable trading strategies",
    rating: 4.4,
    reviewCount: 1800,
    website: "https://coinrule.com",
    features: ["250+ Trading Rules", "Template Strategies", "AI Automation", "No Coding Required"],
    pricing: "From $29.99/month",
    exchanges: ["Coinbase", "Binance", "Kraken"]
  },
  {
    name: "KuCoin Trading Bot",
    description: "Free AI-powered trading bots integrated with KuCoin exchange",
    rating: 4.2,
    reviewCount: 2100,
    website: "https://www.kucoin.com",
    features: ["AI Trading", "Grid Trading", "Spot Grid", "DCA", "Futures Grid"],
    pricing: "Free",
    exchanges: ["KuCoin"]
  },
  {
    name: "Shrimpy",
    description: "Portfolio management focused with social trading features",
    rating: 4.3,
    reviewCount: 1400,
    website: "https://shrimpy.io",
    features: ["Portfolio Rebalancing", "Social Trading", "Index Automation", "Market Analysis"],
    pricing: "From $15/month",
    exchanges: ["Binance", "Kraken", "Coinbase Pro"]
  }
]

const renderStars = (rating: number) => {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    )
  }
  return <div className="flex gap-1">{stars}</div>
}

export default function Tools() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Crypto Trading Tools</h1>
      
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Top Crypto Trading Bots 2024</CardTitle>
            <CardDescription>
              Compare the most popular crypto trading bots based on features, pricing, and user reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Bot</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="hidden lg:table-cell">Features</TableHead>
                  <TableHead className="hidden md:table-cell">Pricing</TableHead>
                  <TableHead className="text-right">Reviews</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptoBots.map((bot) => (
                  <TableRow key={bot.name}>
                    <TableCell>
                      <div>
                        <a 
                          href={bot.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-purple-400 transition-colors"
                        >
                          {bot.name}
                        </a>
                        <p className="text-sm text-muted-foreground">{bot.description}</p>
                        <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                          Supported: {bot.exchanges.join(", ")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {renderStars(bot.rating)}
                        <span className="text-sm text-muted-foreground">{bot.rating}/5</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {bot.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {bot.pricing}
                    </TableCell>
                    <TableCell className="text-right">{bot.reviewCount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
