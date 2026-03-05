import React from 'react';

interface TranslateProps {
  children: React.ReactNode;
}

/**
 * This component is now a simple wrapper. 
 * The actual translation is handled by the Google Translate widget in the DOM.
 */
export default function Translate({ children }: TranslateProps) {
  return <>{children}</>;
}
