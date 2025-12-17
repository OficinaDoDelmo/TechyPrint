import React, { useEffect, useState } from 'react';
import { Sale } from '../types';
import { api } from '../services/api';

interface FinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialModal: React.FC<FinancialModalProps> = ({ isOpen, onClose }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSales();
    }
  }, [isOpen]);

  const loadSales = async () => {
    setIsLoading(true);
    const data = await api.getSales();
    setSales(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: 'completed' | 'cancelled') => {
    await api.updateSaleStatus(id, newStatus);
    setSales(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  if (!isOpen) return null;

  const completedSales = sales.filter(s => s.status === 'completed');
  const pendingSales = sales.filter(s => s.status === 'pending');
  
  const totalRevenue = completedSales.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = completedSales.length;
  const pendingRevenue = pendingSales.reduce((acc, curr) => acc + curr.total, 0);
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] border border-white/10">
        
        {/* Header - Marked with Green for Financial Context */}
        <div className="bg-slate-950 px-8 py-6 border-b border-emerald-900/30 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
                <span className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                Painel Financeiro
            </h2>
            <p className="text-sm text-slate-400 mt-1 pl-14">Visão geral de faturamento e pedidos</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <svg className="w-20 h-20 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-400 mb-1">Faturamento Total</p>
                    <h3 className="text-2xl font-bold text-emerald-400">
                        R$ {totalRevenue.toFixed(2).replace('.', ',')}
                    </h3>
                </div>

                {/* Pending Revenue */}
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Em Análise</p>
                    <h3 className="text-2xl font-bold text-yellow-500">
                        R$ {pendingRevenue.toFixed(2).replace('.', ',')}
                    </h3>
                     <p className="text-xs text-slate-500 mt-1">{pendingSales.length} pedidos pendentes</p>
                </div>

                {/* Total Orders */}
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Pedidos Concluídos</p>
                    <h3 className="text-2xl font-bold text-brand-400">
                        {totalOrders}
                    </h3>
                </div>

                {/* Avg Ticket */}
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 shadow-sm">
                    <p className="text-sm font-medium text-slate-400 mb-1">Ticket Médio</p>
                    <h3 className="text-2xl font-bold text-purple-400">
                        R$ {averageTicket.toFixed(2).replace('.', ',')}
                    </h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-slate-800 rounded-xl shadow-sm border border-white/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        Transações Recentes
                    </h3>
                    <button 
                        onClick={loadSales}
                        className="text-sm text-brand-400 hover:text-brand-300 font-medium flex items-center gap-2"
                    >
                        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Atualizar
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 font-medium border-b border-white/5">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">ID Pedido</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Resumo</th>
                                <th className="px-6 py-3 text-right">Valor</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        Nenhuma venda registrada.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {sale.status === 'completed' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Concluído
                                                </span>
                                            )}
                                            {sale.status === 'pending' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                    Pendente
                                                </span>
                                            )}
                                            {sale.status === 'cancelled' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    Cancelado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{sale.id}</td>
                                        <td className="px-6 py-4 text-slate-300">{sale.date}</td>
                                        <td className="px-6 py-4 font-medium text-white">{sale.customerEmail}</td>
                                        <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-400" title={sale.itemsSummary}>
                                            {sale.itemsSummary}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            R$ {sale.total.toFixed(2).replace('.', ',')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {sale.status === 'pending' && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleStatusChange(sale.id, 'completed')}
                                                        className="p-1.5 text-green-400 hover:bg-green-500/10 rounded border border-green-500/20"
                                                        title="Aprovar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusChange(sale.id, 'cancelled')}
                                                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded border border-red-500/20"
                                                        title="Recusar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                             {sale.status !== 'pending' && (
                                                <span className="text-xs text-slate-500">-</span>
                                             )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialModal;