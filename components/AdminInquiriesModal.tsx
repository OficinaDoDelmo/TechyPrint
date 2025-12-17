import React, { useEffect, useState } from 'react';
import { ChatInquiry } from '../types';
import { api } from '../services/api';

interface AdminInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminInquiriesModal: React.FC<AdminInquiriesModalProps> = ({ isOpen, onClose }) => {
  const [inquiries, setInquiries] = useState<ChatInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ChatInquiry | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadInquiries();
    }
  }, [isOpen]);

  const loadInquiries = async () => {
    const data = await api.getInquiries();
    setInquiries(data);
  };

  const handleResolve = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.resolveInquiry(id);
    loadInquiries();
    if (selectedInquiry?.id === id) {
        // Opcional: fechar detalhe ou manter aberto
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row h-[90vh] md:h-[80vh] border border-white/10">
        
        {/* Left Side: List 
            Adicionado 'h-full' para garantir que a coluna respeite a altura do pai
        */}
        <div className={`
            flex-col bg-slate-950 border-r border-white/10 md:w-1/3 h-full
            ${selectedInquiry ? 'hidden md:flex' : 'flex w-full'}
        `}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Atendimentos
                </h2>
                <button onClick={onClose} className="md:hidden text-slate-400 p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                {inquiries.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">Nenhum atendimento salvo.</div>
                ) : (
                    inquiries.map(inq => (
                        <div 
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-slate-900 transition-colors ${selectedInquiry?.id === inq.id ? 'bg-slate-900 border-l-2 border-l-purple-500' : ''} ${inq.status === 'resolved' ? 'opacity-60' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">
                                    {inq.customerName || inq.customerEmail.split('@')[0]}
                                </span>
                                <span className="text-[10px] text-slate-500">{inq.createdAt.split(' ')[0]}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 italic">
                                "{inq.summary}"
                            </p>
                            {inq.status === 'open' && (
                                <div className="mt-2 flex justify-end">
                                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">Aberto</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Right Side: Detail 
            Adicionado 'h-full' e 'overflow-hidden' para conter o scroll interno
        */}
        <div className={`
            flex-col bg-slate-900 md:flex-1 h-full overflow-hidden
            ${selectedInquiry ? 'flex w-full' : 'hidden md:flex'}
        `}>
            {selectedInquiry ? (
                <>
                    {/* Detail Header */}
                    <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-start bg-slate-900 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            {/* Back Button (Mobile Only) */}
                            <button 
                                onClick={() => setSelectedInquiry(null)}
                                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Detalhes</h3>
                                <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[200px]">{selectedInquiry.id}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {selectedInquiry.status === 'open' && (
                                <button 
                                    onClick={(e) => handleResolve(selectedInquiry.id, e)}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                                >
                                    Resolver
                                </button>
                            )}
                             <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                        </div>
                    </div>

                    {/* Contact Info Box (Novo) */}
                    <div className="p-4 sm:p-6 pb-0 bg-slate-900 flex-shrink-0">
                        <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cliente</span>
                                <p className="text-sm font-semibold text-white mt-1">
                                    {selectedInquiry.customerName || 'Não informado'}
                                </p>
                                <p className="text-xs text-slate-400">{selectedInquiry.customerEmail}</p>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contato / WhatsApp</span>
                                <p className="text-sm font-semibold text-brand-400 mt-1 flex items-center gap-2">
                                    {selectedInquiry.customerContact ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            {selectedInquiry.customerContact}
                                        </>
                                    ) : 'Não informado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Summary Box 
                        Adicionado max-h e overflow para não ocupar tudo se o resumo for gigante
                    */}
                    <div className="p-4 sm:p-6 bg-slate-900 flex-shrink-0 max-h-[30vh] overflow-y-auto custom-scrollbar">
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Resumo Inteligente (IA)
                            </h4>
                            <p className="text-sm text-slate-200 leading-relaxed">
                                {selectedInquiry.summary}
                            </p>
                        </div>
                    </div>

                    {/* Chat History 
                        Adicionado min-h-0 para flexbox scrolling funcionar corretamente
                    */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/30 min-h-0 custom-scrollbar">
                        <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Histórico Completo</h4>
                        {selectedInquiry.fullHistory.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-slate-800 text-white' 
                                    : 'bg-slate-900 border border-white/10 text-slate-300'
                                }`}>
                                    <p className="text-[10px] opacity-50 mb-1">{msg.role === 'user' ? 'Cliente' : 'Bot'}</p>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-500 relative">
                     <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <p>Selecione um atendimento</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminInquiriesModal;