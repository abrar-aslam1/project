import { Card, CardContent } from "./ui/card";

export function HeroSection() {
  const terms = ['Crypto Chad', 'Chadus Maximus', 'Blockchain Badass', 'Diamond Hander', 'Hash Hoss', 'Merkel Madman'];

  return (
    <section className="mb-8 sm:mb-16 relative z-0 px-2 sm:px-0">
      <Card className="gradient-bg text-white border-none shadow-lg overflow-hidden">
        <CardContent className="p-3 sm:p-8 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 text-left">
            <div className="mb-2">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text mb-1">Token•eur</div>
              <div className="text-lg sm:text-xl font-medium text-purple-300 italic">/ˈtōkən ər/</div>
            </div>
            
            <div className="mb-4">
              <span className="text-xs sm:text-sm text-purple-300/80 uppercase tracking-wider">noun</span>
            </div>

            <ol className="list-decimal ml-4 sm:ml-5 mb-5 sm:mb-6 text-gray-200 text-sm sm:text-base space-y-2 sm:space-y-3">
              <li className="pl-1">An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
              <li className="pl-1">A pioneer forging the future, squares are too blind to know they're desperate for</li>
              <li className="pl-1">A diamond handed CHAD fully in it for the tech & the $money</li>
            </ol>

            <div className="mb-2 text-xs sm:text-sm uppercase tracking-wider text-purple-300/80">USAGE</div>
            <div className="ml-4 sm:ml-5 mb-5 sm:mb-6 text-gray-200 text-sm sm:text-base space-y-2">
              <p className="italic">"In the realm of crypto, blockchain, and the future"</p>
              <p className="italic">"On the frontier of crypto, blockchain, and innovation"</p>
            </div>

            <div className="mb-2 text-xs sm:text-sm uppercase tracking-wider text-purple-300/80">SYNONYMS</div>
            <ul className="list-disc ml-4 sm:ml-5 mb-5 sm:mb-6 text-gray-200 text-sm sm:text-base space-y-2 sm:space-y-3">
              <li className="pl-1">An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
              <li className="pl-1">A pioneer forging the future, squares are too blind to know they're desperate for</li>
              <li className="pl-1">A straight up CHAD fully in it for the tech & the $money</li>
            </ul>

            <div className="mb-2 text-xs sm:text-sm uppercase tracking-wider text-purple-300/80">SEE ALSO</div>
            <div className="ml-4 sm:ml-5 flex flex-wrap gap-1.5 sm:gap-2">
              {terms.map((term, index) => (
                <span key={index} className="glass-effect px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm text-purple-300/90">
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
