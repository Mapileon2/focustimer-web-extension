import React, { useState, useEffect, useContext, createContext, ReactNode, useCallback, useRef } from 'react';
import { TimerState, SessionType, TimerSettings } from '../types';
import { STORAGE_KEY_TIMER_STATE, DEFAULT_SOUND_URL } from '../constants';

declare const chrome: any;

interface SessionDurations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

interface TimerContextType {
  timerState: TimerState;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  settings: TimerSettings;
  updateSettings: (newSettings: Partial<TimerSettings>) => void;
  completedWorkSessionsToday: number;
  showSmilePopup: boolean;
  confirmSmileAndProceed: () => void;
  triggerSmilePopup: () => void; // Added for testing
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const DEFAULT_DURATIONS: SessionDurations = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const LONG_BREAK_INTERVAL = 4;

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TimerSettings>({
    durations: DEFAULT_DURATIONS,
    soundUrl: DEFAULT_SOUND_URL,
  });
  const [timerState, setTimerState] = useState<TimerState>({
    remainingSec: settings.durations.work,
    sessionType: 'work',
    sessionCount: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const [completedWorkSessionsToday, setCompletedWorkSessionsToday] = useState(0);
  const [showSmilePopup, setShowSmilePopup] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    if (settings.soundUrl) {
      if (audioRef.current) {
        audioRef.current.src = settings.soundUrl;
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
    }
  }, [settings.soundUrl]);
  
  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const startNextSession = useCallback(() => {
    setIsActive(false);
    setShowSmilePopup(false);

    let nextSessionType: SessionType;
    let nextSessionCount = timerState.sessionCount;
    let newCompletedWorkSessions = completedWorkSessionsToday;

    if (timerState.sessionType === 'work') {
      newCompletedWorkSessions++;
      if (newCompletedWorkSessions % LONG_BREAK_INTERVAL === 0) {
        nextSessionType = 'longBreak';
      } else {
        nextSessionType = 'shortBreak';
      }
    } else {
      nextSessionType = 'work';
      nextSessionCount++;
    }
    
    setCompletedWorkSessionsToday(newCompletedWorkSessions);
    
    setTimerState({
      remainingSec: settings.durations[nextSessionType],
      sessionType: nextSessionType,
      sessionCount: nextSessionCount,
    });
    
    showNotification(
        "Session Over!",
        `Time for your ${nextSessionType === 'work' ? 'Work Session' : 'Break'}.`
    );

  }, [timerState, settings.durations, completedWorkSessionsToday]);

  useEffect(() => {
    if (isActive && timerState.remainingSec > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({ ...prev, remainingSec: prev.remainingSec - 1 }));
      }, 1000);
    } else if (isActive && timerState.remainingSec <= 0) {
      playSound();
      if (timerState.sessionType === 'work') {
        setShowSmilePopup(true);
      } else {
        startNextSession();
      }
      setIsActive(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timerState.remainingSec, startNextSession, playSound, timerState.sessionType]);

  useEffect(() => {
    audioRef.current = new Audio();
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(STORAGE_KEY_TIMER_STATE, (result: any) => {
        const stored = result[STORAGE_KEY_TIMER_STATE];
        if (stored) {
          const loadedSettings = {
            durations: stored.settings?.durations || DEFAULT_DURATIONS,
            soundUrl: stored.settings?.soundUrl !== undefined ? stored.settings.soundUrl : DEFAULT_SOUND_URL,
          };
          setSettings(loadedSettings);
          setTimerState(stored.timerState || { remainingSec: loadedSettings.durations.work, sessionType: 'work', sessionCount: 0 });
          setCompletedWorkSessionsToday(stored.completedWorkSessionsToday || 0);
        } else {
           setTimerState(prev => ({...prev, remainingSec: settings.durations.work}));
        }
      });
    }
    
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.local) {
      const stateToSave = {
        settings,
        timerState,
        completedWorkSessionsToday
      };
      chrome.storage.local.set({ [STORAGE_KEY_TIMER_STATE]: stateToSave });
    }
  }, [settings, timerState, completedWorkSessionsToday]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setTimerState(prev => ({ ...prev, remainingSec: settings.durations[prev.sessionType] }));
  };

  const skipSession = () => {
    if (window.confirm('Are you sure you want to skip to the next session?')) {
      startNextSession();
    }
  };
  
  const confirmSmileAndProceed = () => {
      startNextSession();
  };
  
  const triggerSmilePopup = () => {
      setShowSmilePopup(true);
  }

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    const updated = { 
        ...settings, 
        ...newSettings,
        durations: { ...settings.durations, ...newSettings.durations }
    };
    setSettings(updated);
    if (!isActive) {
        setTimerState(ts => ({...ts, remainingSec: updated.durations[ts.sessionType]}));
    }
  };

  const value = {
    timerState,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    settings,
    updateSettings,
    completedWorkSessionsToday,
    showSmilePopup,
    confirmSmileAndProceed,
    triggerSmilePopup,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};