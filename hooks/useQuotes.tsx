import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { Quote, RecapStats, SmileEvent, SessionType } from '../types';
import * as geminiService from '../services/geminiService';
import { useToast } from './useToast';
import { useApiKey } from './useApiKey';
import { STORAGE_KEY_QUOTES, STORAGE_KEY_SMILE_EVENTS } from '../constants';

declare const chrome: any;

interface QuotesContextType {
  quotes: Quote[];
  isLoading: boolean;
  generateAndAddQuotes: (vibe: string) => Promise<void>;
  toggleFavorite: (id: number) => void;
  deleteQuote: (id: number) => void;
  updateQuote: (id: number, text: string, author: string, category?: string) => void;
  generateAndDisplayImageQuote: (imageFile: File, theme: string) => Promise<{ text: string, imageUrl: string } | null>;
  generateRecap: (stats: RecapStats) => Promise<string | null>;
  getFavoriteQuote: () => Quote | null;
  selectedQuoteIds: Set<number>;
  toggleQuoteSelection: (id: number) => void;
  deleteSelectedQuotes: () => void;
  exportSelectedQuotes: () => void;
  selectAllQuotes: () => void;
  deselectAllQuotes: () => void;
  getContextualQuote: (sessionType: SessionType) => Promise<Quote>;
  rateQuote: (id: number, rating: number) => void;
  recordSmileUsage: (event: Omit<SmileEvent, 'timestamp'>) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

const initialQuotes: Quote[] = [
    { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", isFavorite: false, category: 'motivation', source: 'curated' },
    { id: 2, text: "Focus is a superpower.", author: "Mark Manson", isFavorite: true, category: 'productivity', source: 'curated' },
    { id: 3, text: "The secret of getting ahead is getting started.", author: "Mark Twain", isFavorite: false, category: 'motivation', source: 'curated' },
];

const fallbackQuote: Quote = { id: 0, text: "Keep smiling, it's the key that fits the lock of everybody's heart.", author: "Anthony J. D'Angelo", isFavorite: false, source: 'curated', category: 'motivation' };


export const QuotesProvider = ({ children }: { children: ReactNode }) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [smileEvents, setSmileEvents] = useState<SmileEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const { addToast } = useToast();
    const { apiKey, isKeySet, selectedModel } = useApiKey();
    const [selectedQuoteIds, setSelectedQuoteIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get([STORAGE_KEY_QUOTES, STORAGE_KEY_SMILE_EVENTS], (result: any) => {
                setQuotes(result[STORAGE_KEY_QUOTES] || initialQuotes);
                setSmileEvents(result[STORAGE_KEY_SMILE_EVENTS] || []);
                setIsDataLoaded(true);
            });
        } else {
            setQuotes(initialQuotes);
            setIsDataLoaded(true);
        }
    }, []);
    
    useEffect(() => {
        if (isDataLoaded) chrome.storage?.local?.set({ [STORAGE_KEY_QUOTES]: quotes });
    }, [quotes, isDataLoaded]);
    
    useEffect(() => {
        if (isDataLoaded) chrome.storage?.local?.set({ [STORAGE_KEY_SMILE_EVENTS]: smileEvents });
    }, [smileEvents, isDataLoaded]);

    const _generateQuotes = async (vibe: string, count: number): Promise<Quote[] | null> => {
        if (!isKeySet || !apiKey) {
            addToast('Please set your Gemini API key in the settings.', 'error');
            return null;
        }
        setIsLoading(true);
        try {
            const newQuotesData = await geminiService.generateQuotesFromVibe(apiKey, selectedModel, vibe, count);
            return newQuotesData.map(q => ({
                ...q,
                id: Date.now() + Math.random(),
                isFavorite: false,
                source: 'ai-generated' as const,
                category: vibe,
            }));
        } catch (error) {
            addToast('Failed to generate quotes. Check API key or try again.', 'error');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const generateAndAddQuotes = async (vibe: string) => {
        const newQuotes = await _generateQuotes(vibe, 3);
        if (newQuotes) {
            setQuotes(prev => [...newQuotes, ...prev]);
            addToast(`${newQuotes.length} new quotes added!`, 'success');
        }
    };
    
    const toggleFavorite = (id: number) => setQuotes(p => p.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q));

    const deleteQuote = (id: number) => {
        setQuotes(prev => prev.filter(q => q.id !== id));
        setSelectedQuoteIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    };

    const updateQuote = (id: number, text: string, author: string, category?: string) => {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, text, author, category: category !== undefined ? category : q.category } : q));
    };

    const rateQuote = (id: number, rating: number) => setQuotes(prev => prev.map(q => q.id === id ? {...q, rating} : q));

    const recordSmileUsage = (event: Omit<SmileEvent, 'timestamp'>) => {
        setSmileEvents(prev => [{ ...event, timestamp: Date.now() }, ...prev.slice(0, 199)]);
    };
    
    const getContextualQuote = async (sessionType: SessionType): Promise<Quote> => {
        const random = Math.random();
        if (random < 0.3) {
            const favorites = quotes.filter(q => q.isFavorite);
            if (favorites.length > 0) return { ...favorites[Math.floor(Math.random() * favorites.length)], source: 'favorite' };
        }
        if (random < 0.7) {
            const category = sessionType === 'work' ? 'productivity' : 'motivation';
            const matching = quotes.filter(q => q.category === category && !q.isFavorite);
            if (matching.length > 0) return matching[Math.floor(Math.random() * matching.length)];
        }
        const vibe = sessionType === 'work' ? 'achieving a goal' : 'relaxing';
        const newQuotes = await _generateQuotes(vibe, 1);
        if (newQuotes && newQuotes[0]) {
            setQuotes(prev => [newQuotes[0], ...prev]);
            return newQuotes[0];
        }
        return fallbackQuote;
    };

    const generateAndDisplayImageQuote = async (imageFile: File, theme: string) => {
        if (!isKeySet || !apiKey) {
            addToast('Please set your Gemini API key.', 'error');
            return null;
        }
        setIsLoading(true);
        try {
            const result = await geminiService.generateImageQuote(apiKey, imageFile, theme);
            if (result) addToast('Image quote generated!', 'success'); else addToast('Failed to generate image quote.', 'error');
            return result;
        } catch (error) {
            addToast('An error occurred. Check your API key.', 'error');
            return null;
        } finally { setIsLoading(false); }
    };

    const generateRecap = async (stats: RecapStats) => {
        if (!isKeySet || !apiKey) {
            addToast('Please set your Gemini API key.', 'error');
            return null;
        }
        setIsLoading(true);
        try {
            const imageUrl = await geminiService.generateRecapImage(apiKey, stats);
            if (imageUrl) addToast('Recap image generated!', 'success'); else addToast('Failed to generate recap image.', 'error');
            return imageUrl;
        } catch (error) {
            addToast('An error occurred. Check your API key.', 'error');
            return null;
        } finally { setIsLoading(false); }
    };

    const getFavoriteQuote = () => quotes.find(q => q.isFavorite) || quotes[0] || null;
    const toggleQuoteSelection = (id: number) => setSelectedQuoteIds(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    const deleteSelectedQuotes = () => { setQuotes(p => p.filter(q => !selectedQuoteIds.has(q.id))); setSelectedQuoteIds(new Set()); };
    const selectAllQuotes = () => setSelectedQuoteIds(new Set(quotes.map(q => q.id)));
    const deselectAllQuotes = () => setSelectedQuoteIds(new Set());

    const exportSelectedQuotes = () => {
        const text = quotes.filter(q => selectedQuoteIds.has(q.id)).map(q => `"${q.text}" - ${q.author}`).join('\n\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = 'focus-smile-quotes.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        addToast('Quotes exported!', 'success');
    };

    return <QuotesContext.Provider value={{ quotes, isLoading, generateAndAddQuotes, toggleFavorite, deleteQuote, updateQuote, generateAndDisplayImageQuote, generateRecap, getFavoriteQuote, selectedQuoteIds, toggleQuoteSelection, deleteSelectedQuotes, exportSelectedQuotes, selectAllQuotes, deselectAllQuotes, getContextualQuote, rateQuote, recordSmileUsage }}>{children}</QuotesContext.Provider>;
};

export const useQuotes = () => {
    const context = useContext(QuotesContext);
    if (context === undefined) throw new Error('useQuotes must be used within a QuotesProvider');
    return context;
};