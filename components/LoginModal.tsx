import React, { useState } from 'react';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  canClose: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, canClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleCepBlur = async () => {
    // Simulação de preenchimento ou integração futura com ViaCEP
    // Por enquanto, apenas garante formatação
    if (cep.length === 8) {
        setCep(cep.replace(/^(\d{5})(\d{3})/, "$1-$2"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    if (isRegistering) {
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (!name.trim() || !phone.trim() || !cep.trim() || !address.trim()) {
            setError('Preencha todos os dados de cadastro para entrega.');
            return;
        }
    }

    setIsLoading(true);

    try {
        if (isRegistering) {
            await api.registerUser({
                email,
                password,
                name,
                phone,
                cep,
                address
            });
        }
        
        // Login automático após registro ou login normal
        await api.loginUser(email, password);
        onLogin(email);
        onClose();
    } catch (err: any) {
        setError(err.message || 'Erro ao processar. Verifique os dados.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={() => {
            if (canClose) {
                onClose();
                setError('');
                setPassword('');
            }
        }}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 flex flex-col max-h-[90vh]">
        
        <div className="px-8 pt-8 pb-4 text-center flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">
                {isRegistering ? 'Criar Conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
                {isRegistering ? 'Preencha seus dados para agilizar compras e atendimento' : 'Entre com suas credenciais para continuar'}
            </p>
        </div>

        <div className="overflow-y-auto px-8 pb-8 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg text-sm text-center border border-red-500/20">
                    {error}
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">E-mail</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
                    placeholder="seu@email.com"
                />
            </div>

            {isRegistering && (
                <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-300">Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ex: João Silva"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300">Celular / WhatsApp</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300">CEP</label>
                            <input
                                type="text"
                                required
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                onBlur={handleCepBlur}
                                maxLength={9}
                                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="00000-000"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-300">Endereço Completo</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Rua, Número, Bairro, Complemento"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">Senha</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
                    placeholder="••••••••"
                />
            </div>

            {isRegistering && (
                <div className="space-y-1.5 animate-slide-up">
                    <label className="text-sm font-semibold text-slate-300">Confirmar Senha</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
                        placeholder="••••••••"
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-brand-600 hover:bg-brand-500 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Processando...' : (isRegistering ? 'Cadastrar e Entrar' : 'Entrar')}
            </button>
            </form>
            
            <div className="mt-6 pt-4 text-center border-t border-white/5">
            <button 
                    type="button"
                    onClick={handleToggleMode}
                    className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
                {isRegistering ? 'Já possui uma conta? Faça login' : 'Novo por aqui? Crie uma conta'}
            </button>
            
            <div className="mt-2">
                <button 
                    onClick={() => {
                        if(canClose) {
                            onClose();
                            setError('');
                            setPassword('');
                        }
                    }} 
                    className={`text-xs text-slate-500 hover:text-slate-300 ${!canClose && 'hidden'}`}
                >
                    Cancelar
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;