import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini, initializeChat, summarizeConversation } from '../services/geminiService';
import { api } from '../services/api';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  currentUser?: string | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // States para o formulário de contato (Fallback para usuários não logados)
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        initializeChat();
        setMessages([
          {
            id: 'init',
            role: 'model',
            text: 'Olá! Sou o TechyBot. Como posso ajudar com sua impressão hoje?',
            timestamp: new Date()
          }
        ]);
    } catch (e) {
        console.error("Failed to init chat", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!showContactForm) {
        scrollToBottom();
    }
  }, [messages, isOpen, showContactForm]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMessage.text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
       const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Desculpe, estou com dificuldade de conexão no momento. Tente novamente mais tarde.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função Principal de Salvar
  const handleRequestSave = async () => {
    if (messages.length < 2) return;
    
    // Se o usuário estiver logado, tentamos pegar os dados automaticamente
    if (currentUser) {
        setIsSaving(true);
        try {
            const profile = await api.getUserProfile(currentUser);
            if (profile) {
                // Usuário encontrado, salvar direto!
                await executeSave(profile.name, `${profile.phone} (Cadastrado)`);
                return;
            }
        } catch (e) {
            console.error("Erro ao recuperar perfil", e);
        }
        setIsSaving(false);
    }

    // Se não estiver logado ou não tiver perfil, mostra o form manual
    setShowContactForm(true);
  };

  const executeSave = async (name: string, contact: string) => {
    const summary = await summarizeConversation(messages);
    
    await api.saveInquiry({
        id: `INQ-${Date.now()}`,
        customerEmail: currentUser || 'Visitante',
        customerName: name,
        customerContact: contact,
        summary: summary,
        fullHistory: messages,
        createdAt: new Date().toLocaleString('pt-BR'),
        status: 'open'
    });

    const confirmMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `✅ Obrigado, ${name}! Sua conversa foi salva. Como já temos seus dados, nossa equipe entrará em contato em breve.`,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMsg]);
    setIsSaving(false);
    setShowContactForm(false);
    setContactName('');
    setContactInfo('');
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await executeSave(contactName, contactInfo);
  };

  return (
    <>
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-[60] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] ${
            isOpen 
            ? 'w-12 h-12 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 border border-white/10' 
            : 'w-14 h-14 rounded-full bg-brand-600 text-white hover:bg-brand-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.6)]'
        }`}
      >
        {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-96 sm:max-w-[calc(100vw-2rem)] sm:h-[500px] sm:max-h-[70vh] z-50 flex flex-col animate-slide-up sm:origin-bottom-right bg-slate-900 sm:rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-md">
          
          {/* Header */}
          <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">TechyBot</h3>
                    <p className="text-[10px] text-brand-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse"></span>
                        IA Conectada
                    </p>
                </div>
            </div>
            
            {/* Save Button */}
            {!showContactForm && (
                <button 
                    onClick={handleRequestSave}
                    disabled={isSaving || messages.length < 2}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-2 py-1.5 rounded transition-colors disabled:opacity-50 flex flex-col items-center"
                    title="Salvar conversa para atendimento humano"
                >
                    <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Salvar
                </button>
            )}
          </div>

          {/* Contact Form Overlay (Somente para visitantes ou erro no perfil) */}
          {showContactForm ? (
            <div className="flex-1 p-6 bg-slate-900 flex flex-col justify-center animate-fade-in">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Salvar Atendimento</h4>
                    <p className="text-sm text-slate-400">Visitante: Deixe seus dados para retornarmos.</p>
                </div>

                <form onSubmit={handleManualSave} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Seu Nome</label>
                        <input 
                            type="text" 
                            required
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none mt-1"
                            placeholder="Ex: João Silva"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp / Telefone</label>
                        <input 
                            type="text" 
                            required
                            value={contactInfo}
                            onChange={e => setContactInfo(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand-500 outline-none mt-1"
                            placeholder="Ex: (11) 99999-9999"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => setShowContactForm(false)}
                            className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors font-bold shadow-lg shadow-brand-500/20"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
          ) : (
            <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                    {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                            msg.role === 'user'
                            ? 'bg-brand-600 text-white rounded-br-none shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                            : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none'
                        } ${msg.isError ? 'bg-red-900/50 text-red-200 border-red-800' : ''}`}
                        >
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        </div>
                    </div>
                    )}
                    {isSaving && (
                        <div className="flex justify-center my-2">
                            <span className="text-xs text-brand-400 animate-pulse bg-brand-900/20 px-3 py-1 rounded-full border border-brand-500/20">
                                Recuperando dados e salvando...
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-950">
                    <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 bg-slate-900 text-white border border-slate-700 rounded-full px-4 py-3 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-500 text-sm transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        className="bg-brand-600 text-white p-3 rounded-full hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                    </div>
                </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;