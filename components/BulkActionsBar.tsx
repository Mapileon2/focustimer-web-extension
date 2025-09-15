import React, { useRef, useEffect } from 'react';
import { useQuotes } from '../hooks/useQuotes';
import { Button } from './ui/button'
import TrashIcon from './icons/TrashIcon';
import ExportIcon from './icons/ExportIcon';

const BulkActionsBar = () => {
    const {
        quotes,
        selectedQuoteIds,
        deleteSelectedQuotes,
        exportSelectedQuotes,
        selectAllQuotes,
        deselectAllQuotes
    } = useQuotes();

    const checkboxRef = useRef<HTMLInputElement>(null);
    const selectedCount = selectedQuoteIds.size;
    const allSelected = selectedCount === quotes.length && quotes.length > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < quotes.length;

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = isIndeterminate;
        }
    }, [isIndeterminate]);

    if (selectedCount === 0) {
        return null;
    }

    const handleSelectAllToggle = () => {
        if (allSelected) {
            deselectAllQuotes();
        } else {
            selectAllQuotes();
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCount} selected quotes?`)) {
            deleteSelectedQuotes();
        }
    };

    return (
        <div className="bg-base-300 rounded-lg p-3 mb-4 flex items-center justify-between transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-4">
                <input
                    ref={checkboxRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAllToggle}
                    className="h-5 w-5 rounded bg-base-100 border-base-200 text-brand-primary focus:ring-brand-primary"
                    aria-label="Select all quotes"
                />
                <span className="font-semibold text-text-primary">{selectedCount} selected</span>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleDelete} variant="ghost" size="sm" aria-label="Delete selected quotes">
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Delete
                </Button>
                <Button onClick={exportSelectedQuotes} variant="ghost" size="sm" aria-label="Export selected quotes">
                    <ExportIcon className="w-5 h-5 mr-1" />
                    Export
                </Button>
            </div>
        </div>
    );
};

export default BulkActionsBar;