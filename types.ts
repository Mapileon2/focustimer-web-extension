export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export interface Quote {
  id: number;
  text: string;
  author: string;
  isFavorite: boolean;
  category?: string;
  source: 'curated' | 'ai-generated' | 'user' | 'favorite';
  rating?: number;
}

export interface RecapStats {
  totalFocusMin: number;
  totalSessions: number;
  favQuote: Quote | null;
}

export interface SmileEvent {
  timestamp: number;
  quoteId: number;
  sessionType: SessionType;
  sessionCount: number;
  type: 'smile' | 'skip';
}

export interface TimerState {
  remainingSec: number;
  sessionType: SessionType;
  sessionCount: number;
}

export interface TimerSettings {
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  soundUrl: string;
}
