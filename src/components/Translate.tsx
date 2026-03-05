import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface TranslateProps {
  children: string;
}

export default function Translate({ children }: TranslateProps) {
  const { translate, language } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    let isMounted = true;
    const doTranslate = async () => {
      if (!children) return;
      const result = await translate(children);
      if (isMounted) {
        setTranslatedText(result);
      }
    };
    doTranslate();
    return () => { isMounted = false; };
  }, [children, language, translate]);

  return <>{translatedText}</>;
}
