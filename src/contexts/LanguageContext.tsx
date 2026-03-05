import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export type Language = 'EN' | 'FR' | 'AR' | 'ES' | 'IT' | 'DE';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => Promise<string>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionary: Record<Language, Record<string, string>> = {
  EN: {
    'nav.visas': 'Visas',
    'nav.jobs': 'Jobs',
    'nav.study': 'Study',
    'nav.eligibility': 'Eligibility',
    'nav.programs': 'Programs',
    'nav.lifeguide': 'Life Guide',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    'nav.signin': 'Sign In',
    'nav.language': 'Language',
    'hero.title': 'Your Gateway to Canada',
    'hero.subtitle': 'Expert guidance for your immigration journey. From visas to settlement, we help you every step of the way.',
    'hero.cta': 'Start Your Journey',
    'hero.secondary': 'Check Eligibility',
  },
  FR: {
    'nav.visas': 'Visas',
    'nav.jobs': 'Emplois',
    'nav.study': 'Études',
    'nav.eligibility': 'Éligibilité',
    'nav.programs': 'Programmes',
    'nav.lifeguide': 'Guide de Vie',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.logout': 'Déconnexion',
    'nav.signin': 'Connexion',
    'nav.language': 'Langue',
    'hero.title': 'Votre Porte d\'Entrée vers le Canada',
    'hero.subtitle': 'Conseils d\'experts pour votre parcours d\'immigration. Des visas à l\'installation, nous vous aidons à chaque étape.',
    'hero.cta': 'Commencez Votre Parcours',
    'hero.secondary': 'Vérifier l\'Éligibilité',
  },
  AR: {
    'nav.visas': 'تأشيرات',
    'nav.jobs': 'وظائف',
    'nav.study': 'دراسة',
    'nav.eligibility': 'الأهلية',
    'nav.programs': 'برامج',
    'nav.lifeguide': 'دليل الحياة',
    'nav.blog': 'مدونة',
    'nav.admin': 'مسؤول',
    'nav.logout': 'تسجيل الخروج',
    'nav.signin': 'تسجيل الدخول',
    'nav.language': 'اللغة',
    'hero.title': 'بوابتك إلى كندا',
    'hero.subtitle': 'توجيهات الخبراء لرحلة الهجرة الخاصة بك. من التأشيرات إلى الاستقرار، نساعدك في كل خطوة.',
    'hero.cta': 'ابدأ رحلتك',
    'hero.secondary': 'تحقق من الأهلية',
  },
  ES: {
    'nav.visas': 'Visas',
    'nav.jobs': 'Trabajos',
    'nav.study': 'Estudio',
    'nav.eligibility': 'Elegibilidad',
    'nav.programs': 'Programas',
    'nav.lifeguide': 'Guía de Vida',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.logout': 'Cerrar Sesión',
    'nav.signin': 'Iniciar Sesión',
    'nav.language': 'Idioma',
    'hero.title': 'Tu Puerta de Entrada a Canadá',
    'hero.subtitle': 'Orientación experta para su viaje de inmigración. Desde visas hasta asentamiento, le ayudamos en cada paso del camino.',
    'hero.cta': 'Comienza Tu Viaje',
    'hero.secondary': 'Verificar Elegibilidad',
  },
  IT: {
    'nav.visas': 'Visti',
    'nav.jobs': 'Lavori',
    'nav.study': 'Studio',
    'nav.eligibility': 'Idoneità',
    'nav.programs': 'Programmi',
    'nav.lifeguide': 'Guida alla Vita',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    'nav.signin': 'Accedi',
    'nav.language': 'Lingua',
    'hero.title': 'La Tua Porta per il Canada',
    'hero.subtitle': 'Guida esperta per il tuo viaggio di immigrazione. Dai visti all\'insediamento, ti aiutiamo in ogni fase.',
    'hero.cta': 'Inizia il Tuo Viaggio',
    'hero.secondary': 'Verifica Idoneità',
  },
  DE: {
    'nav.visas': 'Visa',
    'nav.jobs': 'Jobs',
    'nav.study': 'Studium',
    'nav.eligibility': 'Berechtigung',
    'nav.programs': 'Programme',
    'nav.lifeguide': 'Lebensleitfaden',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.logout': 'Abmelden',
    'nav.signin': 'Anmelden',
    'nav.language': 'Sprache',
    'hero.title': 'Ihr Tor nach Kanada',
    'hero.subtitle': 'Fachkundige Beratung für Ihre Einwanderungsreise. Von Visa bis zur Ansiedlung unterstützen wir Sie bei jedem Schritt.',
    'hero.cta': 'Beginnen Sie Ihre Reise',
    'hero.secondary': 'Berechtigung prüfen',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'FR';
  });

  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const translate = async (text: string): Promise<string> => {
    if (language === 'EN') return text;
    
    const cacheKey = `${language}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text to ${language}. Return ONLY the translated text, no extra words: "${text}"`,
      });
      
      const translated = response.text || text;
      setTranslationCache(prev => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  const t = (key: string): string => {
    return dictionary[language][key] || dictionary['EN'][key] || key;
  };

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
