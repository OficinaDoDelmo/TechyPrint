import React from 'react';
import Logo from './Logo';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const downloadSVG = () => {
    // Para SVG, geralmente prefere-se o fundo transparente por padrão
    const svgElement = document.getElementById('techyprint-download-transparent-svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'techyprint-logo-transparente.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = (transparent: boolean = false) => {
    const elementId = transparent ? 'techyprint-download-transparent-svg' : 'techyprint-download-svg';
    const svgElement = document.getElementById(elementId);
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 4096;
    canvas.height = 2048;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = transparent ? 'techyprint-logo-transparente.png' : 'techyprint-logo-fundo-escuro.png';
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/10 animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6 sm:p-12">
          <div className="flex justify-between items-start mb-8 sm:mb-12 sticky top-0 bg-slate-900/80 backdrop-blur-md z-10 py-2">
            <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase">
                    Brand <span className="text-brand-500">Kit</span>
                </h2>
                <p className="text-slate-500 text-[10px] sm:text-sm mt-1 sm:mt-2 uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold">Identidade Visual Consolidada</p>
            </div>
            <button onClick={onClose} className="p-2 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
            <div className="space-y-6">
                <div className="bg-slate-950 aspect-video rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center border border-white/5 shadow-inner relative group overflow-hidden p-8 text-center">
                   <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors"></div>
                   <Logo size="lg" />
                   <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Design Original</p>
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-brand-600 rounded-lg sm:rounded-xl border border-white/20 shadow-lg"></div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-950 rounded-lg sm:rounded-xl border border-white/20 shadow-lg"></div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">3D Legacy Store Assets</span>
                </div>
            </div>

            <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="space-y-2 mb-2">
                  <h4 className="text-white font-bold text-lg sm:text-xl">Exportação de Ativos</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                    Escolha o formato ideal para seu projeto. Alta fidelidade garantida.
                  </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={downloadSVG}
                    className="group flex items-center justify-between w-full p-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl transition-all shadow-xl shadow-brand-500/10"
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-sm">Baixar SVG</span>
                            <span className="block text-[9px] text-brand-200 uppercase tracking-widest font-bold">Vetor (Transparente)</span>
                        </div>
                    </div>
                    <svg className="w-4 h-4 text-white/50 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>

                  <button 
                    onClick={() => downloadPNG(true)}
                    className="group flex items-center justify-between w-full p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-brand-500/10 rounded-xl text-brand-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-sm">PNG Transparente</span>
                            <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">4K Sem Fundo</span>
                        </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>

                  <button 
                    onClick={() => downloadPNG(false)}
                    className="group flex items-center justify-between w-full p-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-2xl transition-all border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-700/30 rounded-xl text-slate-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-sm opacity-80">PNG Fundo Escuro</span>
                            <span className="block text-[9px] text-slate-600 uppercase tracking-widest font-bold">4K Wallpaper</span>
                        </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
              </div>

              {/* TEMPLATES DE EXPORTAÇÃO */}
              <div className="fixed opacity-0 pointer-events-none -z-50">
                  {/* Template COM fundo */}
                  <svg id="techyprint-download-svg" width="2000" height="1000" viewBox="0 0 2000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="2000" height="1000" fill="#020617"/>
                    <g transform="translate(1000, 500)">
                        <g transform="translate(-450, 0)">
                            <g transform="translate(0, -90)">
                                <rect width="140" height="140" rx="30" fill="#2563eb"/>
                                <g transform="translate(15, 15) scale(4.5)">
                                    <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                            </g>
                            <text x="180" y="25" fill="white" style={{ font: 'bold 150px Inter, sans-serif' }} textAnchor="start">Techy<tspan fill="#60a5fa">Print</tspan></text>
                            <text x="180" y="105" fill="#94a3b8" style={{ font: 'bold 28px Inter, sans-serif' }} textAnchor="start" letterSpacing="12">3D LEGACY STORE</text>
                        </g>
                    </g>
                  </svg>

                  {/* Template SEM fundo (Transparente) */}
                  <svg id="techyprint-download-transparent-svg" width="2000" height="1000" viewBox="0 0 2000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(1000, 500)">
                        <g transform="translate(-450, 0)">
                            <g transform="translate(0, -90)">
                                <rect width="140" height="140" rx="30" fill="#2563eb"/>
                                <g transform="translate(15, 15) scale(4.5)">
                                    <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </g>
                            </g>
                            <text x="180" y="25" fill="#0f172a" style={{ font: 'bold 150px Inter, sans-serif' }} textAnchor="start">Techy<tspan fill="#2563eb">Print</tspan></text>
                            <text x="180" y="105" fill="#475569" style={{ font: 'bold 28px Inter, sans-serif' }} textAnchor="start" letterSpacing="12">3D LEGACY STORE</text>
                        </g>
                    </g>
                  </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandKitModal;