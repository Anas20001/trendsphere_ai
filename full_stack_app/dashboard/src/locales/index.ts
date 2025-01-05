import en from './en.json';
import ar from './ar.json';

export const translations = {
  en,
  ar
} as const;

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;