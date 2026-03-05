import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { GraduationCap, Award, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { StudyProgram } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

export default function Study() {
  const { t, translate, language } = useTranslation();
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [translatedPrograms, setTranslatedPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'University' | 'Scholarship' | 'Training'>('All');
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPrograms = async () => {
      const q = query(collection(db, 'study_programs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyProgram));
      setPrograms(data);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const translateContent = async () => {
      const staticTexts = [
        'Study in Canada',
        'Canada is home to some of the world\'s top-ranked universities. Explore scholarships, training programs, and student visa requirements.',
        'All', 'University', 'Scholarship', 'Training',
        'Cost', 'Duration', 'View Details',
        'No programs found in this category.'
      ];

      const results: Record<string, string> = {};
      await Promise.all(staticTexts.map(async (text) => {
        results[text] = await translate(text);
      }));
      setTranslatedTexts(results);

      // Translate dynamic program content
      const translatedData = await Promise.all(programs.map(async (p) => {
        return {
          ...p,
          title: await translate(p.title),
          institution: await translate(p.institution),
          description: await translate(p.description),
          cost: await translate(p.cost),
          duration: await translate(p.duration),
          type: await translate(p.type) as any
        };
      }));
      setTranslatedPrograms(translatedData);
    };

    if (programs.length > 0) {
      translateContent();
    }
  }, [language, programs]);

  const tc = (text: string) => translatedTexts[text] || text;

  const filteredPrograms = (translatedPrograms.length > 0 ? translatedPrograms : programs).filter(p => filter === 'All' || p.type === filter || (translatedTexts[p.type] === filter));

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{tc('Study in Canada')}</h1>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              {tc('Canada is home to some of the world\'s top-ranked universities. Explore scholarships, training programs, and student visa requirements.')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {['All', 'University', 'Scholarship', 'Training'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === f ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-red-600'}`}
                >
                  {tc(f)}{f === 'All' ? '' : 's'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${program.type === 'Scholarship' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {program.type === 'Scholarship' ? <Award size={24} /> : <GraduationCap size={24} />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{tc(program.type)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{program.title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-6">{program.institution}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-slate-600">
                    <DollarSign size={16} className="mr-2 text-slate-400" />
                    <span>{tc('Cost')}: <span className="text-slate-900 font-bold">{program.cost}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock size={16} className="mr-2 text-slate-400" />
                    <span>{tc('Duration')}: <span className="text-slate-900 font-bold">{program.duration}</span></span>
                  </div>
                </div>

                <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed">
                  {program.description}
                </p>

                <a
                  href={program.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <span>{tc('View Details')}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
            {filteredPrograms.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400">{tc('No programs found in this category.')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
