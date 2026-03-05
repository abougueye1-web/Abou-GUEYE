import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ShieldCheck, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { auth, logout, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation, Language } from '../contexts/LanguageContext';
import Translate from './Translate';

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { language, setLanguage, t } = useTranslation();
  const langRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const languages: { code: Language; name: string }[] = [
    { code: 'EN', name: 'English' },
    { code: 'FR', name: 'Français' },
    { code: 'AR', name: 'العربية' },
    { code: 'ES', name: 'Español' },
    { code: 'IT', name: 'Italiano' },
    { code: 'DE', name: 'Deutsch' },
  ];

  const selectedLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Visas', href: '/visas' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Study', href: '/study' },
    { name: 'Eligibility', href: '/eligibility' },
    { name: 'Programs', href: '/programs' },
    { name: 'Life Guide', href: '/life-guide' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Canada<span className="text-red-600">Visa</span>Guide
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                <Translate>{link.name}</Translate>
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <ShieldCheck size={16} />
                <span><Translate>Admin</Translate></span>
              </Link>
            )}

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              >
                <Globe size={16} />
                <span>{selectedLang.code}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                        language === lang.code ? 'text-red-600 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {auth.currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-red-600"
              >
                <LogOut size={16} />
                <span><Translate>Logout</Translate></span>
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <Translate>Sign In</Translate>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50"
              >
                <Translate>{link.name}</Translate>
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <Translate>Admin Dashboard</Translate>
              </Link>
            )}

            {/* Mobile Language Selector */}
            <div className="border-t border-slate-100 pt-2 mt-2">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1"><Translate>Language</Translate></p>
              <div className="grid grid-cols-2 gap-1 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                      language === lang.code 
                        ? 'bg-red-50 text-red-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {auth.currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50"
              >
                <Translate>Logout</Translate>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <Translate>Sign In</Translate>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
