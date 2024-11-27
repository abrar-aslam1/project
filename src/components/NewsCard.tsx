import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <a 
      href={article.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group"
    >
      <Card className="h-full glass-effect card-hover dark:bg-black/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold gradient-text">
              {article.title}
            </CardTitle>
            <div className="text-purple-400 dark:text-purple-300">{article.icon}</div>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {article.source}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">{article.description}</p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-center py-2 px-4 rounded-full glass-effect group-hover:bg-purple-500/20 text-purple-400 dark:text-purple-300">
            Read more <ExternalLink className="ml-2 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </a>
  );
}
