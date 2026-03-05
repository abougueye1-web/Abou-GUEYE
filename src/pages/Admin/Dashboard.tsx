import AIContentSeeder from '../../components/AIContentSeeder';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Settings as SettingsIcon, 
  Users, 
  Mail, 
  Plus,
  TrendingUp,
  Eye,
  Globe,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Articles', value: '24', icon: <FileText className="text-blue-600" />, change: '+3 this week' },
    { label: 'Job Listings', value: '156', icon: <Briefcase className="text-red-600" />, change: '+12 today' },
    { label: 'Subscribers', value: '1,284', icon: <Mail className="text-emerald-600" />, change: '+42 this month' },
    { label: 'Page Views', value: '45.2K', icon: <Eye className="text-orange-600" />, change: '+15% vs last month' },
  ];

  const quickActions = [
    { label: 'New Article', href: '/admin/content/articles', icon: <Plus size={18} />, color: 'bg-blue-600' },
    { label: 'Add Job', href: '/admin/content/jobs', icon: <Plus size={18} />, color: 'bg-red-600' },
    { label: 'Add Program', href: '/admin/content/immigration_programs', icon: <Plus size={18} />, color: 'bg-indigo-600' },
    { label: 'Visa Guide', href: '/admin/content/visa_guides', icon: <Plus size={18} />, color: 'bg-emerald-600' },
    { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon size={18} />, color: 'bg-slate-600' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 bg-red-600 text-white rounded-xl font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/content/articles" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <FileText size={20} />
            <span>Articles</span>
          </Link>
          <Link to="/admin/content/visa_guides" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <ShieldCheckIcon size={20} />
            <span>Visa Guides</span>
          </Link>
          <Link to="/admin/content/jobs" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <Briefcase size={20} />
            <span>Jobs</span>
          </Link>
          <Link to="/admin/content/study_programs" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <GraduationCap size={20} />
            <span>Study Programs</span>
          </Link>
          <Link to="/admin/content/immigration_programs" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <Globe size={20} />
            <span>Immigration Programs</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm">Welcome back, Admin.</p>
          </div>
          <div className="flex space-x-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className={`${action.color} text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg hover:opacity-90 transition-opacity`}
              >
                {action.icon}
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-900">Recent Articles</h2>
                <Link to="/admin/content/articles" className="text-xs font-bold text-red-600 hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/art-${i}/40/40`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">How to apply for a Post-Graduation Work Permit (PGWP)</div>
                        <div className="text-xs text-slate-400">Published 2 hours ago • By Admin</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><FileText size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><TrendingUp size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AIContentSeeder />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-6">Quick AI Content Generator</h2>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Use Gemini to automatically generate high-quality, SEO-optimized articles for your portal.
              </p>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                <TrendingUp size={18} />
                <span>Generate New Content</span>
              </button>
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Site Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">SEO Score</span>
                    <span className="font-bold text-emerald-600">98/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">AdSense Status</span>
                    <span className="font-bold text-blue-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
