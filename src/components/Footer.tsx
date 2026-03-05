import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Translate from './Translate';

export default function Footer() {
  const { t, language } = useTranslation();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setLogoUrl(docSnap.data().logoUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain brightness-0 invert" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    Canada<span className="text-red-600">Visa</span>Guide
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              <Translate>Your trusted partner for Canadian immigration. We provide accurate, up-to-date information to help you achieve your dream of living in Canada.</Translate>
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6"><Translate>Quick Links</Translate></h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/visas" className="hover:text-red-500 transition-colors"><Translate>Visa Guides</Translate></Link></li>
              <li><Link to="/jobs" className="hover:text-red-500 transition-colors"><Translate>Job Portal</Translate></Link></li>
              <li><Link to="/study" className="hover:text-red-500 transition-colors"><Translate>Study in Canada</Translate></Link></li>
              <li><Link to="/programs" className="hover:text-red-500 transition-colors"><Translate>Immigration Programs</Translate></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6"><Translate>Resources</Translate></h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/blog" className="hover:text-red-500 transition-colors"><Translate>Latest News</Translate></Link></li>
              <li><Link to="/life-guide" className="hover:text-red-500 transition-colors"><Translate>Cost of Living</Translate></Link></li>
              <li><Link to="/eligibility" className="hover:text-red-500 transition-colors"><Translate>Eligibility Calculator</Translate></Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors"><Translate>Contact Us</Translate></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6"><Translate>Newsletter</Translate></h3>
            <p className="text-sm text-slate-400 mb-4"><Translate>Get the latest immigration updates delivered to your inbox.</Translate></p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-red-600"
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                <Translate>Join</Translate>
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <Facebook size={20} className="hover:text-white cursor-pointer" />
              <Twitter size={20} className="hover:text-white cursor-pointer" />
              <Instagram size={20} className="hover:text-white cursor-pointer" />
              <Linkedin size={20} className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p><Translate>© 2026 Canada Visa Guide. All rights reserved.</Translate></p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-slate-300"><Translate>Privacy Policy</Translate></Link>
            <Link to="/terms" className="hover:text-slate-300"><Translate>Terms of Service</Translate></Link>
            <Link to="/cookies" className="hover:text-slate-300"><Translate>Cookie Policy</Translate></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
