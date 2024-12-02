import { Card, CardContent } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function HeroSection() {
  return (
    <Card className="bg-white dark:bg-black text-black dark:text-white border-none shadow-lg overflow-hidden rounded-xl relative">
      {/* Larger gradient design in top right corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/40 via-blue-500/30 to-pink-500/40 blur-3xl rounded-full transform translate-x-12 -translate-y-12"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/30 via-blue-300/20 to-pink-400/30 blur-2xl rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 via-blue-400/10 to-pink-500/20 blur-xl rounded-full transform translate-x-4 -translate-y-4"></div>
      
      <CardContent className="relative px-4 sm:px-6 py-8 sm:py-10">
        <div className="relative z-10 text-left max-w-screen-xl mx-auto">
          <div className="mb-2">
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]">Token•eur</div>
            <div className="text-lg sm:text-xl font-medium text-black dark:text-white italic mt-0.5 drop-shadow-sm">[ˌtōkənˈno͝or, ˌtōkənˈnər]</div>
          </div>
          
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider drop-shadow-sm">noun</span>
          </div>

          <ol className="list-decimal ml-5 mb-4 text-black dark:text-white text-sm sm:text-base space-y-1.5 drop-shadow-sm">
            <li className="pl-1">An entrepreneur in the frontier of crypto, blockchain, & decentralized tokenization</li>
            <li className="pl-1">A pioneer forging the future, squares are too blind to know they're desperate for</li>
            <li className="pl-1">A diamond handed CHAD fully in it for the tech & the $money</li>
          </ol>

          <Accordion type="single" collapsible className="text-black dark:text-white">
            <AccordionItem value="more-info" className="border-purple-300/30">
              <AccordionTrigger className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 drop-shadow-sm">More Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5">
                      <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider drop-shadow-sm">USAGE</span>
                    </div>
                    <div className="ml-5 mb-4 text-black dark:text-white text-sm sm:text-base space-y-1.5 drop-shadow-sm">
                      <p className="italic">"In the realm of crypto, blockchain, and the future"</p>
                      <p className="italic">"On the frontier of crypto, blockchain, and innovation"</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5">
                      <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-300 uppercase tracking-wider drop-shadow-sm">SIMILAR</span>
                    </div>
                    <div className="ml-5 text-black dark:text-white text-sm sm:text-base drop-shadow-sm">
                      <p>
                        <span className="text-purple-600 dark:text-purple-300">Crypto Chad</span> • 
                        <span className="text-purple-600 dark:text-purple-300"> Chadus Maximus</span> • 
                        <span className="text-purple-600 dark:text-purple-300"> Blockchain Badass</span> • 
                        <span className="text-purple-600 dark:text-purple-300"> Diamond Hander</span> • 
                        <span className="text-purple-600 dark:text-purple-300"> Hash Hoss</span> • 
                        <span className="text-purple-600 dark:text-purple-300"> Merkel Madman</span>
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
