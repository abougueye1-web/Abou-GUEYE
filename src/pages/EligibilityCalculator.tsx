import { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function EligibilityCalculator() {
  const { t, translate, language } = useTranslation();
  const [score, setScore] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    education: 'Bachelor',
    experience: '3',
    language: 'CLB 9',
    jobOffer: 'No'
  });
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const translateContent = async () => {
      const staticTexts = [
        'Express Entry CRS Calculator',
        'Estimate your Comprehensive Ranking System (CRS) score for Canadian immigration.',
        'Age', 'Education Level', 'Work Experience (Years)', 'Language Proficiency (English/French)', 'Valid Job Offer in Canada?',
        'High School', 'Bachelor', 'Master', 'PhD', 'No', 'Yes',
        'Calculate My Score', 'Your Estimated CRS Score', 'Good Chance',
        'Based on recent draws, a score of {score} is competitive. We recommend starting your Express Entry profile as soon as possible.',
        'Ready to Calculate?', 'Fill out the form to see your estimated immigration score.',
        'Disclaimer', 'This calculator provides an estimate only and does not guarantee immigration success. Official CRS scores are determined by IRCC at the time of application.'
      ];

      const results: Record<string, string> = {};
      await Promise.all(staticTexts.map(async (text) => {
        results[text] = await translate(text);
      }));
      setTranslatedTexts(results);
    };

    translateContent();
  }, [language]);

  const tc = (text: string) => translatedTexts[text] || text;

  const calculate = () => {
    let s = 0;
    // Simple mock CRS calculation logic
    const age = parseInt(formData.age);
    if (age >= 20 && age <= 29) s += 110;
    else if (age >= 30 && age <= 35) s += 95;
    else s += 70;

    if (formData.education === 'Master') s += 135;
    else if (formData.education === 'Bachelor') s += 120;
    else s += 90;

    s += parseInt(formData.experience) * 15;
    if (formData.language === 'CLB 9') s += 50;
    if (formData.jobOffer === 'Yes') s += 50;

    setScore(s + 300); // Base score
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{tc('Express Entry CRS Calculator')}</h1>
        <p className="text-slate-500">{tc('Estimate your Comprehensive Ranking System (CRS) score for Canadian immigration.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Age')}</label>
            <input
              type="number"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="e.g. 28"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Education Level')}</label>
            <select
              value={formData.education}
              onChange={e => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="High School">{tc('High School')}</option>
              <option value="Bachelor">{tc('Bachelor')}</option>
              <option value="Master">{tc('Master')}</option>
              <option value="PhD">{tc('PhD')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Work Experience (Years)')}</label>
            <input
              type="number"
              value={formData.experience}
              onChange={e => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Language Proficiency (English/French)')}</label>
            <select
              value={formData.language}
              onChange={e => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option>CLB 7</option>
              <option>CLB 8</option>
              <option>CLB 9</option>
              <option>CLB 10+</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tc('Valid Job Offer in Canada?')}</label>
            <select
              value={formData.jobOffer}
              onChange={e => setFormData({ ...formData, jobOffer: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
            >
              <option value="No">{tc('No')}</option>
              <option value="Yes">{tc('Yes')}</option>
            </select>
          </div>
          <button
            onClick={calculate}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center space-x-2"
          >
            <Calculator size={20} />
            <span>{tc('Calculate My Score')}</span>
          </button>
        </div>

        <div className="space-y-8">
          {score !== null ? (
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-30"></div>
              <h2 className="text-xl font-bold mb-8 relative z-10 uppercase tracking-widest text-slate-400">{tc('Your Estimated CRS Score')}</h2>
              <div className="text-8xl font-black text-white mb-8 relative z-10 tracking-tighter">{score}</div>
              <div className="p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/10 relative z-10">
                <div className="flex items-center text-emerald-400 font-bold mb-2">
                  <CheckCircle2 size={18} className="mr-2" />
                  {tc('Good Chance')}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {tc('Based on recent draws, a score of {score} is competitive. We recommend starting your Express Entry profile as soon as possible.').replace('{score}', score.toString())}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-10 rounded-[40px] border border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Calculator size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">{tc('Ready to Calculate?')}</h3>
              <p className="text-slate-400 text-sm">{tc('Fill out the form to see your estimated immigration score.')}</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-3xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="text-orange-500" />
              <h3 className="font-bold text-slate-900">{tc('Disclaimer')}</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {tc('This calculator provides an estimate only and does not guarantee immigration success. Official CRS scores are determined by IRCC at the time of application.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
