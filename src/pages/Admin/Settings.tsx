import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Shield, Globe, Layout, Smartphone, FileCode, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    siteName: 'Canada Visa Guide',
    siteDescription: 'Professional Immigration Portal',
    adsenseHeader: '',
    adsenseSidebar: '',
    adsenseInArticle: '',
    adsenseFooter: '',
    adsenseMobile: '',
    adsTxt: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-500">Manage AdSense, SEO, and global configuration.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">General Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Description</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
          </div>
          <div className="mt-8">
            <ImageUpload 
              label="Site Logo"
              currentImage={settings.logoUrl}
              onUpload={(base64) => setSettings({ ...settings, logoUrl: base64 })}
            />
          </div>
        </div>

        {/* AdSense Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Layout className="text-orange-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">AdSense Placements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Shield size={16} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Header Ad Code</label>
              </div>
              <textarea
                value={settings.adsenseHeader}
                onChange={e => setSettings({ ...settings, adsenseHeader: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-32 font-mono text-xs"
                placeholder="Paste your AdSense code here..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Layout size={16} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sidebar Ad Code</label>
              </div>
              <textarea
                value={settings.adsenseSidebar}
                onChange={e => setSettings({ ...settings, adsenseSidebar: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-32 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <FileCode size={16} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">In-Article Ad Code</label>
              </div>
              <textarea
                value={settings.adsenseInArticle}
                onChange={e => setSettings({ ...settings, adsenseInArticle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-32 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone size={16} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Ad Code</label>
              </div>
              <textarea
                value={settings.adsenseMobile}
                onChange={e => setSettings({ ...settings, adsenseMobile: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-32 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Ads.txt Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileCode className="text-emerald-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Ads.txt Management</h2>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ads.txt Content</label>
            <textarea
              value={settings.adsTxt}
              onChange={e => setSettings({ ...settings, adsTxt: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-48 font-mono text-sm"
              placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
            />
            <p className="text-[10px] text-slate-400 mt-2 italic">This content will be automatically served at /ads.txt</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-12 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-xl flex items-center space-x-2"
          >
            <Save size={20} />
            <span>{saving ? 'Saving Settings...' : 'Save Site Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
