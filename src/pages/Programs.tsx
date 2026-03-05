import { motion } from 'motion/react';
import { Shield, Users, Map, Ship, HeartHandshake, ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useTranslation } from '../contexts/LanguageContext';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="text-blue-600" />,
  Map: <Map className="text-red-600" />,
  Ship: <Ship className="text-emerald-600" />,
  HeartHandshake: <HeartHandshake className="text-orange-600" />,
  Globe: <Globe className="text-indigo-600" />,
};

export default function Programs() {
  const { translate, language } = useTranslation();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});

  const defaultPrograms = [
    {
      title: 'Express Entry',
      iconName: 'Shield',
      desc: 'The primary system for managing applications for permanent residence under three federal economic immigration programs.',
      features: ['Federal Skilled Worker', 'Federal Skilled Trades', 'Canadian Experience Class'],
      color: 'text-blue-600'
    },
    {
      title: 'Provincial Nominee Program (PNP)',
      iconName: 'Map',
      desc: 'For workers who have the skills, education and work experience to contribute to the economy of a specific province or territory.',
      features: ['Ontario OINP', 'BC PNP', 'Alberta Advantage', 'Saskatchewan SINP'],
      color: 'text-red-600'
    },
    {
      title: 'Atlantic Immigration Program',
      iconName: 'Ship',
      desc: 'A pathway to permanent residence for skilled foreign workers and international graduates from a Canadian institution who want to work and live in one of Canada’s 4 Atlantic provinces.',
      features: ['Nova Scotia', 'New Brunswick', 'PEI', 'Newfoundland'],
      color: 'text-emerald-600'
    },
    {
      title: 'Caregiver Programs',
      iconName: 'HeartHandshake',
      desc: 'Pathways for caregivers to become permanent residents or work temporarily in Canada.',
      features: ['Home Child Care Provider', 'Home Support Worker'],
      color: 'text-orange-600'
    }
  ];

  useEffect(() => {
    const q = query(collection(db, 'immigration_programs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(fetched.length > 0 ? fetched : defaultPrograms);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const translateAll = async () => {
      const toTranslate = [
        'Canadian Immigration Programs',
        'Explore the various pathways to permanent residency in Canada. From federal systems to provincial initiatives, we explain every option available to you.',
        'Rural and Northern Immigration Pilot (RNIP)',
        'A community-driven program designed to spread the benefits of economic immigration to smaller communities by creating a path to permanent residence for skilled foreign workers who want to work and live in one of the participating communities.',
        'Community recommendation required',
        'Job offer from a local employer',
        'Intent to live in the community',
        'Explore Participating Communities',
        'View Eligibility & Requirements'
      ];

      const results: Record<string, string> = {};
      await Promise.all(toTranslate.map(async (text) => {
        results[text] = await translate(text);
      }));

      // Also translate program content
      for (const p of programs) {
        results[p.title] = await translate(p.title);
        results[p.desc || p.description] = await translate(p.desc || p.description);
        for (const f of p.features) {
          results[f] = await translate(f);
        }
      }

      setTranslatedContent(results);
    };

    if (!loading) {
      translateAll();
    }
  }, [language, loading, programs]);

  const t = (text: string) => translatedContent[text] || text;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white pb-24">
      {/* Hero */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('Canadian Immigration Programs')}
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('Explore the various pathways to permanent residency in Canada. From federal systems to provincial initiatives, we explain every option available to you.')}
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {programs.map((program, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-50 transition-colors">
                  {iconMap[program.iconName] || <Shield className={program.color || 'text-blue-600'} />}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{t(program.title)}</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">{t(program.desc || program.description)}</p>
                
                <div className="space-y-3 mb-10">
                  {program.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center text-sm font-semibold text-slate-700">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"></div>
                      {t(f)}
                    </div>
                  ))}
                </div>

                <Link
                  to="/visas"
                  className="inline-flex items-center text-red-600 font-bold hover:translate-x-2 transition-transform"
                >
                  {t('View Eligibility & Requirements')} <ArrowRight size={18} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rural Pilot Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t('Rural and Northern Immigration Pilot (RNIP)')}</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                {t('A community-driven program designed to spread the benefits of economic immigration to smaller communities by creating a path to permanent residence for skilled foreign workers who want to work and live in one of the participating communities.')}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-slate-300"><div className="w-5 h-5 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mr-3 font-bold text-xs">✓</div> {t('Community recommendation required')}</li>
                <li className="flex items-center text-slate-300"><div className="w-5 h-5 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mr-3 font-bold text-xs">✓</div> {t('Job offer from a local employer')}</li>
                <li className="flex items-center text-slate-300"><div className="w-5 h-5 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mr-3 font-bold text-xs">✓</div> {t('Intent to live in the community')}</li>
              </ul>
              <button className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all shadow-2xl">
                {t('Explore Participating Communities')}
              </button>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3">
              <img src="https://picsum.photos/seed/rural-canada/800/600" alt="Rural Canada" className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
