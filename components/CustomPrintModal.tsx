import React, { useState, useEffect } from 'react';

interface CustomPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string | null;
}

const CustomPrintModal: React.FC<CustomPrintModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'config'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Configs
  const [material, setMaterial] = useState('PLA');
  const [infill, setInfill] = useState('20');
  const [color, setColor] = useState('Cinza');
  const [scale, setScale] = useState(100);
  
  // Estimate
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (isOpen) {
        setStep('upload');
        setFile(null);
        setProgress(0);
        setPrice(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let basePrice = 30; // Preço base
    
    if (material === 'PETG') basePrice *= 1.2;
    if (material === 'Resina') basePrice *= 2.5;
    if (material === 'TPU') basePrice *= 1.5;

    if (material !== 'Resina') {
        basePrice *= (1 + (parseInt(infill) / 200)); 
    }

    basePrice *= (scale / 100);

    setPrice(basePrice);
  }, [material, infill, scale]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) startScanning(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) startScanning(selectedFile);
  };

  const startScanning = (f: File) => {
    setFile(f);
    setStep('scanning');
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => setStep('config'), 500);
                return 100;
            }
            return prev + 5;
        });
    }, 100);
  };

  const handleSendRequest = () => {
    const message = 
      `Olá TechyPrint! Gostaria de um orçamento personalizado:\n` +
      `👤 *Cliente:* ${currentUser || 'Visitante'}\n` +
      `📂 *Arquivo:* ${file?.name}\n` +
      `⚖️ *Peso Est:* ${(scale * 0.8).toFixed(0)}g (Simulado)\n` +
      `--------------------------------\n` +
      `⚙️ *Configuração:*\n` +
      `• Material: ${material}\n` +
      `• Cor: ${color}\n` +
      `• Preenchimento: ${infill}%\n` +
      `• Escala: ${scale}%\n` +
      `--------------------------------\n` +
      `💰 *Estimativa do Site:* R$ ${price.toFixed(2).replace('.', ',')}\n` +
      `Aguardo análise técnica.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5563992211113";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row h-[600px] max-h-[90vh] border border-white/10">
        
        {/* Left Side: Visualizer / Dropzone */}
        <div className="w-full md:w-1/2 bg-slate-950 border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col items-center justify-center text-center">
            
            {step === 'upload' && (
                <div 
                    className="w-full h-full border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center transition-all hover:border-brand-500 hover:bg-brand-500/5 cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('stl-upload')?.click()}
                >
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-white/5">
                        <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Upload de Arquivo 3D</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-xs">Arraste seu arquivo .STL ou .OBJ</p>
                    <span className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        Selecionar Arquivo
                    </span>
                    <input type="file" id="stl-upload" className="hidden" accept=".stl,.obj" onChange={handleFileSelect} />
                </div>
            )}

            {step === 'scanning' && (
                <div className="w-full max-w-xs text-center">
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                         <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">Analisando Geometria...</h3>
                    <p className="text-xs text-slate-500 mb-4 truncate">{file?.name}</p>
                    
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {step === 'config' && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Modelo Verificado</h3>
                    <p className="text-sm text-slate-400 mt-2">Pronto para configuração</p>
                    <button 
                        onClick={() => setStep('upload')}
                        className="mt-4 text-sm text-brand-400 font-medium hover:underline"
                    >
                        Trocar Arquivo
                    </button>
                </div>
            )}
        </div>

        {/* Right Side: Configuration Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col bg-slate-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Laboratório 3D</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className={`flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 transition-opacity duration-500 ${step !== 'config' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['PLA', 'PETG', 'Resina', 'TPU'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMaterial(m)}
                                className={`py-3 px-2 rounded-lg border text-sm font-medium transition-all ${
                                    material === m 
                                    ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cor</label>
                    <select 
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    >
                        <option>Preto Matte</option>
                        <option>Branco Neve</option>
                        <option>Cinza</option>
                        <option>Laranja</option>
                        <option>Azul Translúcido</option>
                    </select>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400 font-medium">Preenchimento</span>
                            <span className="text-brand-400 font-bold">{infill}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            step="5"
                            value={infill} 
                            onChange={(e) => setInfill(e.target.value)}
                            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-brand-500"
                            disabled={material === 'Resina'}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-400 font-medium">Escala</span>
                            <span className="text-brand-400 font-bold">{scale}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="200" 
                            step="10"
                            value={scale} 
                            onChange={(e) => setScale(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-brand-500"
                        />
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-300 leading-relaxed">
                        Valor estimado. O preço final será confirmado por um técnico após análise detalhada do arquivo.
                    </p>
                </div>
            </div>

            <div className={`mt-6 pt-6 border-t border-white/5 transition-opacity duration-500 ${step !== 'config' ? 'opacity-30' : 'opacity-100'}`}>
                <div className="flex justify-between items-end mb-4">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estimativa</span>
                    <span className="text-3xl font-bold text-white">
                        R$ {price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <button
                    onClick={handleSendRequest}
                    disabled={step !== 'config'}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all active:scale-95 disabled:cursor-not-allowed"
                >
                    Solicitar Orçamento
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CustomPrintModal;