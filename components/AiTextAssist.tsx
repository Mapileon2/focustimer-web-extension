
import React, { useState } from 'react';
import { useQuotes } from '../hooks/useQuotes';
import { Button } from './ui/button'
import Spinner from './ui/Spinner';

const AiTextAssist = () => {
  const [prompt, setPrompt] = useState('');
  const { generateAndAddQuotes, isLoading } = useQuotes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 3) return;
    generateAndAddQuotes(prompt);
    setPrompt('');
  };

  return (
    <div className="bg-base-300/50 p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a vibe, e.g., 'courage'"
          className="flex-grow bg-base-200 border border-base-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || prompt.trim().length < 3}>
          {isLoading ? <><Spinner size="sm" /> <span className="ml-2">Generating...</span></> : 'Generate Quotes'}
        </Button>
      </form>
    </div>
  );
};

export default AiTextAssist;
