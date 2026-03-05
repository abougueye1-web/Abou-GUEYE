import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Layout & Components
import Layout from './components/Layout';
import Home from './pages/Home';
import VisaGuides from './pages/VisaGuides';
import VisaDetail from './pages/VisaDetail';
import Jobs from './pages/Jobs';
import Study from './pages/Study';
import Programs from './pages/Programs';
import LifeGuide from './pages/LifeGuide';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import EligibilityCalculator from './pages/EligibilityCalculator';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Admin
import AdminDashboard from './pages/Admin/Dashboard';
import ContentManager from './pages/Admin/ContentManager';
import AdminSettings from './pages/Admin/Settings';
import Login from './pages/Login';

import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check admin status
        const adminDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setIsAdmin(adminDoc.exists() && adminDoc.data().role === 'admin' || currentUser.email === 'abou.gueye1@unchk.edu.sn');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Layout isAdmin={isAdmin}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visas" element={<VisaGuides />} />
            <Route path="/visas/:slug" element={<VisaDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/study" element={<Study />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/life-guide" element={<LifeGuide />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<ArticleDetail />} />
            <Route path="/eligibility" element={<EligibilityCalculator />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            {isAdmin && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/content/:type" element={<ContentManager />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </>
            )}
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}
