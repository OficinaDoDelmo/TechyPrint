import React from 'react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
    product, 
    isOpen, 
    onClose, 
    onAddToCart,
    isFavorite,
    onToggleFavorite
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh] border border-white/10">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 backdrop-blur text-slate-300 hover:text-white rounded-full transition-all border border-white/10"
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-slate-950 relative group overflow-hidden">
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center opacity-90"
            />
            
            <div className="absolute bottom-4 left-4 right-4 hidden md:block">
                <div className="flex gap-2">
                    <span className="bg-black/60 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded border border-white/10">
                        {product.material}
                    </span>
                    <span className="bg-black/60 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded border border-white/10">
                        {product.category}
                    </span>
                </div>
            </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-slate-900">
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                        {product.name}
                    </h2>
                    
                    <button
                        onClick={onToggleFavorite}
                        className={`p-2 rounded-full transition-all duration-300 ${
                            isFavorite 
                            ? 'text-red-500 bg-red-500/10 border border-red-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                        }`}
                        title={isFavorite ? "Remover Favorito" : "Adicionar aos Favoritos"}
                    >
                         <svg className={`w-7 h-7 ${isFavorite ? 'fill-red-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                
                {product.isNew && (
                    <span className="inline-block bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-4">
                        Novo Lançamento
                    </span>
                )}

                <div className="h-px w-full bg-white/5 my-4"></div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Sobre o Produto</h4>
                        <p className="text-slate-300 font-light leading-relaxed text-sm md:text-base">
                            {product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                         <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                             <span className="text-xs text-slate-500 uppercase block font-semibold">Material</span>
                             <span className="text-sm text-white font-medium">{product.material}</span>
                         </div>
                         <div className="bg-slate-800 p-3 rounded-lg border border-white/5">
                             <span className="text-xs text-slate-500 uppercase block font-semibold">Garantia</span>
                             <span className="text-sm text-white font-medium">30 Dias</span>
                         </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                <div>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">Preço</span>
                    <span className="text-3xl font-bold text-white">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                <button
                    onClick={() => {
                        onAddToCart(product);
                        onClose();
                    }}
                    className="flex-1 max-w-[200px] bg-brand-600 hover:bg-brand-500 text-white py-3 px-6 rounded-xl font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-transform active:scale-95"
                >
                    Adicionar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;