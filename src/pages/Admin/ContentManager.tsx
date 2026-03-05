import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import AIImageGenerator from '../../components/AIImageGenerator';
import ImageUpload from '../../components/ImageUpload';
import { Plus, Search, Edit2, Trash2, ChevronLeft, Save, X, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ContentManager() {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const collectionName = type || 'articles';

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...currentItem,
        updatedAt: new Date().toISOString(),
        createdAt: currentItem.createdAt || new Date().toISOString(),
      };

      if (currentItem.id) {
        const { id, ...rest } = data;
        await updateDoc(doc(db, collectionName, id), rest);
      } else {
        await addDoc(collection(db, collectionName), data);
      }
      setIsEditing(false);
      setCurrentItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setIsEditing(false)} className="flex items-center text-slate-500 hover:text-slate-900">
            <ChevronLeft size={20} className="mr-1" /> Back to List
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentItem?.id ? 'Edit' : 'New'} {collectionName.replace('_', ' ').slice(0, -1)}
          </h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
              <input
                type="text"
                required
                value={currentItem?.title || ''}
                onChange={e => setCurrentItem({ ...currentItem, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug</label>
              <input
                type="text"
                required
                value={currentItem?.slug || ''}
                onChange={e => setCurrentItem({ ...currentItem, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none bg-slate-50"
              />
            </div>
          </div>

          {collectionName === 'immigration_programs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Icon Name (Lucide)</label>
                  <select
                    value={currentItem?.iconName || 'Shield'}
                    onChange={e => setCurrentItem({ ...currentItem, iconName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                  >
                    <option value="Shield">Shield</option>
                    <option value="Map">Map</option>
                    <option value="Ship">Ship</option>
                    <option value="HeartHandshake">HeartHandshake</option>
                    <option value="Globe">Globe</option>
                    <option value="Users">Users</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color Class</label>
                  <input
                    type="text"
                    placeholder="text-blue-600"
                    value={currentItem?.color || ''}
                    onChange={e => setCurrentItem({ ...currentItem, color: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea
                  value={currentItem?.description || ''}
                  onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Features (One per line)</label>
                <textarea
                  value={currentItem?.features?.join('\n') || ''}
                  onChange={e => setCurrentItem({ ...currentItem, features: e.target.value.split('\n').filter(f => f.trim() !== '') })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-32 font-mono text-sm"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>
            </div>
          )}

          {collectionName === 'articles' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Excerpt</label>
                <textarea
                  value={currentItem?.excerpt || ''}
                  onChange={e => setCurrentItem({ ...currentItem, excerpt: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content (Markdown)</label>
                <textarea
                  required
                  value={currentItem?.content || ''}
                  onChange={e => setCurrentItem({ ...currentItem, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none h-64 font-mono text-sm"
                />
              </div>
            </>
          )}

          {collectionName === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</label>
                <input
                  type="text"
                  value={currentItem?.company || ''}
                  onChange={e => setCurrentItem({ ...currentItem, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Province</label>
                <input
                  type="text"
                  value={currentItem?.province || ''}
                  onChange={e => setCurrentItem({ ...currentItem, province: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Featured Image URL</label>
                <input
                  type="text"
                  value={currentItem?.image || ''}
                  onChange={e => setCurrentItem({ ...currentItem, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="https://..."
                />
              </div>
              <AIImageGenerator 
                onImageGenerated={(url) => setCurrentItem({ ...currentItem, image: url })} 
                defaultPrompt={currentItem?.title}
              />
            </div>

            <ImageUpload 
              label="Upload from Device"
              currentImage={currentItem?.image}
              onUpload={(base64) => setCurrentItem({ ...currentItem, image: base64 })}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">{collectionName.replace('_', ' ')}</h1>
          <p className="text-slate-500 text-sm">Manage your site content and resources.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none w-64"
            />
          </div>
          <button
            onClick={() => { setCurrentItem({}); setIsEditing(true); }}
            className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-red-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={20} />}
                    </div>
                    <span className="font-bold text-slate-900">{item.title || item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.published !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {item.published !== false ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => { setCurrentItem(item); setIsEditing(true); }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400">
            No items found. Start by adding some content!
          </div>
        )}
        {loading && (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
