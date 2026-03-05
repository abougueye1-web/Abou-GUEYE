import { Home, Heart, Shield, Bus, Coffee, DollarSign } from 'lucide-react';

export default function LifeGuide() {
  const sections = [
    {
      title: 'Cost of Living',
      icon: <DollarSign className="text-emerald-600" />,
      content: 'Canada offers a high quality of life, but costs vary significantly between cities. Toronto and Vancouver are the most expensive, while cities in the Prairies and Atlantic Canada are more affordable.',
      stats: [
        { label: 'Avg. Rent (1BR)', value: '$1,500 - $2,500' },
        { label: 'Monthly Groceries', value: '$300 - $500' },
        { label: 'Utilities', value: '$150 - $250' }
      ]
    },
    {
      title: 'Housing',
      icon: <Home className="text-blue-600" />,
      content: 'Finding a place to live is a priority. Most newcomers start by renting. You will typically need a security deposit (half or full month rent) and proof of income or savings.',
      stats: [
        { label: 'Rental Types', value: 'Condos, Basements, Houses' },
        { label: 'Lease Term', value: 'Usually 1 Year' }
      ]
    },
    {
      title: 'Healthcare',
      icon: <Heart className="text-red-600" />,
      content: 'Canada has a publicly funded healthcare system. Most residents do not pay for primary healthcare services. Newcomers should apply for a health card as soon as they arrive.',
      stats: [
        { label: 'System Name', value: 'Medicare' },
        { label: 'Wait Period', value: '0 - 3 Months' }
      ]
    },
    {
      title: 'Transportation',
      icon: <Bus className="text-orange-600" />,
      content: 'Major cities have excellent public transit (TTC in Toronto, STM in Montreal). In smaller towns, a car is often necessary. Canada has a vast network of highways and regional trains.',
      stats: [
        { label: 'Monthly Pass', value: '$100 - $160' },
        { label: 'Gas Price', value: '$1.40 - $1.80 / L' }
      ]
    }
  ];

  return (
    <div className="bg-white pb-24">
      {/* Hero */}
      <section className="bg-red-600 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Life in Canada Guide</h1>
          <p className="text-red-100 text-lg max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about settling in Canada. From finding a home to understanding the healthcare system and managing your budget.
          </p>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <p className="text-slate-600 mb-10 leading-relaxed">
                  {section.content}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.stats.map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-sm font-bold text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[50px] overflow-hidden shadow-2xl border border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 md:p-20">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-8">
                  <Coffee size={24} />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">Canadian Culture & Values</h2>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  Canada is known for its multiculturalism, diversity, and inclusive values. Respect, equality, and peace are at the core of Canadian society. Newcomers are encouraged to maintain their cultural heritage while participating in the broader Canadian community.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Languages</h4>
                    <p className="text-sm text-slate-500">English and French are the official languages.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Social Etiquette</h4>
                    <p className="text-sm text-slate-500">Punctuality and politeness are highly valued.</p>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[400px]">
                <img src="https://picsum.photos/seed/canada-culture/800/1000" alt="Culture" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
