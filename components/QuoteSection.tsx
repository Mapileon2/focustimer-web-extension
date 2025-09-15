import React, { useState } from 'react';
import { useQuotes } from '../hooks/useQuotes';
import QuoteBoard from './QuoteBoard';
import AiTextAssist from './AiTextAssist';
import AiImageQuote from './AiImageQuote';
import BulkActionsBar from './BulkActionsBar';
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Quote } from '../types';
import SmilePopupSettings from '../SmilePopupSettings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type Tab = 'board' | 'text-ai' | 'image-ai' | 'smile-settings';

const QuoteSection = () => {
  const { quotes } = useQuotes();
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = React.useMemo(() => {
    const cats = new Set(quotes.map(q => q.category).filter(Boolean) as string[]);
    return ['all', 'favorites', ...Array.from(cats)];
  }, [quotes]);
  
  const filteredQuotes = React.useMemo(() => {
    let filtered: Quote[] = quotes;
    if (filter === 'favorites') {
      filtered = quotes.filter(q => q.isFavorite);
    } else if (filter !== 'all') {
      filtered = quotes.filter(q => q.category === filter);
    }

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(q => 
            q.text.toLowerCase().includes(lowerSearch) || 
            q.author.toLowerCase().includes(lowerSearch)
        );
    }

    return filtered;
  }, [quotes, filter, searchTerm]);
  
  // Remove TabButton function as it's replaced by TabsTrigger
  
  return (
    <section className="mt-8">
      <h2 className="text-3xl font-bold mb-4">Your Quotes Collection</h2>
      <Card>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
          <TabsList>
            <TabsTrigger value="board">Quote Board</TabsTrigger>
            <TabsTrigger value="text-ai">AI Text Assist</TabsTrigger>
            <TabsTrigger value="image-ai">AI Image Quote</TabsTrigger>
            <TabsTrigger value="smile-settings">Smile Popup Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board">
            <div className="my-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                    <div className="flex-grow w-full">
                        <Input
                            type="search"
                            placeholder="Search quotes or authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex-shrink-0 w-full sm:w-auto">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full sm:w-auto capitalize">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <BulkActionsBar />
                <QuoteBoard quotes={filteredQuotes} />
            </div>
        </TabsContent>
        <TabsContent value="text-ai">
          <AiTextAssist />
        </TabsContent>
        <TabsContent value="image-ai">
          <AiImageQuote />
        </TabsContent>
        <TabsContent value="smile-settings">
          <SmilePopupSettings />
        </TabsContent>
      </Tabs>
      </Card>
    </section>
  );
};

export default QuoteSection;