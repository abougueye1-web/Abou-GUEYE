import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { VisaGuide } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

export default function VisaGuides() {
  const { t, translate, language } = useTranslation();
  const [guides, setGuides] = useState<VisaGuide[]>([]);
  const [translatedGuides, setTranslatedGuides] = useState<VisaGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchGuides = async () => {
      const q = query(collection(db, 'visa_guides'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisaGuide));
      setGuides(data);
      setLoading(false);
    };
    fetchGuides();
  }, []);

  useEffect(() => {
    const translateContent = async () => {
      const staticTexts = [
        'Canada Visa & Immigration Guides',
        'Comprehensive, step-by-step instructions for every Canadian visa category. Updated for 2026 regulations.',
        'Work Visa', 'For skilled workers, professionals, and tradespeople.',
        'Student Visa', 'For international students admitted to Canadian schools.',
        'Permanent Residency', 'Live and work in Canada permanently.',
        'Express Entry', 'The fastest way to immigrate as a skilled worker.',
        'All Immigration Guides', 'Filter:', 'All Types', 'Work', 'Study', 'PR',
        '2026 Updated', 'View Guide', 'No visa guides found. Check back soon!'
      ];

      const results: Record<string, string> = {};
      await Promise.all(staticTexts.map(async (text) => {
        results[text] = await translate(text);
      }));
      setTranslatedTexts(results);

      // Translate dynamic guide content
      const translatedData = await Promise.all(guides.map(async (guide) => {
        return {
          ...guide,
          title: await translate(guide.title),
          type: await translate(guide.type)
        };
      }));
      setTranslatedGuides(translatedData);
    };

    if (guides.length > 0) {
      translateContent();
    }
  }, [language, guides]);

  const tc = (text: string) => translatedTexts[text] || text;

  const visaTypes = [
    { title: 'Work Visa', icon: <ShieldCheck className="text-blue-600" />, desc: 'For skilled workers, professionals, and tradespeople.' },
    { title: 'Student Visa', icon: <ShieldCheck className="text-red-600" />, desc: 'For international students admitted to Canadian schools.' },
    { title: 'Permanent Residency', icon: <ShieldCheck className="text-emerald-600" />, desc: 'Live and work in Canada permanently.' },
    { title: 'Express Entry', icon: <ShieldCheck className="text-orange-600" />, desc: 'The fastest way to immigrate as a skilled worker.' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{tc('Canada Visa & Immigration Guides')}</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            {tc('Comprehensive, step-by-step instructions for every Canadian visa category. Updated for 2026 regulations.')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visaTypes.map((type, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                {type.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{tc(type.title)}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{tc(type.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <section className="mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">{tc('All Immigration Guides')}</h2>
            <div className="flex space-x-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Filter:')}</span>
              <select className="text-xs font-bold text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
                <option>{tc('All Types')}</option>
                <option>{tc('Work')}</option>
                <option>{tc('Study')}</option>
                <option>{tc('PR')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(translatedGuides.length > 0 ? translatedGuides : guides).map((guide) => (
                <Link
                  key={guide.id}
                  to={`/visas/${guide.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={guide.image || `https://picsum.photos/seed/${guide.slug}/600/400`}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-600">
                      {tc(guide.type)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">{guide.title}</h3>
                    <div className="flex items-center text-xs text-slate-500 space-x-4">
                      <div className="flex items-center"><Info size={14} className="mr-1" /> {tc('2026 Updated')}</div>
                      <div className="flex items-center"><ArrowRight size={14} className="mr-1" /> {tc('View Guide')}</div>
                    </div>
                  </div>
                </Link>
              ))}
              {guides.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400">{tc('No visa guides found. Check back soon!')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
