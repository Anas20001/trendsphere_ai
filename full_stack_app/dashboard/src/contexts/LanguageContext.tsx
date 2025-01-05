import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../locales';

const LANGUAGE_STORAGE_KEY = 'app-language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'ar')) {
      return stored;
    }
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ar' ? 'ar' : 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    // Update font family based on language
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [language, direction]);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value === undefined || value[k] === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        // Fallback to English or key itself
        return getNestedValue(translations.en, keys) || key;
      }
      value = value[k];
    }

    let text = value as string;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
    }
    return text;
  };

  // Helper function to safely get nested object values
  const getNestedValue = (obj: any, keys: string[]): string | undefined => {
    return keys.reduce((acc, key) => {
      if (acc === undefined) return undefined;
      return acc[key];
    }, obj);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}