import React, { useEffect, useState } from 'react';
import { Sale } from '../types';
import { api } from '../services/api';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string | null;
}

const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [orders, setOrders] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadOrders();
    }
  }, [isOpen, currentUser]);

  const loadOrders = async () => {
    setIsLoading(true);
    const allSales = await api.getSales();
    const myOrders = allSales.filter(sale => sale.customerEmail === currentUser);
    setOrders(myOrders);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh] border border-white/10">
        
        {/* Header */}
        <div className="bg-slate-950 px-8 py-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Meus Pedidos</h2>
            <p className="text-sm text-slate-400">Acompanhe seu histórico de compras</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-900">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-brand-500 rounded-full animate-spin"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-white/5 shadow-sm">
                    <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-slate-300 font-medium text-lg">Nenhum pedido encontrado</p>
                    <p className="text-slate-500 text-sm mt-1">Você ainda não realizou compras conosco.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-slate-800 border border-white/5 rounded-xl p-6 shadow-sm hover:border-brand-500/30 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white">{order.id}</span>
                                        {order.status === 'completed' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                Aprovado
                                            </span>
                                        )}
                                        {order.status === 'pending' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                Pendente
                                            </span>
                                        )}
                                        {order.status === 'cancelled' && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                Cancelado
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">{order.date} • {order.itemsCount} itens</p>
                                </div>

                                <div className="flex-1 md:px-8">
                                    <p className="text-sm text-slate-300 line-clamp-1">
                                        {order.itemsSummary}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-0.5">Total</p>
                                    <p className="text-lg font-bold text-white">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersModal;