import React, { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useQuotes } from '../hooks/useQuotes';
import { useAppSettings } from '../hooks/useAppSettings';
import { Quote } from '../types';
import { Button } from './ui/button'
import Spinner from './ui/Spinner';
import { Card } from '@/components/ui/card'

const SmilePopup = () => {
    const { showSmilePopup, confirmSmileAndProceed, timerState } = useTimer();
    const { getContextualQuote, recordSmileUsage } = useQuotes();
    const { settings } = useAppSettings();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (showSmilePopup) {
            setIsLoading(true);
            getContextualQuote(timerState.sessionType)
                .then(q => {
                    setQuote(q);
                    setIsLoading(false);
                })
                .catch(() => {
                    // Fallback handled inside getContextualQuote
                    setIsLoading(false);
                });
        }
    }, [showSmilePopup, getContextualQuote, timerState.sessionType]);

    if (!showSmilePopup) {
        return null;
    }

    const handleAction = (type: 'smile' | 'skip') => {
        if (quote) {
            recordSmileUsage({
                quoteId: quote.id,
                sessionType: timerState.sessionType,
                sessionCount: timerState.sessionCount,
                type
            });
        }
        confirmSmileAndProceed();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                {settings.customSmileImage && (
                    <div className="mb-4">
                        <img 
                            src={settings.customSmileImage} 
                            alt="Custom motivation" 
                            className="max-h-48 w-auto mx-auto rounded-lg"
                        />
                    </div>
                )}
                <h3 className="text-2xl font-bold text-brand-secondary mb-3">Time's Up!</h3>
                <p className="text-text-secondary mb-6">Take a moment to smile and recharge before your break.</p>
                
                {isLoading && <div className="flex justify-center my-8"><Spinner /></div>}
                
                {!isLoading && quote && (
                    <div className="bg-base-100 p-4 rounded-lg my-4">
                        <blockquote className="text-xl italic text-text-primary">
                            "{quote.text}"
                        </blockquote>
                        <cite className="block text-right mt-2 not-italic text-text-secondary">&mdash; {quote.author}</cite>
                    </div>
                )}
                
                <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={() => handleAction('skip')} variant="secondary">
                        Skip Break
                    </Button>
                    <Button onClick={() => handleAction('smile')} variant="default">
                        Start Break
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SmilePopup;