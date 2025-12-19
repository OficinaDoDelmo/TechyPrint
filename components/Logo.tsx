import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  isRotating?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true, isRotating = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-12 h-12',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Apenas este container do ícone recebe a animação de rotação */}
      <div 
        id="techyprint-logo-svg" 
        className={`
          ${sizes[size]} 
          bg-brand-600 rounded-xl flex items-center justify-center text-white 
          shadow-[0_0_15px_rgba(37,99,235,0.5)] flex-shrink-0
          transition-transform duration-1000 ease-in-out
          ${isRotating ? 'rotate-[360deg]' : ''}
        `}
      >
        <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizes[size]} text-white tracking-tight leading-none`}>
            Techy<span className="text-brand-400">Print</span>
          </span>
          {size !== 'sm' && (
            <span className={`${size === 'xl' ? 'text-sm' : 'text-[10px]'} text-brand-300 tracking-widest uppercase opacity-70 mt-1`}>3D Legacy Store</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;