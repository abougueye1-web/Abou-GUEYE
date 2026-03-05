import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Globe, Briefcase, GraduationCap, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useTranslation } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import Translate from '../components/Translate';

export default function Home() {
  const { t, language } = useTranslation();

  const features = [
    { icon: <Globe className="text-blue-600" />, title: 'Visa Guides', desc: 'Step-by-step instructions for all visa types.' },
    { icon: <Briefcase className="text-red-600" />, title: 'Job Portal', desc: 'Find your dream job in any Canadian province.' },
    { icon: <GraduationCap className="text-emerald-600" />, title: 'Study in Canada', desc: 'Top universities and scholarship opportunities.' },
    { icon: <TrendingUp className="text-orange-600" />, title: 'Express Entry', desc: 'Fast-track your permanent residency application.' },
  ];

  return (
    <div className="overflow-hidden">
      <SEO 
        title="Your Ultimate Guide to Canadian Immigration" 
        description="Comprehensive information on Canada visas, jobs, study permits, and immigration programs. Start your journey to Canada today."
      />
      
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span><Translate>2026 Immigration Updates</Translate></span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                <Translate>Your Journey to Canada Starts Here.</Translate>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                <Translate>The most comprehensive guide for immigration, work permits, study visas, and permanent residency in Canada. Accurate, up-to-date, and professional.</Translate>
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/visas"
                  className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 flex items-center justify-center group"
                >
                  <Translate>Start Your Application</Translate>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/eligibility"
                  className="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center"
                >
                  <Translate>Check Eligibility</Translate>
                </Link>
              </div>
              <div className="mt-10 flex items-center space-x-6 text-sm text-slate-500 font-medium">
                <div className="flex items-center"><CheckCircle2 size={16} className="text-emerald-500 mr-2" /> <Translate>Verified Info</Translate></div>
                <div className="flex items-center"><CheckCircle2 size={16} className="text-emerald-500 mr-2" /> <Translate>Daily Updates</Translate></div>
                <div className="flex items-center"><CheckCircle2 size={16} className="text-emerald-500 mr-2" /> <Translate>Expert Advice</Translate></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                  alt="Diverse group of successful people"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">485,000+</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider"><Translate>New PRs in 2026</Translate></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"><Translate>Everything You Need to Succeed</Translate></h2>
            <p className="text-slate-600 max-w-2xl mx-auto"><Translate>Explore our specialized sections designed to guide you through every step of your Canadian immigration journey.</Translate></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3"><Translate>{feature.title}</Translate></h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6"><Translate>{feature.desc}</Translate></p>
                <Link to={feature.title.toLowerCase().includes('visa') ? '/visas' : '/'} className="text-red-600 font-bold text-sm flex items-center group">
                  <Translate>Learn More</Translate> <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2"><Translate>Latest Immigration News</Translate></h2>
              <p className="text-slate-500"><Translate>Stay updated with the latest policy changes and updates.</Translate></p>
            </div>
            <Link to="/blog" className="text-red-600 font-bold hover:underline hidden sm:block"><Translate>View All News</Translate></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[16/10]">
                  <img
                    src={`https://picsum.photos/seed/news-${i}/600/400`}
                    alt="News"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Translate>Policy Update</Translate>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                  <Translate>New Express Entry Draw: 5,000 Invitations Issued for STEM Occupations</Translate>
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  <Translate>The latest draw from the Express Entry pool has focused on candidates with experience in science, technology, engineering, and mathematics...</Translate>
                </p>
                <div className="flex items-center text-xs text-slate-400 font-medium">
                  <span><Translate>March 4, 2026</Translate></span>
                  <span className="mx-2">•</span>
                  <span><Translate>5 min read</Translate></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight"><Translate>Ready to start your new life in Canada?</Translate></h2>
          <p className="text-red-100 text-lg mb-12 max-w-2xl mx-auto"><Translate>Join thousands of successful immigrants who used our guides to navigate the complex Canadian immigration system.</Translate></p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login" className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl">
              <Translate>Create Free Account</Translate>
            </Link>
            <Link to="/contact" className="bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-800 transition-all border border-red-500">
              <Translate>Talk to an Advisor</Translate>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
