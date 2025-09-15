
import React, { useState, useRef } from 'react';
import { useQuotes } from '../hooks/useQuotes';
import { Button } from './ui/button';
import Spinner from './ui/Spinner';

const AiImageQuote = () => {
    const [theme, setTheme] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<{ text: string, imageUrl: string } | null>(null);
    const { generateAndDisplayImageQuote, isLoading } = useQuotes();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File size exceeds 5MB.");
                return;
            }
            setFile(selectedFile);
            setGeneratedImage(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !theme) return;
        const result = await generateAndDisplayImageQuote(file, theme);
        if (result) {
            setGeneratedImage(result);
        }
    };

    return (
        <div className="bg-base-300/50 p-4 rounded-lg mt-4">
             <h3 className="font-semibold mb-2 text-lg">AI Image Quote Generator</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-center p-4 border-2 border-dashed border-base-300 rounded-lg hover:bg-base-200 transition"
                >
                    {preview ? <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-md" /> : <span>Click to upload image (JPG/PNG, max 5MB)</span>}
                </button>
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Enter a theme, e.g., 'perseverance'"
                    className="w-full bg-base-200 border border-base-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !file || !theme}>
                    {isLoading ? <><Spinner size="sm" /><span className="ml-2">Generating Image...</span></> : 'Generate Image Quote'}
                </Button>
            </form>
            {generatedImage && (
                <div className="mt-4 p-4 border border-base-300 rounded-lg">
                    <h4 className="font-semibold mb-2">Generated Image:</h4>
                    <p className="text-text-secondary text-sm mb-2 italic">"{generatedImage.text}"</p>
                    <img src={generatedImage.imageUrl} alt="Generated quote" className="w-full rounded-md" />
                </div>
            )}
        </div>
    );
};

export default AiImageQuote;
