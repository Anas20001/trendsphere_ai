import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    window.dispatchEvent(new Event('languagechange'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="w-4 h-4" />
        <span>{language === 'en' ? 'English' : 'العربية'}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50">
            {[
              { code: 'en', label: 'English', nativeLabel: 'English' },
              { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as 'en' | 'ar')}
                className={`
                  w-full flex items-center justify-between px-4 py-2 text-sm
                  ${language === lang.code 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                  ${lang.code === 'ar' ? 'font-arabic' : ''}
                `}
              >
                <span>{lang.nativeLabel}</span>
                {language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}