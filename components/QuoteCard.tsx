import React, { useState } from 'react';
import { Quote } from '../types';
import { useQuotes } from '../hooks/useQuotes';
import { Button } from './ui/button'
import StarFilledIcon from './icons/StarFilledIcon';
import StarOutlineIcon from './icons/StarOutlineIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import SaveIcon from './icons/SaveIcon';
import CancelIcon from './icons/CancelIcon';

interface QuoteCardProps {
  quote: Quote;
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  const { toggleFavorite, deleteQuote, updateQuote, toggleQuoteSelection, selectedQuoteIds } = useQuotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(quote.text);
  const [editedAuthor, setEditedAuthor] = useState(quote.author);
  const [editedCategory, setEditedCategory] = useState(quote.category || '');

  const isSelected = selectedQuoteIds.has(quote.id);

  const handleSave = () => {
    if (editedText.trim() && editedAuthor.trim()) {
      updateQuote(quote.id, editedText, editedAuthor, editedCategory);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setEditedText(quote.text);
    setEditedAuthor(quote.author);
    setEditedCategory(quote.category || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(quote.id);
    }
  };

  const handleCheckboxChange = () => {
    toggleQuoteSelection(quote.id);
  };

  return (
    <div className={`bg-base-200 p-4 rounded-lg shadow transition-all duration-200 flex items-start gap-4 ${isSelected ? 'ring-2 ring-brand-primary bg-base-300' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        className="mt-1 h-5 w-5 rounded bg-base-100 border-base-300 text-brand-primary focus:ring-brand-primary"
        aria-label={`Select quote: ${quote.text}`}
      />
      <div className="flex-grow">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full bg-base-100 border border-base-300 rounded-md p-2 text-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              rows={3}
            />
            <input
              type="text"
              value={editedAuthor}
              onChange={(e) => setEditedAuthor(e.target.value)}
              className="w-full bg-base-100 border border-base-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
            <input
              type="text"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              placeholder="Category"
              className="w-full bg-base-100 border border-base-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
          </div>
        ) : (
          <>
            <blockquote className="text-xl italic text-text-primary mb-4">
              "{quote.text}"
            </blockquote>
            <div className="flex justify-between items-center mt-4 border-t border-base-300 pt-3">
                {quote.category ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-brand-secondary/20 text-brand-secondary capitalize">{quote.category}</span>
                ) : <div />}
                <cite className="font-medium text-text-primary not-italic">&mdash; {quote.author}</cite>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        {isEditing ? (
           <>
            <Button onClick={handleSave} size="sm" variant="ghost" aria-label="Save changes"><SaveIcon className="w-5 h-5"/></Button>
            <Button onClick={handleCancel} size="sm" variant="ghost" aria-label="Cancel editing"><CancelIcon className="w-5 h-5"/></Button>
           </>
        ) : (
           <>
            <Button onClick={() => toggleFavorite(quote.id)} size="sm" variant="ghost" aria-label={quote.isFavorite ? 'Unfavorite' : 'Favorite'}>
              {quote.isFavorite ? <StarFilledIcon className="w-5 h-5 text-yellow-400"/> : <StarOutlineIcon className="w-5 h-5"/>}
            </Button>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost" aria-label="Edit quote"><EditIcon className="w-5 h-5"/></Button>
            <Button onClick={handleDelete} size="sm" variant="ghost" aria-label="Delete quote"><TrashIcon className="w-5 h-5"/></Button>
           </>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;