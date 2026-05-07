import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';
import { addOrder } from '../mockDb';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onOrderComplete?: () => void;
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onOrderComplete }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleWhatsAppCheckout = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customerName || !customerPhone) return;

    addOrder(
      customerName,
      customerPhone,
      items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total
    );

    const text = `Hello! I would like to order:\n\n${items.map(i => `${i.quantity}x ${i.name} - ₦ ${(i.price * i.quantity).toLocaleString()}`).join('\n')}\n\nTotal: ₦ ${total.toLocaleString()}\n\nMy Details:\nName: ${customerName}\nPhone: ${customerPhone}`;
    
    if (onOrderComplete) onOrderComplete();
    setIsCheckingOut(false);
    onClose();

    window.open(`https://wa.me/2340000000000?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleClose = () => {
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-navy text-white shadow-2xl sm:border-l sm:border-white/5"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-8">
              <h2 className="font-serif text-2xl tracking-[0.1em] text-gold">
                {isCheckingOut ? 'Secure Checkout' : 'Your Cart'}
              </h2>
              <button 
                onClick={handleClose} 
                className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isCheckingOut ? (
              <div className="flex-1 overflow-y-auto p-8">
                <form id="checkout-form" onSubmit={handleWhatsAppCheckout} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="rounded-sm border border-white/10 bg-navy px-4 py-3 text-sm text-white transition-colors focus:border-gold focus:outline-none"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="rounded-sm border border-white/10 bg-navy px-4 py-3 text-sm text-white transition-colors focus:border-gold focus:outline-none"
                      placeholder="08012345678"
                      required
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-6 text-white/30">
                    <ShoppingBag className="h-16 w-16" strokeWidth={1} />
                    <p className="font-sans text-xs tracking-[0.2em] uppercase">Cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <AnimatePresence>
                      {items.map((item) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id} 
                        className="flex gap-6"
                      >
                        <div className="h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-navy-light/50">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-serif text-[1.2rem] tracking-wide text-white/90">{item.name}</h3>
                            <p className="font-sans text-sm font-semibold tracking-wider text-gold">₦ {item.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex w-fit items-center gap-5 rounded-sm border border-white/10 px-4 py-2 mt-auto">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="text-white/40 transition-colors hover:text-gold"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[1.5rem] text-center font-sans text-[13px] font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="text-white/40 transition-colors hover:text-gold"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

            {items.length > 0 && (
              <div className="border-t border-white/5 bg-navy/95 px-8 py-10 backdrop-blur-xl">
                <div className="mb-8 flex justify-between items-baseline">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Subtotal</span>
                  <span className="font-serif text-3xl tracking-wide text-white">₦ {total.toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={handleWhatsAppCheckout} className="group relative flex w-full items-center justify-between overflow-hidden rounded-sm border border-gold px-8 py-5 text-xs font-bold tracking-[0.15em] uppercase transition-colors hover:bg-gold text-gold">
                    <span className="group-hover:text-navy transition-colors">WhatsApp Order</span>
                    <ArrowRight className="h-4 w-4 group-hover:text-navy transition-colors group-hover:translate-x-1" />
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-8 py-5 text-xs font-bold tracking-[0.15em] uppercase text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    Secure Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
