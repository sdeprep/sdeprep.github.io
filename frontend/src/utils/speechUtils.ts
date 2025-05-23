import wakeWordsConfig from '../config/wakeWords.json';

export interface WakeWord {
    phrase: string;
    action: string;
    description: string;
}

export interface WakeWordsConfig {
    wakeWords: WakeWord[];
    settings: {
        caseSensitive: boolean;
        ignorePunctuation: boolean;
        partialMatch: boolean;
    };
}

/**
 * Normalizes text for phrase detection by removing punctuation and handling case sensitivity
 */
export function normalizeText(text: string, config: WakeWordsConfig['settings']): string {
    let normalized = text;

    // Remove punctuation if configured
    if (config.ignorePunctuation) {
        normalized = normalized.replace(/[^\w\s]/g, '');
    }

    // Handle case sensitivity
    if (!config.caseSensitive) {
        normalized = normalized.toLowerCase();
    }

    // Normalize whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
}

/**
 * Detects wake words in the given text
 */
export function detectWakeWords(text: string): WakeWord | null {
    const config = wakeWordsConfig as WakeWordsConfig;
    const normalizedText = normalizeText(text, config.settings);

    console.log('Wake word detection - checking:', text, '-> normalized:', normalizedText);

    for (const wakeWord of config.wakeWords) {
        const normalizedPhrase = normalizeText(wakeWord.phrase, config.settings);

        if (config.settings.partialMatch) {
            if (normalizedText.includes(normalizedPhrase)) {
                console.log('Wake word match found:', wakeWord.phrase);
                return wakeWord;
            }
        } else {
            // Check for exact match or phrase at word boundaries
            const regex = new RegExp(`\\b${normalizedPhrase.replace(/\s+/g, '\\s+')}\\b`);
            if (regex.test(normalizedText)) {
                console.log('Wake word match found:', wakeWord.phrase);
                return wakeWord;
            }
        }
    }

    return null;
}

/**
 * Gets all configured wake words
 */
export function getWakeWords(): WakeWord[] {
    const config = wakeWordsConfig as WakeWordsConfig;
    return config.wakeWords;
} 