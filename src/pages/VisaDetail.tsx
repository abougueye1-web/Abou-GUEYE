import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { VisaGuide } from '../types';
import { CheckCircle2, Clock, FileText, Lightbulb, ArrowRight, ChevronLeft } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';

export default function VisaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<VisaGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'visa_guides'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setGuide({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as VisaGuide);
        }
      } catch (error) {
        console.error('Error fetching guide:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!guide) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Guide Not Found</h1>
      <Link to="/visas" className="text-red-600 font-bold hover:underline">Back to Visa Guides</Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/visas" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-red-600 mb-8 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> All Visa Guides
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {guide.type} Visa Category
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                {guide.title}
              </h1>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center text-slate-600 font-medium">
                  <Clock size={20} className="mr-2 text-red-600" />
                  <span>Processing: <span className="text-slate-900 font-bold">{guide.processingTime}</span></span>
                </div>
                <div className="flex items-center text-slate-600 font-medium">
                  <CheckCircle2 size={20} className="mr-2 text-red-600" />
                  <span>Approval Rate: <span className="text-slate-900 font-bold">High</span></span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img src={guide.image || `https://picsum.photos/seed/${guide.slug}/800/600`} alt={guide.title} className="w-full h-auto" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <FileText className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Requirements</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {guide.requirements}
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <ArrowRight className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Application Process</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {guide.process}
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <CheckCircle2 className="text-red-600" size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Documents Needed</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {guide.documents}
              </div>
            </div>

            <AdPlacement type="inArticle" />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-red-600 p-8 rounded-3xl text-white shadow-xl shadow-red-100">
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb size={24} />
                <h3 className="text-xl font-bold">Expert Tips</h3>
              </div>
              <div className="text-red-500 text-sm leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl">
                {guide.tips}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Need Assistance?</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Our immigration experts can help you prepare your documents and increase your chances of approval.</p>
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg">
                Book Consultation
              </button>
            </div>

            <AdPlacement type="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
