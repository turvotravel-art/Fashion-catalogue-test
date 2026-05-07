import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group relative flex flex-col gap-4"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-navy-light/30 sm:rounded-sm">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <button
          onClick={() => onAdd(product)}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 translate-y-8 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-gold px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-navy opacity-0 shadow-2xl transition-all duration-500 hover:bg-gold-light group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Quick Add
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-2 px-2 text-center sm:px-0">
        <h3 className="font-serif text-xl tracking-wide text-white/90">{product.name}</h3>
        <p className="font-sans text-sm font-semibold tracking-[0.1em] text-gold">₦ {product.price.toLocaleString()}</p>
      </div>
    </motion.div>
  );
}
