import { Card, CardContent } from "../components/ui/card";

export function HeroSection() {
  const terms = ['Crypto Chad', 'Chadus Maximus', 'Blockchain Badass', 'Diamond Hander', 'Hash Hoss', 'Merkel Madman'];

  return (
    <section className="mb-16">
      <Card className="gradient-bg text-white border-none shadow-lg overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-extrabold mb-4 tracking-tight gradient-text">Token•eur</h2>
            <p className="text-xl mb-6 font-semibold text-purple-300">/ˈtōkən ər/</p>
            <ol className="list-decimal list-inside space-y-2 text-lg text-gray-200">
              <li>An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
              <li>A pioneer forging the future, squares are too blind to know they're desperate for</li>
              <li>A diamond handed CHAD fully in it for the tech & the $money</li>
            </ol>
            <div className="mt-8 space-y-4">
              <p className="italic text-lg text-purple-200">"In the realm of crypto, blockchain, and the future"</p>
              <p className="italic text-lg text-purple-200">"On the frontier of crypto, blockchain, and innovation"</p>
            </div>
            <div className="mt-8 glass-effect rounded-lg p-4">
              <p className="font-semibold mb-2 text-purple-300">Token•eur:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-200">
                <li>An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
                <li>A pioneer forging the future, squares are too blind to know they're desperate for</li>
                <li>A straight up CHAD fully in it for the tech & the $money</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {terms.map((term, index) => (
                <span key={index} className="glass-effect px-3 py-1 rounded-full text-sm text-purple-300">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
