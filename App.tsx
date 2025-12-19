import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ChatBot from './components/ChatBot';
import CartSidebar from './components/CartSidebar';
import AdminModal from './components/AdminModal';
import LoginModal from './components/LoginModal';
import FinancialModal from './components/FinancialModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import CustomerOrdersModal from './components/CustomerOrdersModal'; 
import CustomPrintModal from './components/CustomPrintModal';
import AdminInquiriesModal from './components/AdminInquiriesModal';
import ProfileModal from './components/ProfileModal';
import BrandKitModal from './components/BrandKitModal';
import Toast, { ToastMessage } from './components/Toast';
import Confetti from './components/Confetti';
import { Product, CartItem } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFinancialOpen, setIsFinancialOpen] = useState(false);
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('techyprint_user');
  });
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); 
  const [isCustomOpen, setIsCustomOpen] = useState(false); 
  const [isInquiriesOpen, setIsInquiriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);
  const [heroImage, setHeroImage] = useState<string>('https://picsum.photos/1000/800?grayscale');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [showConfetti, setShowConfetti] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('techyprint_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  const vibrate = (pattern: number | number[] = 50) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    if (type === 'success') vibrate(50);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
        let newFavs;
        if (prev.includes(productId)) {
            newFavs = prev.filter(id => id !== productId);
            addToast('Removido dos favoritos', 'info');
        } else {
            newFavs = [...prev, productId];
            addToast('Adicionado aos favoritos', 'success');
            vibrate(30);
        }
        localStorage.setItem('techyprint_favorites', JSON.stringify(newFavs));
        return newFavs;
    });
  };

  const handleOrderSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    const loadData = async () => {
      const apiProducts = await api.getProducts();
      setProducts(apiProducts);
      setIsProductsLoaded(true);
      const savedHero = await api.getHeroImage();
      setHeroImage(savedHero);
    };

    loadData();

    if (!localStorage.getItem('techyprint_user')) {
        const adminEmail = 'delmoneto2@gmail.com';
        setCurrentUser(adminEmail);
        localStorage.setItem('techyprint_user', adminEmail);
    }
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('techyprint_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('techyprint_cart', JSON.stringify(cart));
  }, [cart]);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: Product) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    addToast('Adicionado ao carrinho', 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleAddProduct = async (newProduct: Product) => {
    await api.addProduct(newProduct);
    setProducts(prev => [newProduct, ...prev]);
    setActiveCategory(newProduct.category);
    scrollToCatalog();
    addToast('Produto cadastrado', 'success');
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await api.updateProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    addToast('Produto atualizado', 'info');
  };

  const handleUpdateHeroImage = async (url: string) => {
      await api.updateHeroImage(url);
      setHeroImage(url);
      addToast('Capa atualizada', 'success');
  };

  const openEditModal = (product: Product) => {
    if (currentUser === 'delmoneto2@gmail.com') {
        setEditingProduct(product);
        setIsAdminOpen(true);
    }
  };

  const handleOpenAdmin = () => {
    if (currentUser === 'delmoneto2@gmail.com') {
      setEditingProduct(null);
      setIsAdminOpen(true);
    }
  };

  const handleOpenFinancial = () => {
    if (currentUser === 'delmoneto2@gmail.com') {
        setIsFinancialOpen(true);
    }
  };

  const handleOpenInquiries = () => {
    if (currentUser === 'delmoneto2@gmail.com') {
        setIsInquiriesOpen(true);
    }
  };

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('techyprint_user', email);
    setIsLoginOpen(false);
    addToast(`Bem-vindo, ${email.split('@')[0]}`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('techyprint_user');
    setIsAdminOpen(false);
    setIsFinancialOpen(false);
    setIsOrdersOpen(false);
    setIsCustomOpen(false);
    setIsInquiriesOpen(false);
    setIsProfileOpen(false);
    setIsBrandKitOpen(false);
    setCart([]);
    addToast('Você saiu da conta', 'info');
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    setEditingProduct(null);
  };

  const scrollToCatalog = () => {
    const section = document.getElementById('catalog');
    if (section) {
       const navbarHeight = 80;
       const elementPosition = section.getBoundingClientRect().top + window.scrollY;
       const offsetPosition = elementPosition - navbarHeight;
       window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const categories = useMemo(() => {
    return ['Todos', 'Favoritos', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeCategory === 'Favoritos') {
        filtered = filtered.filter(p => favorites.includes(p.id));
    }
    else if (activeCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeCategory, products, searchQuery, favorites]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isUserAdmin = currentUser === 'delmoneto2@gmail.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
      
      {showConfetti && <Confetti />}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10">
        <div className="fixed top-24 left-0 right-0 sm:left-auto sm:right-0 z-[100] flex flex-col items-center sm:items-end sm:pr-6 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>

        <Navbar 
            cartCount={cartCount} 
            onOpenCart={() => setIsCartOpen(true)}
            onHome={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
            onOpenAdmin={handleOpenAdmin}
            onOpenFinancial={handleOpenFinancial}
            onOpenInquiries={handleOpenInquiries}
            onLogout={handleLogout}
            onOpenLogin={() => setIsLoginOpen(true)}
            currentUser={currentUser}
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenCustom={() => setIsCustomOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenBrandKit={() => setIsBrandKitOpen(true)}
        />
        
        <main className="pt-20">
            <Hero 
            onOpenChat={() => setIsChatOpen(true)} 
            heroImage={heroImage}
            onUpdateHeroImage={handleUpdateHeroImage}
            isAdmin={isUserAdmin}
            />
            
            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                          Catálogo <span className="text-brand-400">Premium</span>
                      </h2>
                      <p className="text-slate-400 mt-2 text-sm">Design paramétrico e materiais de alta performance.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-end items-center">
                        <div className="relative w-full max-w-xs group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar produtos..."
                                className="block w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 px-4 text-slate-200 placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all backdrop-blur-sm"
                            />
                            <div className="absolute right-3 top-2.5 text-slate-500 group-focus-within:text-brand-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-10 border-b border-slate-800 pb-4">
                    {categories.map((category) => (
                        <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border ${
                            activeCategory === category
                            ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                            : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                        }`}
                        >
                            {category === 'Favoritos' ? '❤ Favoritos' : category}
                        </button>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {!isProductsLoaded ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div>
                    </div>
                    ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onEdit={openEditModal}
                        isAdmin={isUserAdmin}
                        onViewDetails={(p) => setSelectedProduct(p)}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={() => toggleFavorite(product.id)}
                        />
                    ))
                    ) : (
                    <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                        <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-lg font-medium text-slate-300">Nenhum produto encontrado</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setActiveCategory('Todos');}}
                            className="mt-6 text-brand-400 font-medium hover:underline text-sm hover:text-brand-300"
                        >
                            Limpar filtros
                        </button>
                    </div>
                    )}
                </div>
            </div>
        </main>

        <footer className="bg-slate-950 border-t border-slate-900 mt-12 py-12 relative">
            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <p className="text-sm text-slate-500">
                    &copy; 2024 TechyPrint 3D. Todos os direitos reservados.
                </p>
                <div className="mt-2">
                    <span className="text-[10px] text-slate-700 font-mono uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded border border-white/5">
                        Versão 1.0.2 - Live Build
                    </span>
                </div>
                <div className="mt-6 flex justify-center space-x-6 text-slate-500">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        GitHub
                    </a>
                    <a href="#" className="hover:text-brand-400 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-brand-400 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-brand-400 transition-colors">Contato</a>
                </div>
            </div>
        </footer>

        <CartSidebar 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart}
            onRemove={removeFromCart}
            total={cartTotal}
            onClearCart={clearCart}
            currentUser={currentUser}
            onShowToast={(msg) => addToast(msg, 'success')}
            onOrderSuccess={handleOrderSuccess}
        />

        <LoginModal 
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLogin={handleLogin}
            canClose={true}
        />

        <AdminModal
            isOpen={isAdminOpen}
            onClose={handleCloseAdmin}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            productToEdit={editingProduct}
        />

        <FinancialModal
            isOpen={isFinancialOpen}
            onClose={() => setIsFinancialOpen(false)}
        />

        <AdminInquiriesModal
            isOpen={isInquiriesOpen}
            onClose={() => setIsInquiriesOpen(false)}
        />

        <CustomerOrdersModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            currentUser={currentUser}
        />

        <CustomPrintModal
            isOpen={isCustomOpen}
            onClose={() => setIsCustomOpen(false)}
            currentUser={currentUser}
        />

        <ProfileModal 
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            currentUser={currentUser}
            onUpdateProfile={() => addToast('Perfil atualizado com sucesso!', 'success')}
        />

        <BrandKitModal 
            isOpen={isBrandKitOpen}
            onClose={() => setIsBrandKitOpen(false)}
        />

        <ProductDetailsModal
            isOpen={!!selectedProduct}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
            onToggleFavorite={selectedProduct ? () => toggleFavorite(selectedProduct.id) : () => {}}
        />
        
        <ChatBot 
            isOpen={isChatOpen} 
            onToggle={() => setIsChatOpen(!isChatOpen)} 
            currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default App;