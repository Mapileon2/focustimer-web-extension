import React, { useState, useEffect } from 'react';
import { Button } from './ui/button'
import { Card } from '@/components/ui/card'
import { useApiKey } from '../hooks/useApiKey';
import { testApiKey } from '../services/geminiService';
import Spinner from './ui/Spinner';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import { SELECTABLE_MODELS } from '../constants';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';


interface ApiKeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeySettingsModal = ({ isOpen, onClose }: ApiKeySettingsModalProps) => {
  const { apiKey, setApiKey, selectedModel, setSelectedModel } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localModel, setLocalModel] = useState(selectedModel);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
        setLocalApiKey(apiKey || '');
        setLocalModel(selectedModel);
        setTestStatus('idle');
        setIsKeyVisible(false);
    }
  }, [isOpen, apiKey, selectedModel])

  useEffect(() => {
    setTestStatus('idle');
  }, [localApiKey, localModel]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    setApiKey(localApiKey);
    setSelectedModel(localModel);
    onClose();
  };
  
  const handleClose = () => {
    setLocalApiKey(apiKey || '');
    setLocalModel(selectedModel);
    onClose();
  }
  
  const handleTestKey = async () => {
      if (!localApiKey) return;
      setIsTesting(true);
      setTestStatus('idle');
      const isValid = await testApiKey(localApiKey, localModel);
      setTestStatus(isValid ? 'success' : 'error');
      setIsTesting(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">API Key Settings</h3>
        <p className="text-text-secondary mb-4 text-sm">
          Enter your Google Gemini API key to enable AI features. Your key is stored locally and never sent to our servers.
        </p>
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-text-secondary mb-1">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={isKeyVisible ? 'text' : 'password'}
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-base-100 border border-base-300 rounded-md p-2 pr-20"
              placeholder="Enter your API key"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                <button type="button" onClick={() => setIsKeyVisible(!isKeyVisible)} className="text-text-secondary hover:text-text-primary" aria-label={isKeyVisible ? "Hide API key" : "Show API key"}>
                  {isKeyVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                </button>
                {isTesting ? <Spinner size="sm"/> : (
                    <>
                        {testStatus === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                        {testStatus === 'error' && <XCircleIcon className="w-5 h-5 text-red-500" />}
                    </>
                )}
            </div>
          </div>
        </div>
        <div className="mt-4">
            <label htmlFor="model-select" className="block text-sm font-medium text-text-secondary mb-1">
                Text Generation Model
            </label>
            <select
                id="model-select"
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="w-full bg-base-100 border border-base-300 rounded-md p-2"
            >
                {SELECTABLE_MODELS.map(modelName => (
                    <option key={modelName} value={modelName}>{modelName}</option>
                ))}
            </select>
        </div>
        <Button onClick={handleTestKey} disabled={isTesting || !localApiKey} variant="ghost" className="w-full mt-3">
            {isTesting ? 'Testing...' : 'Test Key'}
        </Button>
        <div className="mt-6 pt-4 border-t border-base-300">
            <h4 className="font-semibold text-text-primary">Models Used by this App</h4>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1 font-mono">
                <li>Text: {localModel} (selected above)</li>
                <li>Image Editing: gemini-2.5-flash-image-preview</li>
                <li>Image Generation: imagen-4.0-generate-001</li>
            </ul>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
};

export default ApiKeySettingsModal;