import React, { useRef, useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  isAdmin: boolean;
  onViewDetails: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onEdit, 
  isAdmin, 
  onViewDetails,
  isFavorite,
  onToggleFavorite
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  
  // Estado para controlar a animação de compra
  const [isBuying, setIsBuying] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBuying) return;

    setIsBuying(true);

    // Ajustado para 1.7s para coincidir com a sequência completa de animações
    setTimeout(() => {
        onAddToCart(product);
        setIsBuying(false);
    }, 1700);
  };

  return (
    <div 
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onViewDetails(product)}
        className="group relative bg-slate-900/60 rounded-2xl border border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-brand-500/30"
    >
      {/* SPOTLIGHT EFFECT */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(37,99,235,0.15), transparent 40%)`
        }}
      />

      {/* NEW BADGE */}
      {product.isNew && (
        <div className="absolute top-3 left-3 z-30">
          <div className="bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] uppercase tracking-wide backdrop-blur-md">
            Novo
          </div>
        </div>
      )}

      {/* FAVORITE BUTTON */}
      <button
        onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
        }}
        className="absolute top-3 right-3 z-40 p-2 rounded-full transition-all duration-300 bg-black/40 backdrop-blur-md border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30"
      >
        <svg 
            className={`w-5 h-5 transition-transform duration-300 ${
                isFavorite 
                ? 'fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                : ''
            }`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      
      {/* ADMIN EDIT BUTTON */}
      {isAdmin && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="absolute top-14 right-3 z-40 p-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white rounded-full transition-all"
          title="Editar Produto (Admin)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}

      {/* Image Area */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col relative z-20">
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-xs text-brand-400 font-medium mb-1 uppercase tracking-wider">{product.category}</p>
                <h3 className="text-base font-semibold text-slate-100 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-brand-200 transition-colors">
                    {product.name}
                </h3>
            </div>
        </div>
        
        <p className="text-xs text-slate-400 mb-4 bg-white/5 border border-white/5 inline-block px-2 py-1 rounded w-max backdrop-blur-sm">
            {product.material}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/10 h-14">
          <span className="text-lg font-bold text-white tracking-wide">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          
          {/* BOTÃO ANIMADO */}
          <button
            onClick={handleBuyClick}
            disabled={isBuying}
            className={`relative flex items-center justify-center rounded-xl border transition-all duration-500 shadow-lg overflow-hidden ${
                isBuying 
                ? 'w-32 bg-brand-600 border-brand-500 cursor-default' 
                : 'w-12 h-10 bg-brand-600/10 hover:bg-brand-600 hover:text-white text-brand-400 border-brand-600/20 hover:border-brand-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'
            }`}
            style={{ height: '40px' }}
          >
            {/* Ícone Padrão (Carrinho Estático) */}
            <svg 
                className={`w-5 h-5 absolute transition-all duration-300 ${isBuying ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>

            {/* CENA DA ANIMAÇÃO */}
            {isBuying && (
                <div className="w-full h-full relative flex items-center justify-center">
                    
                    {/* Container que move o carrinho para fora (Exit) */}
                    <div className="relative animate-cart-exit flex items-center">
                        
                        {/* Linhas de velocidade (Speed Lines) */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 animate-speed-lines">
                            <div className="h-[2px] bg-white/60 rounded-full w-full"></div>
                            <div className="h-[2px] bg-white/40 rounded-full w-2/3 ml-auto"></div>
                        </div>

                        {/* O Carrinho (Sofre Impacto) */}
                        <div className="relative animate-cart-impact origin-bottom">
                            <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            
                            {/* A Caixa Caindo (Dentro do Carrinho) */}
                            <div className="absolute -top-3 left-[5px] animate-package-drop z-10">
                                <svg className="w-3.5 h-3.5 text-brand-100 fill-brand-100 drop-shadow-sm" viewBox="0 0 24 24">
                                    <path d="M21 16.53V7.114c0-.356-.26-.692-.563-.822l-7.794-3.585a1.86 1.86 0 0 0-1.286 0L3.563 6.292A1.03 1.03 0 0 0 3 7.114V16.53c0 .32.19.61.487.747l8 3.69a1.14 1.14 0 0 0 .963 0l8-3.69A.82.82 0 0 0 21 16.53Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;