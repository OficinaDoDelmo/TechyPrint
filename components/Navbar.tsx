import React, { useState, useEffect } from 'react';
import Logo from './Logo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onHome: () => void;
  onOpenAdmin: () => void;
  onOpenFinancial: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  currentUser: string | null;
  onOpenOrders: () => void;
  onOpenCustom: () => void;
  onOpenInquiries: () => void;
  onOpenProfile: () => void;
  onOpenBrandKit: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onHome, 
  onOpenAdmin,
  onOpenFinancial,
  onLogout, 
  onOpenLogin,
  currentUser,
  onOpenOrders,
  onOpenCustom,
  onOpenInquiries,
  onOpenProfile,
  onOpenBrandKit
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogoRotating, setIsLogoRotating] = useState(false);
  
  const isAdmin = currentUser === 'delmoneto2@gmail.com';

  useEffect(() => {
    window.addEventListener('scroll', () => {
        setScrolled(window.scrollY > 10);
    });
  }, []);

  const handleLogoClick = () => {
    setIsLogoRotating(true);
    setTimeout(() => setIsLogoRotating(false), 1000);
    onHome();
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
          ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-brand-900/30' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                    
                <div 
                    className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95" 
                    onClick={handleLogoClick}
                >
                    <Logo isRotating={isLogoRotating} />
                </div>
                
                <div className="flex items-center gap-4 sm:gap-6">
                    
                    <div className="hidden md:flex items-center gap-4">
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                title="GitHub do Projeto"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>

                            <button
                                onClick={onOpenCustom}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                Lab 3D
                            </button>
                            
                            {currentUser ? (
                            <div className="flex items-center gap-3 pl-6 border-l border-white/10 ml-2">
                                <div className="text-right hidden lg:block group relative cursor-default">
                                    <span className="block text-[10px] uppercase font-bold text-brand-500 tracking-wider">Online</span>
                                    <span className="block text-sm font-semibold text-slate-200 cursor-pointer hover:text-white transition-colors" onClick={onOpenProfile}>{currentUser.split('@')[0]}</span>
                                </div>
                                
                                <button onClick={onOpenOrders} className="p-2 text-slate-400 hover:text-brand-400 hover:bg-white/5 rounded-lg transition-all" title="Meus Pedidos">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </button>
                                
                                <button onClick={onOpenProfile} className="p-2 text-slate-400 hover:text-brand-400 hover:bg-white/5 rounded-lg transition-all" title="Meu Perfil">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </button>

                                {isAdmin && (
                                    <>
                                        <button 
                                            onClick={onOpenBrandKit} 
                                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" 
                                            title="Kit de Marca / Downloads"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </button>

                                        <button 
                                            onClick={onOpenInquiries} 
                                            className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all" 
                                            title="Atendimentos Chat"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                        </button>

                                        <button 
                                            onClick={onOpenAdmin} 
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" 
                                            title="Gerenciar Produtos"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </button>

                                        <button 
                                            onClick={onOpenFinancial} 
                                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" 
                                            title="Financeiro"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </button>
                                    </>
                                )}

                                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Sair">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </button>
                            </div>
                            ) : (
                            <button
                                onClick={onOpenLogin}
                                className="ml-4 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                            >
                                Entrar
                            </button>
                            )}
                    </div>

                    <button 
                        onClick={onOpenCart}
                        className="relative p-2.5 bg-slate-800/50 border border-white/10 hover:border-brand-500/50 hover:bg-brand-500/10 rounded-xl text-slate-300 hover:text-brand-400 transition-all group"
                    >
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-brand-600 text-white text-[10px] font-bold rounded-full shadow-lg">
                            {cartCount}
                        </span>
                        )}
                    </button>

                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-300 hover:text-white">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
         <div 
            className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
         />
         <div className={`absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
             <div className="p-6 border-b border-white/5 bg-slate-900">
                 <div className="flex justify-between items-center mb-6">
                     <span className="font-bold text-white text-lg">Menu</span>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                 </div>
                 {currentUser ? (
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-brand-600 flex items-center justify-center text-white font-bold rounded-xl shadow-lg">
                            {currentUser.charAt(0).toUpperCase()}
                         </div>
                         <div>
                             <p className="text-[10px] uppercase font-bold text-brand-400">Logado como</p>
                             <p className="text-sm font-semibold text-white truncate max-w-[180px]">{currentUser}</p>
                         </div>
                     </div>
                 ) : (
                    <button onClick={() => {onOpenLogin(); setIsMobileMenuOpen(false);}} className="w-full py-3 bg-brand-600 text-white font-medium rounded-lg shadow-sm">Entrar / Cadastrar</button>
                 )}
             </div>
             
             <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                 <button onClick={() => {onHome(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-4 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                     Início
                 </button>
                 <button onClick={() => {onOpenCustom(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-4 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     Laboratório 3D
                 </button>
                 <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full text-left p-4 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors"
                 >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub Code
                 </a>
                 {currentUser && (
                    <>
                        <button onClick={() => {onOpenProfile(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-4 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Meu Perfil
                        </button>
                        <button onClick={() => {onOpenOrders(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-4 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Meus Pedidos
                        </button>
                    </>
                 )}
                 
                 {isAdmin && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 px-3">Administração</p>
                        
                        <button onClick={() => {onOpenBrandKit(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium mb-2 border border-white/10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Kit de Marca / Logos
                        </button>

                         <button onClick={() => {onOpenInquiries(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 text-sm font-medium mb-2 border border-purple-500/10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            Atendimentos Chat
                        </button>

                        <button onClick={() => {onOpenAdmin(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-3 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 text-sm font-medium mb-2 border border-blue-500/10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Adicionar / Gerenciar Produtos
                        </button>
                        
                        <button onClick={() => {onOpenFinancial(); setIsMobileMenuOpen(false);}} className="flex items-center gap-3 w-full text-left p-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 text-sm font-medium border border-emerald-500/10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Painel Financeiro
                        </button>
                    </div>
                 )}
             </div>
             
             {currentUser && (
                 <div className="p-4 border-t border-white/5">
                     <button onClick={() => {onLogout(); setIsMobileMenuOpen(false);}} className="flex items-center justify-center gap-2 w-full py-3 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors font-medium">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                         Sair
                     </button>
                 </div>
             )}
         </div>
      </div>
    </>
  );
};

export default Navbar;