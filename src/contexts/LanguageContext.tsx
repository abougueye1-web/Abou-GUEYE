import React, { createContext, useContext, useState } from 'react';

export type Language = 'EN' | 'FR' | 'AR' | 'ES' | 'IT' | 'DE';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('FR');

  // These are now stubs because Google Translate handles the actual translation in the DOM
  const translate = async (text: string) => text;
  const t = (key: string) => key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
