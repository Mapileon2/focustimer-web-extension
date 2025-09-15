import React, { useState, useRef } from 'react';
import { useTimer } from './hooks/useTimer';
import { useAppSettings } from './hooks/useAppSettings';
import { Button } from './components/ui/button';
import { useToast } from './hooks/useToast';
import TrashIcon from './components/icons/TrashIcon';

const SmilePopupSettings = () => {
    const { triggerSmilePopup } = useTimer();
    const { settings, setCustomSmileImage, removeCustomSmileImage } = useAppSettings();
    const [preview, setPreview] = useState<string | null>(settings.customSmileImage);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!['image/jpeg', 'image/gif'].includes(file.type)) {
                addToast('Please select a JPEG or GIF file.', 'error');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                addToast('File size must be under 2MB.', 'error');
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (preview && selectedFile) {
            setCustomSmileImage(preview);
            addToast('Custom image saved!', 'success');
            setSelectedFile(null); // Reset selection
        } else {
            addToast('Please select a file first.', 'info');
        }
    };
    
    const handleRemove = () => {
        removeCustomSmileImage();
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        addToast('Custom image removed.', 'success');
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Test Smile Popup</h3>
                <p className="text-text-secondary mb-3 text-sm">
                    Click the button below to see how the Smile Popup will look at the end of a work session.
                </p>
                <Button onClick={triggerSmilePopup} variant="secondary">
                    Show Smile Popup
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Customize with an Image/GIF</h3>
                <p className="text-text-secondary mb-3 text-sm">
                    Add a personal touch! Upload your favorite motivational GIF or image to be displayed in the popup. (JPG/GIF, max 2MB)
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/gif"
                    className="hidden"
                />
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-center p-4 border-2 border-dashed border-base-300 rounded-lg hover:bg-base-300 transition"
                >
                    {preview ? <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-md" /> : <span>Click to upload image or GIF</span>}
                </button>
                <div className="flex items-center gap-3 mt-4">
                    <Button onClick={handleSave} disabled={!selectedFile}>
                        Save Image
                    </Button>
                    {settings.customSmileImage && (
                        <Button onClick={handleRemove} variant="ghost">
                            <TrashIcon className="w-5 h-5 mr-2" /> Remove Image
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmilePopupSettings;