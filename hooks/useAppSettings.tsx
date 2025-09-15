import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { STORAGE_KEY_APP_SETTINGS } from '../constants';

declare const chrome: any;

type Theme = 'light' | 'dark';

interface AppSettings {
  theme: Theme;
  customSmileImage: string | null;
}

interface AppSettingsContextType {
  settings: AppSettings;
  setTheme: (theme: Theme) => void;
  setCustomSmileImage: (imageBase64: string) => void;
  removeCustomSmileImage: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  theme: 'dark', // Default to dark as per UI
  customSmileImage: null,
};

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for user's system preference
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';

    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(STORAGE_KEY_APP_SETTINGS, (result: any) => {
        const stored = result[STORAGE_KEY_APP_SETTINGS];
        setSettings(stored || { ...defaultSettings, theme: initialTheme });
        setIsLoaded(true);
      });
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_APP_SETTINGS);
        setSettings(stored ? JSON.parse(stored) : { ...defaultSettings, theme: initialTheme });
      } catch (e) {
        setSettings({ ...defaultSettings, theme: initialTheme });
      }
      setIsLoaded(true);
    }
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', settings.theme);
      if (chrome && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ [STORAGE_KEY_APP_SETTINGS]: settings });
      } else {
          localStorage.setItem(STORAGE_KEY_APP_SETTINGS, JSON.stringify(settings));
      }
    }
  }, [settings, isLoaded]);

  const setTheme = (theme: Theme) => {
    setSettings(s => ({ ...s, theme }));
  };
  
  const setCustomSmileImage = (imageBase64: string) => {
    setSettings(s => ({...s, customSmileImage: imageBase64 }));
  }

  const removeCustomSmileImage = () => {
    setSettings(s => ({...s, customSmileImage: null }));
  }
  
  return (
    <AppSettingsContext.Provider value={{ settings, setTheme, setCustomSmileImage, removeCustomSmileImage }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};