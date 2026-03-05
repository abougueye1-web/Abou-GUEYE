import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import AdPlacement from '../components/AdPlacement';
import SEO from '../components/SEO';
import { useTranslation } from '../contexts/LanguageContext';

export default function Blog() {
  const { t, translate, language } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [translatedArticles, setTranslatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data.filter(a => a.published !== false));
      setLoading(false);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const translateContent = async () => {
      const staticTexts = [
        'Immigration News & Guides',
        'Stay updated with the latest Canadian immigration news, tips, and professional guides.',
        'Immigration News & Insights',
        'Stay informed with the latest updates on Canadian immigration policies, visa processing times, and success stories.',
        'Popular Categories',
        'Express Entry', 'PNP Updates', 'Student Life', 'Work Permits', 'Success Stories',
        'Get Daily Updates',
        'Join 50,000+ subscribers and never miss an immigration update.',
        'Your email address',
        'Subscribe Now',
        'No articles published yet. Check back soon!',
        'View All News'
      ];

      const results: Record<string, string> = {};
      await Promise.all(staticTexts.map(async (text) => {
        results[text] = await translate(text);
      }));
      setTranslatedTexts(results);

      // Translate dynamic article content
      const translatedData = await Promise.all(articles.map(async (article) => {
        return {
          ...article,
          title: await translate(article.title),
          excerpt: await translate(article.excerpt),
          category: await translate(article.category),
          author: await translate(article.author)
        };
      }));
      setTranslatedArticles(translatedData);
    };

    if (articles.length > 0) {
      translateContent();
    }
  }, [language, articles]);

  const tc = (text: string) => translatedTexts[text] || text;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO 
        title={tc('Immigration News & Guides')} 
        description={tc('Stay updated with the latest Canadian immigration news, tips, and professional guides.')}
      />
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{tc('Immigration News & Insights')}</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            {tc('Stay informed with the latest updates on Canadian immigration policies, visa processing times, and success stories.')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-slate-200 rounded-3xl mb-6"></div>
                    <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                {(translatedArticles.length > 0 ? translatedArticles : articles).map((article) => (
                  <article key={article.id} className="group cursor-pointer">
                    <Link to={`/blog/${article.slug}`}>
                      <div className="aspect-video rounded-3xl overflow-hidden mb-6 relative">
                        <img
                          src={article.image || `https://picsum.photos/seed/${article.slug}/1200/800`}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-red-600 shadow-sm">
                          {tc(article.category)}
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">
                        {article.title}
                      </h2>
                      <p className="text-slate-600 text-lg mb-6 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-slate-400 font-medium">
                        <span>{article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString(language === 'EN' ? 'en-US' : 'fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </Link>
                  </article>
                ))}
                {articles.length === 0 && (
                  <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">{tc('No articles published yet. Check back soon!')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <AdPlacement type="sidebar" />
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{tc('Popular Categories')}</h3>
              <div className="space-y-3">
                {['Express Entry', 'PNP Updates', 'Student Life', 'Work Permits', 'Success Stories'].map(cat => (
                  <Link key={cat} to={`/blog?category=${cat}`} className="flex justify-between items-center text-slate-600 hover:text-red-600 transition-colors group">
                    <span className="font-medium">{tc(cat)}</span>
                    <span className="text-xs bg-slate-50 px-2 py-1 rounded-lg group-hover:bg-red-50 transition-colors">12</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-red-600 p-8 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">{tc('Get Daily Updates')}</h3>
              <p className="text-red-100 text-sm mb-6">{tc('Join 50,000+ subscribers and never miss an immigration update.')}</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder={tc('Your email address')}
                  className="w-full px-4 py-3 rounded-xl bg-red-700 border-none text-white placeholder-red-300 focus:ring-2 focus:ring-white outline-none"
                />
                <button className="w-full py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-slate-100 transition-all">
                  {tc('Subscribe Now')}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
