import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Timestamp;
  topic: string;
}

const TOPICS = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'altcoins', name: 'Altcoins' },
  { id: 'defi', name: 'DeFi' },
  { id: 'general', name: 'General' }
];

export function Community() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentTopic, setCurrentTopic] = useState('general');
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'messages');
    // Query messages for current topic and within last 5 days
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    const q = query(
      messagesRef,
      where('topic', '==', currentTopic),
      where('timestamp', '>=', fiveDaysAgo),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [user, currentTopic]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage.trim(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        timestamp: serverTimestamp(),
        topic: currentTopic,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p>You need to be signed in to access the community section.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Community Chat</h1>
      
      <Tabs defaultValue="general" value={currentTopic} onValueChange={setCurrentTopic} className="mb-4">
        <TabsList className="w-full justify-start">
          {TOPICS.map(topic => (
            <TabsTrigger key={topic.id} value={topic.id} className="flex-1">
              {topic.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {TOPICS.map(topic => (
          <TabsContent key={topic.id} value={topic.id}>
            <Card className="mb-4 p-4">
              <ScrollArea className="h-[60vh] w-full">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.userId === user.uid ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                          {message.userName[0]}
                        </div>
                      </Avatar>
                      <div
                        className={`flex flex-col ${
                          message.userId === user.uid ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp?.toDate().toLocaleTimeString()}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.userId === user.uid
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Type your message in ${TOPICS.find(t => t.id === currentTopic)?.name}...`}
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

export default Community;
