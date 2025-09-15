import React, { useState, useEffect } from 'react';
import TimerSection from './components/TimerSection';
import QuoteSection from './components/QuoteSection';
import SessionRecap from './components/SessionRecap';
import SmilePopup from './components/SmilePopup';
import ApiKeySettingsModal from './components/ApiKeySettingsModal';
import { TimerProvider } from './hooks/useTimer';
import { QuotesProvider } from './hooks/useQuotes';
import { ToastProvider } from './hooks/useToast';
import { ApiKeyProvider, useApiKey } from './hooks/useApiKey';
import { Button } from './components/ui/button';
import KeyIcon from './components/icons/KeyIcon';
import { AppSettingsProvider } from './hooks/useAppSettings';
import { Switch } from './components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

const AppContent = () => {
    const { isKeySet, openSettingsModal, isSettingsModalOpen, closeSettingsModal } = useApiKey();
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            <header className="p-4 flex justify-between items-center border-b border-base-300 bg-background shadow-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img src="/icon48.png" alt="Focus Smile Logo" className="w-8 h-8 rounded-full"/>
                    <h1 className="text-2xl font-bold text-brand-primary">Focus Smile</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={openSettingsModal} variant="outline" size="sm">
                        <KeyIcon className="w-5 h-5 mr-2" />
                        API Key
                    </Button>
                    <Switch checked={isDark} onCheckedChange={setIsDark} className="data-[state=checked]:bg-brand-primary" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:px-6 md:px-8 max-w-6xl">
                {!isKeySet && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
                        <p className="font-bold">API Key Required</p>
                        <p>Please set your Google Gemini API key in the settings to enable AI-powered features.</p>
                    </div>
                )}
                <Tabs defaultValue="timer" className="space-y-4 w-full">
                    <TabsList className="justify-start">
                        <TabsTrigger value="timer">Timer</TabsTrigger>
                        <TabsTrigger value="recap">Session Recap</TabsTrigger>
                        <TabsTrigger value="quotes">Quotes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timer" className="p-4 bg-card rounded-lg shadow">
                        <TimerSection />
                    </TabsContent>
                    <TabsContent value="recap" className="p-4 bg-card rounded-lg shadow">
                        <SessionRecap />
                    </TabsContent>
                    <TabsContent value="quotes" className="p-4 bg-card rounded-lg shadow">
                        <QuoteSection />
                    </TabsContent>
                </Tabs>
            </main>

            <SmilePopup />
            <ApiKeySettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />
        </div>
    );
}

const App = () => {
  return (
    <AppSettingsProvider>
      <ToastProvider>
        <ApiKeyProvider>
          <TimerProvider>
            <QuotesProvider>
              <AppContent />
            </QuotesProvider>
          </TimerProvider>
        </ApiKeyProvider>
      </ToastProvider>
    </AppSettingsProvider>
  );
};

export default App;
