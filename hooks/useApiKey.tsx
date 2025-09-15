import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { STORAGE_KEY_API_KEY, STORAGE_KEY_SELECTED_MODEL, DEFAULT_MODEL } from '../constants';

declare const chrome: any;

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isKeySet: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(null);
  const [selectedModel, setSelectedModelInternal] = useState<string>(DEFAULT_MODEL);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY_API_KEY, STORAGE_KEY_SELECTED_MODEL], (result: any) => {
        setApiKeyInternal(result[STORAGE_KEY_API_KEY] || null);
        setSelectedModelInternal(result[STORAGE_KEY_SELECTED_MODEL] || DEFAULT_MODEL);
        setIsLoaded(true);
      });
    } else {
      const storedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
      const storedModel = localStorage.getItem(STORAGE_KEY_SELECTED_MODEL);
      setApiKeyInternal(storedKey);
      setSelectedModelInternal(storedModel || DEFAULT_MODEL);
      setIsLoaded(true);
    }
  }, []);

  const setApiKey = (key: string | null) => {
    const trimmedKey = key ? key.trim() : null;
    setApiKeyInternal(trimmedKey);
    if (chrome && chrome.storage && chrome.storage.local) {
      if (trimmedKey) {
        chrome.storage.local.set({ [STORAGE_KEY_API_KEY]: trimmedKey });
      } else {
        chrome.storage.local.remove(STORAGE_KEY_API_KEY);
      }
    } else {
      if (trimmedKey) {
        localStorage.setItem(STORAGE_KEY_API_KEY, trimmedKey);
      } else {
        localStorage.removeItem(STORAGE_KEY_API_KEY);
      }
    }
  };

  const setSelectedModel = (model: string) => {
    setSelectedModelInternal(model);
    if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [STORAGE_KEY_SELECTED_MODEL]: model });
    } else {
        localStorage.setItem(STORAGE_KEY_SELECTED_MODEL, model);
    }
  };
  
  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const isKeySet = !!apiKey;

  if (!isLoaded) {
    return null; 
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isKeySet, selectedModel, setSelectedModel, isSettingsModalOpen, openSettingsModal, closeSettingsModal }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};