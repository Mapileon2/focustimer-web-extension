import React from 'react';
import { Quote } from '../types';
import QuoteCard from './QuoteCard';

interface QuoteBoardProps {
  quotes: Quote[];
}

const QuoteBoard = ({ quotes }: QuoteBoardProps) => {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-10 bg-base-100/50 rounded-lg">
        <p className="text-text-secondary">No quotes match the current filter.</p>
        <p className="text-text-secondary">Try a different category or generate some new quotes!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
};

export default QuoteBoard;