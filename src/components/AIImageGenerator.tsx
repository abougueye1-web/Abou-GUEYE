import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Image as ImageIcon, Loader2, Download, Sparkles } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIImageGeneratorProps {
  onImageGenerated: (url: string) => void;
  defaultPrompt?: string;
}

export default function AIImageGenerator({ onImageGenerated, defaultPrompt }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState(defaultPrompt || '');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A professional, high-quality editorial image for a Canadian immigration website. Subject: ${prompt}. Style: Modern, clean, professional photography.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: size
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setGeneratedUrl(imageUrl);
          onImageGenerated(imageUrl);
          break;
        }
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles size={18} className="text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">AI Image Generator</h3>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the image you want (e.g., 'A happy family arriving at Toronto airport')..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none text-sm h-24"
        />

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {(['1K', '2K', '4K'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${size === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
            <span>{loading ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>

        {generatedUrl && (
          <div className="mt-4 relative group rounded-xl overflow-hidden border-4 border-white shadow-lg">
            <img src={generatedUrl} alt="Generated" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => onImageGenerated(generatedUrl)}
                className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-2"
              >
                <Download size={14} />
                <span>Use this Image</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
