import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AdPlacementProps {
  type: 'header' | 'sidebar' | 'inArticle' | 'footer' | 'mobile';
}

export default function AdPlacement({ type }: AdPlacementProps) {
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdCode = async () => {
      const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        const codeKey = `adsense${type.charAt(0).toUpperCase() + type.slice(1)}`;
        setAdCode(data[codeKey] || null);
      }
    };
    fetchAdCode();
  }, [type]);

  if (!adCode) return null;

  return (
    <div className="ad-container my-8 flex justify-center overflow-hidden max-w-full">
      <div 
        dangerouslySetInnerHTML={{ __html: adCode }} 
        className="mx-auto text-center text-[10px] text-slate-400 uppercase tracking-widest"
      />
    </div>
  );
}
