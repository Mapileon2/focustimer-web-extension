export const STORAGE_KEY_TIMER_STATE = 'focus-smile-timer-state';
export const STORAGE_KEY_QUOTES = 'focus-smile-quotes';
export const STORAGE_KEY_SMILE_EVENTS = 'focus-smile-smile-events';
export const STORAGE_KEY_API_KEY = 'focus-smile-api-key';
export const STORAGE_KEY_SELECTED_MODEL = 'focus-smile-selected-model';
export const STORAGE_KEY_APP_SETTINGS = 'focus-smile-app-settings'; // Added for consistency

export const DEFAULT_MODEL = 'gemini-2.5-flash';
export const SELECTABLE_MODELS = [
    'gemini-2.5-flash',
];

// Replaced original URLs which caused CORS errors. New URLs are from a permissive CDN.
export const DEFAULT_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/10/28/audio_363401d7a2.mp3';
export const SOUND_OPTIONS = [
    { name: 'Alarm Clock', url: 'https://cdn.pixabay.com/audio/2022/10/28/audio_363401d7a2.mp3' },
    { name: 'Beep', url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c74438.mp3' },
    { name: 'Digital Watch', url: 'https://cdn.pixabay.com/audio/2022/11/21/audio_97ded7734a.mp3' },
    { name: 'Notification', url: 'https://cdn.pixabay.com/audio/2022/10/13/audio_7a3b47c94b.mp3' },
    { name: 'Chime', url: 'https://cdn.pixabay.com/audio/2022/11/17/audio_835704c1f9.mp3' },
];