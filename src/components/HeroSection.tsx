import { Card, CardContent } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function HeroSection() {
  return (
    <Card className="bg-white dark:bg-black text-black dark:text-white border-none shadow-lg overflow-hidden rounded-xl relative">
      {/* Gradient background effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/40 via-purple-500/30 to-pink-500/40 blur-3xl rounded-full transform translate-x-12 -translate-y-12"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/30 via-purple-300/20 to-pink-400/30 blur-2xl rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 via-purple-400/10 to-pink-500/20 blur-xl rounded-full transform translate-x-4 -translate-y-4"></div>
      
      <CardContent className="relative px-4 sm:px-6 py-8 sm:py-10">
        <div className="relative z-10 text-left max-w-screen-xl mx-auto">
          <div className="mb-2">
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]" style={{ fontFamily: 'Diaria Pro', fontWeight: 800 }}>Token•eur</div>
            <div className="text-lg sm:text-xl font-medium text-black dark:text-white italic mt-0.5 drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 500 }}>[ˈtōkənˈno͝or, ˌtōkənˈnər]</div>
          </div>
          
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 uppercase tracking-wider drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 600 }}>NOUN</span>
          </div>

          <ol className="list-decimal ml-5 mb-4 text-black dark:text-white text-sm sm:text-base space-y-1.5 drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 400 }}>
            <li className="pl-1">An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
            <li className="pl-1">A pioneer forging the future, squares are too blind to know they're desperate for</li>
            <li className="pl-1">A diamond handed CHAD fully in it for the tech & the $money</li>
          </ol>

          <Accordion type="single" collapsible className="text-black dark:text-white">
            <AccordionItem value="more-info" className="border-blue-300/30">
              <AccordionTrigger className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 600 }}>More Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5">
                      <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 uppercase tracking-wider drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 600 }}>USAGE</span>
                    </div>
                    <div className="ml-5 mb-4 text-black dark:text-white text-sm sm:text-base space-y-1.5 drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 400 }}>
                      <p className="italic">"In the realm of decentralized finance and Web3"</p>
                      <p className="italic">"On the frontier of blockchain innovation and digital assets"</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5">
                      <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 uppercase tracking-wider drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 600 }}>SIMILAR</span>
                    </div>
                    <div className="ml-5 text-black dark:text-white text-sm sm:text-base drop-shadow-sm" style={{ fontFamily: 'Diaria Pro', fontWeight: 400 }}>
                      <p>
                        <span className="text-blue-600 dark:text-blue-300">Crypto Native</span> • 
                        <span className="text-blue-600 dark:text-blue-300"> DeFi Degen</span> • 
                        <span className="text-blue-600 dark:text-blue-300"> Web3 Builder</span> • 
                        <span className="text-blue-600 dark:text-blue-300"> Chain Maximalist</span> • 
                        <span className="text-blue-600 dark:text-blue-300"> NFT Collector</span> • 
                        <span className="text-blue-600 dark:text-blue-300"> Yield Farmer</span>
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
