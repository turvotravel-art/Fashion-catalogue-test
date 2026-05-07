import { X, Download } from 'lucide-react';
import { DbOrder } from '../mockDb';
import { motion, AnimatePresence } from 'motion/react';

interface ReceiptModalProps {
  order: DbOrder | null;
  onClose: () => void;
}

export function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white border border-white/10 shadow-2xl overflow-hidden"
          style={{ color: '#1a1a1a', fontFamily: 'monospace' }}
        >
          {/* Top zig-zag pattern */}
          <div className="w-full overflow-hidden h-3 rotate-180 mb-2">
            <div className="flex" style={{ width: '200%' }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-black/60 rotate-45 transform origin-top-left -ml-1"></div>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors">
            <X className="h-5 w-5" />
          </button>

          <div className="p-8 pt-4 pb-12">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-light tracking-[0.2em] uppercase text-black mb-2">AURELIA</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Digital Receipt</p>
            </div>

            <div className="border-y border-dashed border-gray-300 py-4 mb-6 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>ORDER NO:</span><span className="font-bold text-black">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE:</span><span className="font-bold text-black">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span>CUSTOMER:</span><span className="font-bold text-black">{order.customerName}</span>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <div className="flex-1">Item</div>
                <div className="w-12 text-center">Qty</div>
                <div className="w-24 text-right">Price</div>
              </div>
              
              {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-800">
                  <div className="flex-1 truncate pr-2">{item.name}</div>
                  <div className="w-12 text-center">{item.quantity}</div>
                  <div className="w-24 text-right">₦ {(item.price).toLocaleString()}</div>
                </div>
              )) : (
                <div className="text-sm text-gray-500 text-center italic py-2">Items not recorded</div>
              )}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-black">
                <span>TOTAL</span><span>₦ {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-xs text-gray-500 mb-8 italic">Thank you for your purchase.</p>
              <button 
                onClick={() => window.print()} 
                className="inline-flex items-center gap-2 px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors text-xs tracking-widest uppercase font-bold"
              >
                <Download className="h-4 w-4" /> Save PDF
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
