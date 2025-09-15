import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidApiKey = (key: string): boolean => {
    if (!key || key.length < 30) {
        return false;
    }
    // Google AI API keys are typically alphanumeric.
    // This is a basic check and might need to be adjusted
    // if the key format changes.
    const pattern = /^[a-zA-Z0-9_-]+$/;
    return pattern.test(key);
};
