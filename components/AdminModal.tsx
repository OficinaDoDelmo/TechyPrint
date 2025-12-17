import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  productToEdit?: Product | null;
}

const AdminModal: React.FC<AdminModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddProduct, 
  onUpdateProduct, 
  productToEdit 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Acessórios Tech',
    material: 'PLA',
    imageUrl: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        category: productToEdit.category,
        material: productToEdit.material,
        imageUrl: productToEdit.imageUrl
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Acessórios Tech',
        material: 'PLA',
        imageUrl: ''
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, imageUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productToEdit && onUpdateProduct) {
      const updatedProduct: Product = {
        ...productToEdit,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        material: formData.material as 'PLA' | 'PETG' | 'Resina' | 'TPU',
        imageUrl: formData.imageUrl || productToEdit.imageUrl
      };
      onUpdateProduct(updatedProduct);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        material: formData.material as 'PLA' | 'PETG' | 'Resina' | 'TPU',
        imageUrl: formData.imageUrl || `https://picsum.photos/400/400?random=${Date.now()}`,
        isNew: true
      };
      onAddProduct(newProduct);
    }
    
    onClose();
  };

  // Header Color Logic: Blue for Add/Edit context
  const headerColorClass = productToEdit ? "text-amber-400" : "text-blue-400";
  const headerBgClass = productToEdit ? "border-amber-500/30" : "border-blue-500/30";
  const iconColorClass = productToEdit ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto border border-white/10">
        
        {/* Header with Visual Cues */}
        <div className={`bg-slate-950 px-6 py-4 border-b ${headerBgClass} flex justify-between items-center sticky top-0 z-10`}>
          <h2 className={`text-xl font-bold ${headerColorClass} flex items-center gap-3`}>
            <span className={`p-2 rounded-lg border ${iconColorClass}`}>
                {productToEdit ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                )}
            </span>
            {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Nome do Produto</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
                placeholder="Ex: Suporte Moderno"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Preço (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Descrição</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-500"
              placeholder="Descreva as características..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Categoria</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option>Acessórios Tech</option>
                <option>Decoração</option>
                <option>Organização</option>
                <option>Educacional</option>
                <option>Brinquedos</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Material</label>
              <select
                value={formData.material}
                onChange={e => setFormData({...formData, material: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option>PLA</option>
                <option>PETG</option>
                <option>Resina</option>
                <option>TPU</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Imagem do Produto</label>
            
            <div className="flex gap-4 items-start">
              <div 
                className="w-32 h-32 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center overflow-hidden bg-slate-800/50 cursor-pointer hover:border-brand-500 transition-colors relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white font-medium">Alterar</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <span className="text-xs text-slate-500">Clique para upload</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-700 transition-colors"
                >
                  Escolher Arquivo Local
                </button>
                
                <input
                  type="url"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 outline-none placeholder-slate-500"
                  placeholder="Ou cole uma URL de imagem"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-white rounded-lg font-medium shadow-lg transition-colors ${
                  productToEdit 
                  ? 'bg-amber-600 hover:bg-amber-500' 
                  : 'bg-brand-600 hover:bg-brand-500'
              }`}
            >
              {productToEdit ? 'Salvar Alterações' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;