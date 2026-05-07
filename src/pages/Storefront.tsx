import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { ThemeToggle } from '../components/ThemeToggle';
import { Product, CartItem } from '../types';
import { MOCK_DB } from '../mockDb';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594035910387-fea477242680?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop',
];

export function Storefront() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const next = item.quantity + delta;
        return next > 0 ? { ...item, quantity: next } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Available products for the storefront
  const availableProducts = MOCK_DB.products.filter(p => p.isAvailable);

  return (
    <div className="min-h-screen bg-navy selection:bg-gold/30 selection:text-white">
      {/* Navbar */}
      <nav 
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ease-in-out ${
          isScrolled ? 'bg-navy/90 border-b border-white/5 backdrop-blur-md py-4' : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <button className="text-white hover:text-gold transition-colors md:hidden">
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
          
          <div className="hidden items-center gap-10 md:flex">
            <a href="#" className="font-sans text-[11px] font-bold tracking-[0.2em] text-white/90 transition-colors hover:text-gold uppercase">Collections</a>
            <a href="#" className="font-sans text-[11px] font-bold tracking-[0.2em] text-white/90 transition-colors hover:text-gold uppercase">New Arrivals</a>
          </div>

          <a href="#" className="absolute left-1/2 -translate-x-1/2 font-serif text-3xl font-light tracking-[0.15em] text-gold md:text-4xl text-center w-full max-w-[200px]">AURELIA</a>

          <div className="flex items-center gap-8">
            <button className="hidden text-white hover:text-gold transition-colors md:block">
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <ThemeToggle />
            <Link to="/admin/login" className="hidden text-white hover:text-gold transition-colors md:block" title="Admin Login">
              <User className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-gold transition-colors group">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Cinematic Hero Slider */}
        <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-navy">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={currentSlide}
              src={HERO_IMAGES[currentSlide]}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full object-cover origin-center"
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center pt-24">
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              className="mb-6 font-sans text-[11px] font-bold uppercase tracking-[0.4em] text-gold"
            >
              The Masterpiece Collection
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              className="max-w-5xl font-serif text-5xl font-light leading-[1.1] text-[#ffffff] md:text-7xl lg:text-8xl"
            >
              Elegance In Every <span className="italic text-gold-light text-opacity-90">Detail</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-16"
            >
              <button 
                className="group relative overflow-hidden rounded-sm bg-transparent px-10 py-5 font-sans text-[11px] font-bold tracking-[0.2em] text-[#ffffff] border-[#ffffff]/30 uppercase border transition-colors hover:border-gold"
              >
                <div className="absolute inset-0 w-0 bg-gold transition-all duration-500 ease-out group-hover:w-full" />
                <span className="relative z-10 group-hover:text-navy transition-colors duration-500 delay-75">
                  Explore Catalogue
                </span>
              </button>
            </motion.div>
          </div>
          
          <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-[2px] transition-all duration-700 ease-out ${idx === currentSlide ? 'w-12 bg-gold' : 'w-6 bg-white/30 cursor-pointer hover:bg-white/60'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-[1400px] px-4 py-32 sm:px-6 lg:px-12">
          <div className="mb-20 flex flex-col items-center gap-6 text-center">
            <h2 className="font-serif text-4xl text-white md:text-5xl">Featured Objects</h2>
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-gold/50" />
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-gold/80">Curated For You</p>
              <div className="h-px w-8 bg-gold/50" />
            </div>
          </div>

          <div className="columns-2 gap-4 sm:gap-6 md:columns-3 lg:gap-10">
            {availableProducts.map((product) => (
              <div key={product.id} className="mb-6 break-inside-avoid sm:mb-10 w-full overflow-hidden">
                <ProductCard product={product} onAdd={addToCart} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-navy pt-24 pb-12 text-center md:text-left">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-4 lg:px-12 pb-16">
          <div className="col-span-1 lg:col-span-2">
            <h2 className="mb-6 font-serif text-3xl font-light tracking-[0.15em] text-gold text-center md:text-left w-full max-w-[200px] mx-auto md:mx-0">AURELIA</h2>
            <p className="max-w-md font-sans text-sm text-white/50 leading-relaxed tracking-wide mx-auto md:mx-0">
              Redefining luxury through intentional design and uncompromising quality. Each piece is a testament to timeless elegance.
            </p>
          </div>
          <div className="flex flex-col gap-5 mx-auto md:mx-0 w-full md:w-auto items-center md:items-start">
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white">Client Services</h3>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">Contact Us</a>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">Shipping & Returns</a>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">Care Guide</a>
          </div>
          <div className="flex flex-col gap-5 mx-auto md:mx-0 w-full md:w-auto items-center md:items-start">
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white">Follow Us</h3>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">Pinterest</a>
            <a href="#" className="font-sans text-sm text-white/50 hover:text-gold transition-colors">X</a>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-white/30 tracking-widest uppercase font-bold">
          <p>&copy; 2026 Aurelia. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
