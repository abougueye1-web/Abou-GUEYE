import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Briefcase, MapPin, Building2, DollarSign, Clock, Search, Filter } from 'lucide-react';
import { Job } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

export default function Jobs() {
  const { t, translate, language } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [translatedJobs, setTranslatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const translateContent = async () => {
      const staticTexts = [
        'Find Your Dream Job in Canada',
        'Explore thousands of job opportunities across all Canadian provinces. Filter by industry, location, and salary.',
        'Job title, company, or keywords...',
        'All', 'Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick',
        'Jobs Found', 'Job Found',
        'Showing all provinces',
        'jobs in',
        'Apply Now',
        'Posted',
        'Featured',
        'No jobs found matching your criteria. Try adjusting your filters.'
      ];

      const results: Record<string, string> = {};
      await Promise.all(staticTexts.map(async (text) => {
        results[text] = await translate(text);
      }));
      setTranslatedTexts(results);

      // Translate dynamic job content
      const translatedData = await Promise.all(jobs.map(async (job) => {
        return {
          ...job,
          title: await translate(job.title),
          company: await translate(job.company),
          industry: await translate(job.industry),
          location: await translate(job.location),
          province: await translate(job.province)
        };
      }));
      setTranslatedJobs(translatedData);
    };

    if (jobs.length > 0) {
      translateContent();
    }
  }, [language, jobs]);

  const tc = (text: string) => translatedTexts[text] || text;

  const provinces = ['All', 'Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick'];

  const filteredJobs = (translatedJobs.length > 0 ? translatedJobs : jobs).filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = provinceFilter === 'All' || job.province === provinceFilter || (translatedTexts[job.province] === provinceFilter);
    return matchesSearch && matchesProvince;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{tc('Find Your Dream Job in Canada')}</h1>
            <p className="text-slate-600 text-lg mb-8">
              {tc('Explore thousands of job opportunities across all Canadian provinces. Filter by industry, location, and salary.')}
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder={tc('Job title, company, or keywords...')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none shadow-sm"
                />
              </div>
              <div className="md:w-64 relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={provinceFilter}
                  onChange={e => setProvinceFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none shadow-sm appearance-none bg-white font-medium"
                >
                  {provinces.map(p => <option key={p} value={p}>{tc(p)}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              {filteredJobs.length} {filteredJobs.length === 1 ? tc('Job Found') : tc('Jobs Found')}
            </h2>
            <div className="text-sm text-slate-500">
              {provinceFilter === 'All' ? tc('Showing all provinces') : `${tc('jobs in')} ${tc(provinceFilter)}`}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse">
                  <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                        <Building2 size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-red-600 transition-colors">{job.title}</h3>
                        <div className="text-slate-600 font-medium mb-4">{job.company}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <div className="flex items-center"><MapPin size={16} className="mr-1.5" /> {job.location}, {job.province}</div>
                          <div className="flex items-center"><Briefcase size={16} className="mr-1.5" /> {job.industry}</div>
                          {job.salaryMin && (
                            <div className="flex items-center text-emerald-600 font-bold">
                              <DollarSign size={16} className="mr-1" /> 
                              ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()} / year
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      {job.featured && (
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
                          {tc('Featured')}
                        </span>
                      )}
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg"
                      >
                        {tc('Apply Now')}
                      </a>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center">
                        <Clock size={12} className="mr-1" /> {tc('Posted')} {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400">{tc('No jobs found matching your criteria. Try adjusting your filters.')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
