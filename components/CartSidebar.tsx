import React, { useState, useEffect, useMemo } from 'react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  total: number;
  onClearCart: () => void;
  currentUser: string | null;
  onShowToast: (message: string) => void;
  onOrderSuccess?: () => void;
}

// --- PIX HELPER FUNCTIONS ---
class PixGenerator {
  private static formatField(id: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  private static getCRC16(payload: string): string {
    payload += '6304';
    let polynomial = 0x1021;
    let crc = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    return payload + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  public static generate(key: string, name: string, city: string, amount: number, txId: string = '***'): string {
    const keyClean = key.replace(/[^\w@.]/g, '');
    const amountStr = amount.toFixed(2);
    const nameClean = name.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cityClean = city.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let payload = '';
    payload += this.formatField('00', '01');
    payload += this.formatField('26',
      this.formatField('00', 'br.gov.bcb.pix') +
      this.formatField('01', keyClean)
    );
    payload += this.formatField('52', '0000');
    payload += this.formatField('53', '986');
    payload += this.formatField('54', amountStr);
    payload += this.formatField('58', 'BR');
    payload += this.formatField('59', nameClean);
    payload += this.formatField('60', cityClean);
    payload += this.formatField('62',
      this.formatField('05', txId)
    );

    return this.getCRC16(payload);
  }
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, onClose, cart, onRemove, total, onClearCart, currentUser, onShowToast, onOrderSuccess
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [notes, setNotes] = useState('');
  
  const pixKey = "06614436120";
  const merchantName = "TechyPrint 3D";
  const merchantCity = "Brasil";

  const orderId = useMemo(() => {
    return `PED-${Math.floor(Math.random() * 90000) + 10000}`;
  }, [isOpen]);

  const pixPayload = useMemo(() => {
    if (total <= 0) return '';
    return PixGenerator.generate(pixKey, merchantName, merchantCity, total);
  }, [total]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setNotes('');
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    onShowToast("Código Pix copiado!");
  };

  const handleSendOrder = async () => {
    const date = new Date().toLocaleString('pt-BR');
    const itemsList = cart.map(item => 
      `   • ${item.quantity}x ${item.name} (${item.material})`
    ).join('\n');

    const itemsSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');

    await api.recordSale({
      id: orderId,
      date: date,
      customerEmail: currentUser || 'Visitante',
      total: total,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      itemsSummary: itemsSummary,
      timestamp: Date.now(),
      status: 'pending'
    });

    const message = 
      `Olá, gostaria de confirmar meu pedido na TechyPrint:\n\n` +
      `📦 *Pedido:* ${orderId}\n` +
      `📅 *Data:* ${date}\n` +
      `👤 *Cliente:* ${currentUser || 'Visitante'}\n` +
      `--------------------------------\n` +
      `*Itens:*\n${itemsList}\n` +
      `--------------------------------\n` +
      `💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}\n` +
      `📝 *Observações:* ${notes || 'Nenhuma'}\n\n` +
      `Já realizei o pagamento via Pix. Segue o comprovante.`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5563992211113"; 
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    onClearCart();
    onClose();
    onShowToast("Pedido enviado com sucesso!");
    if (onOrderSuccess) onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-slate-900 shadow-2xl flex flex-col transform transition-transform animate-slide-up sm:animate-none border-l border-white/10">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
                <h2 className="text-lg font-bold text-white">Seu Carrinho</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
                {step === 'cart' ? (
                    <>
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                                <button 
                                    onClick={onClose}
                                    className="mt-4 text-brand-400 hover:text-brand-300 font-medium"
                                >
                                    Continuar comprando
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="bg-slate-800 p-4 rounded-xl border border-white/5 shadow-sm flex gap-4 hover:border-brand-500/30 transition-colors">
                                        <div className="w-20 h-20 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-slate-400">{item.material}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="font-bold text-brand-400">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-500">Qtd: {item.quantity}</span>
                                                    <button 
                                                        onClick={() => onRemove(item.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-800 p-5 rounded-xl border border-white/5 shadow-sm text-center">
                            <h3 className="font-bold text-white mb-1">Pagamento via Pix</h3>
                            <p className="text-xs text-slate-400 mb-4">Escaneie o QR Code ou copie o código abaixo</p>
                            
                            <div className="bg-white p-2 inline-block rounded-lg mb-4 border border-white/10">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`} 
                                    alt="QR Code Pix" 
                                    className="w-48 h-48"
                                />
                            </div>

                            <div className="relative">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={pixPayload}
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-400 text-xs rounded p-3 pr-10 truncate"
                                />
                                <button 
                                    onClick={handleCopyPix}
                                    className="absolute right-2 top-2 p-1 text-brand-400 hover:bg-slate-800 rounded"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-5 rounded-xl border border-white/5 shadow-sm">
                             <h3 className="font-bold text-white mb-3 text-sm">Resumo do Pedido</h3>
                             <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>Frete</span>
                                    <span className="text-green-400">Grátis</span>
                                </div>
                                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg text-white">
                                    <span>Total</span>
                                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                                </div>
                             </div>
                             
                             <textarea 
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none text-white placeholder-slate-600"
                                rows={3}
                                placeholder="Observações (ex: embalagem para presente)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                             ></textarea>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-slate-950">
                    {step === 'cart' ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400">Total Estimado</span>
                                <span className="text-2xl font-bold text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <button
                                onClick={() => setStep('checkout')}
                                className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all transform active:scale-95"
                            >
                                Finalizar Compra
                            </button>
                        </>
                    ) : (
                         <div className="flex gap-3">
                             <button
                                onClick={() => setStep('cart')}
                                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors border border-white/5"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleSendOrder}
                                className="flex-1 py-3.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                Enviar Pedido
                            </button>
                         </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;