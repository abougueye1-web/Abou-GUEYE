import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Article } from '../types';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, Share2, ChevronLeft, Clock } from 'lucide-react';
import AdPlacement from '../components/AdPlacement';
import SEO from '../components/SEO';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Article;
          setArticle(data);
          
          // Fetch related
          const relatedQ = query(
            collection(db, 'articles'), 
            where('category', '==', data.category), 
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQ);
          setRelated(relatedSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Article))
            .filter(a => a.id !== data.id)
          );
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-500 mb-8">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="text-red-600 font-bold hover:underline flex items-center justify-center">
          <ChevronLeft size={20} className="mr-1" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO 
        title={article.title} 
        description={article.excerpt} 
        image={article.image}
        type="article"
      />
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={article.image || `https://picsum.photos/seed/${article.slug}/1920/1080`}
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              {article.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center text-slate-300 text-sm gap-6">
              <div className="flex items-center"><User size={18} className="mr-2 text-red-500" /> {article.author}</div>
              <div className="flex items-center"><Calendar size={18} className="mr-2 text-red-500" /> {new Date(article.createdAt).toLocaleDateString()}</div>
              <div className="flex items-center"><Clock size={18} className="mr-2 text-red-500" /> 6 min read</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Article Content */}
          <div className="lg:col-span-8">
            <AdPlacement type="header" />
            
            <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-red-600 prose-img:rounded-3xl shadow-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            <AdPlacement type="inArticle" />

            {/* Tags & Share */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap gap-2">
                {article.tags?.map(tag => (
                  <span key={tag} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-slate-400">Share:</span>
                <button className="p-2 bg-slate-50 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"><Share2 size={18} /></button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Related Articles</h3>
              <div className="space-y-6">
                {related.map(item => (
                  <Link key={item.id} to={`/blog/${item.slug}`} className="flex space-x-4 group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image || `https://picsum.photos/seed/${item.slug}/100/100`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
                {related.length === 0 && <p className="text-sm text-slate-400 italic">No related articles found.</p>}
              </div>
            </div>

            <AdPlacement type="sidebar" />

            <div className="sticky top-24">
              <div className="bg-slate-900 p-8 rounded-3xl text-white overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Immigration Help?</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">Get expert advice on your Canadian visa application today.</p>
                <Link to="/contact" className="block w-full py-3 bg-red-600 text-white text-center rounded-xl font-bold hover:bg-red-700 transition-all relative z-10 shadow-lg">
                  Contact Advisor
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
