import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string | null;
  onUpdateProfile: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<UserProfile>({
    email: '',
    name: '',
    phone: '',
    cep: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      loadProfile();
    }
  }, [isOpen, currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const profile = await api.getUserProfile(currentUser);
      if (profile) {
        setFormData({ ...profile, password: '' }); // Não exibir a senha atual por segurança
      }
    } catch (err) {
      setError('Erro ao carregar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    if (formData.cep.length === 8) {
        setFormData(prev => ({ ...prev, cep: prev.cep.replace(/^(\d{5})(\d{3})/, "$1-$2") }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Se a senha estiver vazia, passamos undefined para a API preservar a antiga
      const dataToUpdate = {
        ...formData,
        password: formData.password ? formData.password : undefined
      };

      await api.updateUserProfile(dataToUpdate);
      setSuccess('Perfil atualizado com sucesso!');
      onUpdateProfile();
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Meu Perfil
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar bg-slate-900">
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg text-sm border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 text-green-400 px-4 py-3 rounded-lg text-sm border border-green-500/20 text-center font-bold">
                            {success}
                        </div>
                    )}

                    <div className="space-y-1.5 opacity-60">
                        <label className="text-xs font-bold text-slate-500 uppercase">E-mail (Não alterável)</label>
                        <input
                            type="email"
                            disabled
                            value={formData.email}
                            className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">Celular / WhatsApp</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase">CEP</label>
                            <input
                                type="text"
                                required
                                maxLength={9}
                                value={formData.cep}
                                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                                onBlur={handleCepBlur}
                                className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase">Endereço Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Alterar Senha (Opcional)</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="block w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-1 focus:ring-brand-500 outline-none placeholder-slate-600"
                            placeholder="Deixe em branco para manter a atual"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full py-3.5 px-4 rounded-xl text-white font-bold bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20 mt-4 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;