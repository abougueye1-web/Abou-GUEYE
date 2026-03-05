import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AIContentSeeder() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10));

  const generateContent = async (type: 'article' | 'visa' | 'job' | 'study', count: number) => {
    setLoading(true);
    setProgress({ current: 0, total: count, status: `Generating ${type}s...` });
    
    const prompt = `Generate ${count} high-quality, SEO-optimized ${type}s for a Canadian immigration portal. 
    Return the data as a JSON array of objects. 
    For articles: {title, slug, content (800+ words markdown), excerpt, category, tags (array), author, published: true}
    For visas: {title, slug, type (Work/Student/PR/etc), requirements, process, documents, processingTime, tips}
    For jobs: {title, company, location, province, industry, salaryMin, salaryMax, description, applicationLink, featured: true}
    For study: {title, institution, type (University/Scholarship/Training), cost, duration, description, link}
    
    Ensure the content is professional, accurate for 2026, and informative.`;

    try {
      addLog(`Requesting ${count} ${type}s from Gemini...`);
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || '[]');
      addLog(`Received ${data.length} items. Saving to Firestore...`);

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        await addDoc(collection(db, type === 'article' ? 'articles' : type === 'visa' ? 'visa_guides' : type === 'job' ? 'jobs' : 'study_programs'), {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setProgress(prev => ({ ...prev, current: i + 1 }));
      }
      addLog(`Successfully seeded ${data.length} ${type}s.`);
    } catch (error) {
      console.error('Seeding error:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const runFullSeeder = async () => {
    if (!window.confirm('This will generate a large amount of content. Continue?')) return;
    
    // We'll do it in chunks to avoid timeouts
    await generateContent('article', 10);
    await generateContent('visa', 10);
    await generateContent('job', 10);
    await generateContent('study', 5);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="text-indigo-600" size={24} />
        <h2 className="text-xl font-bold text-slate-900">AI Content Seeder</h2>
      </div>
      
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        Automatically populate your portal with high-quality, SEO-optimized content using Gemini. This tool generates articles, visa guides, job listings, and study programs.
      </p>

      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-indigo-600 animate-pulse">{progress.status}</span>
            <span className="text-slate-400">{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] font-mono text-slate-500 flex items-center">
                <span className="mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => generateContent('article', 5)}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-600 hover:bg-white transition-all text-left group"
          >
            <div className="font-bold text-slate-900 group-hover:text-indigo-600">Generate Articles</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">SEO Optimized Blog Posts</div>
          </button>
          <button
            onClick={() => generateContent('visa', 5)}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-600 hover:bg-white transition-all text-left group"
          >
            <div className="font-bold text-slate-900 group-hover:text-red-600">Generate Visa Guides</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Step-by-step Instructions</div>
          </button>
          <button
            onClick={runFullSeeder}
            className="sm:col-span-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <Sparkles size={20} />
            <span>Run Full Site Seeder</span>
          </button>
        </div>
      )}
    </div>
  );
}
