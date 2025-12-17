import React, { useState, useRef } from 'react';

interface HeroProps {
  onOpenChat: () => void;
  heroImage: string;
  onUpdateHeroImage: (url: string) => void;
  isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ onOpenChat, heroImage, onUpdateHeroImage, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToCatalog = () => {
    const section = document.getElementById('catalog');
    if (section) {
      const navbarHeight = 80;
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) onUpdateHeroImage(ev.target.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleUrlSave = () => {
    if (tempUrl.trim()) {
        onUpdateHeroImage(tempUrl);
        setIsEditing(false);
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-transparent">
      
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10">
        
        {/* TEXT SIDE */}
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
                O futuro da 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400"> Manufatura Aditiva</span>
            </h1>
            
            <p className="mt-4 text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Qualidade premium em PLA, PETG e Resina. Do protótipo à peça final, entregamos precisão e durabilidade em um acabamento impecável.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                    onClick={scrollToCatalog}
                    className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all transform hover:-translate-y-1 border border-brand-500"
                >
                    Ver Catálogo
                </button>
                
                <button
                    onClick={onOpenChat}
                    className="px-8 py-4 bg-white/5 text-slate-200 border border-white/10 hover:border-brand-500/50 hover:bg-white/10 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                    Falar com IA
                </button>
            </div>
        </div>

        {/* IMAGE SIDE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-10 lg:mb-0 relative">
            <div className="relative w-full max-w-lg aspect-square bg-slate-900/50 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group backdrop-blur-sm">
                <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    src={heroImage}
                    alt="Impressora 3D"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                {/* Edit Button */}
                {isAdmin && (
                    <div className="absolute top-4 right-4 z-30">
                        <button onClick={() => setIsEditing(!isEditing)} className="bg-black/60 backdrop-blur text-white p-2 rounded-full border border-white/20 hover:bg-brand-500">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        {isEditing && (
                            <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700 p-4 z-50 rounded-lg shadow-xl">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-800 text-sm text-slate-200 py-2 mb-2 rounded hover:bg-slate-700">Upload Local</button>
                                <div className="flex gap-2">
                                    <input type="text" value={tempUrl} onChange={e => setTempUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-sm px-2 rounded text-white" placeholder="URL da imagem..." />
                                    <button onClick={handleUrlSave} className="bg-brand-600 text-sm text-white px-3 font-bold rounded">OK</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;