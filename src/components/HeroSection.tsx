import { Card, CardContent } from "./ui/card";

export function HeroSection() {
  return (
    <Card className="gradient-bg text-white border-none shadow-lg overflow-hidden rounded-xl">
      <CardContent className="relative px-4 sm:px-6 py-8 sm:py-10">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 text-left max-w-screen-xl mx-auto">
          <div className="mb-2">
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text">Token•eur</div>
            <div className="text-lg sm:text-xl font-medium text-purple-300 italic mt-0.5">/ˈtōkən ər/</div>
          </div>
          
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-purple-300/80 uppercase tracking-wider">noun</span>
          </div>

          <ol className="list-decimal ml-5 mb-4 text-gray-200 text-sm sm:text-base space-y-1.5">
            <li className="pl-1">An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
            <li className="pl-1">A pioneer forging the future, squares are too blind to know they're desperate for</li>
            <li className="pl-1">A diamond handed CHAD fully in it for the tech & the $money</li>
          </ol>

          <div className="mb-1.5">
            <span className="text-xs sm:text-sm text-purple-300/80 uppercase tracking-wider">USAGE</span>
          </div>
          <div className="ml-5 mb-4 text-gray-200 text-sm sm:text-base space-y-1.5">
            <p className="italic">"In the realm of crypto, blockchain, and the future"</p>
            <p className="italic">"On the frontier of crypto, blockchain, and innovation"</p>
          </div>

          <div className="mb-1.5">
            <span className="text-xs sm:text-sm text-purple-300/80 uppercase tracking-wider">SIMILAR</span>
          </div>
          <div className="ml-5 text-gray-200 text-sm sm:text-base">
            <p>
              <span className="text-purple-300">Crypto Chad</span> • 
              <span className="text-purple-300"> Chadus Maximus</span> • 
              <span className="text-purple-300"> Blockchain Badass</span> • 
              <span className="text-purple-300"> Diamond Hander</span> • 
              <span className="text-purple-300"> Hash Hoss</span> • 
              <span className="text-purple-300"> Merkel Madman</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
