import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, ShoppingCart, TrendingUp, Settings, LogOut, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product, CartItem } from '../types';
import { MOCK_DB, DbOrder, addOrder } from '../mockDb';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { ReceiptModal } from '../components/ReceiptModal';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'customers'>('inventory');
  const [products, setProducts] = useState(MOCK_DB.products);
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const navigate = useNavigate();

  const handleToggleAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  const estimatedProfit = MOCK_DB.orders.reduce((acc, order) => {
    const orderCost = order.items.reduce((costAcc, item) => {
      const product = MOCK_DB.products.find(p => p.name === item.name);
      return costAcc + (product?.costPrice || item.price * 0.4) * item.quantity;
    }, 0);
    return acc + (order.totalAmount - orderCost);
  }, 0);

  const handleLogout = () => {
    // Ideally this would clear auth state globally
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-navy selection:bg-gold/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-navy-light hidden md:flex flex-col">
        <div className="flex h-20 items-center px-8 border-b border-white/5">
          <Link to="/" className="font-serif text-xl font-light tracking-[0.15em] text-gold">AURELIA</Link>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-8">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex w-full items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs tracking-wider transition-colors ${activeTab === 'inventory' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <Package className="h-4 w-4" />
            Inventory Manager
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex w-full items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs tracking-wider transition-colors ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Order Tracker
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex w-full items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs tracking-wider transition-colors ${activeTab === 'customers' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <User className="h-4 w-4" />
            Customer Directory
          </button>
        </nav>

        <div className="border-t border-white/5 p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-4 py-3 font-sans text-xs tracking-wider text-red-400/80 transition-colors hover:bg-red-400/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-navy px-8 shadow-sm">
          <h1 className="font-serif text-2xl tracking-[0.05em] text-white">
            {activeTab === 'inventory' ? 'Inventory' : activeTab === 'orders' ? 'Orders' : 'Customer Directory'}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
              <span className="text-xs font-bold text-gold">A</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            
            {/* Sales Analytics Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-between rounded-lg border border-white/5 bg-navy-light p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Total Sales</span>
                  <div className="rounded-full bg-gold/10 p-2 text-gold">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-3xl text-white">₦ {(MOCK_DB.analytics.totalSalesThisMonth / 1000000).toFixed(1)}M</h3>
                    <p className="font-sans text-xs text-white/40 mt-1">This Month</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col justify-between rounded-lg border border-white/5 bg-navy-light p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Most Popular</span>
                  <div className="rounded-full bg-gold/10 p-2 text-gold">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white line-clamp-1">{MOCK_DB.analytics.mostPopularProduct}</h3>
                  <p className="font-sans text-xs text-white/40 mt-2">Highest sales volume</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:flex flex-col justify-between rounded-lg border border-white/5 bg-navy-light p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Estimated Profit</span>
                  <div className="rounded-full bg-gold/10 p-2 text-gold">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-3xl text-gold">₦ {(estimatedProfit / 1000000).toFixed(2)}M</h3>
                  <p className="font-sans text-xs text-white/40 mt-1">Based on COGS</p>
                </div>
              </motion.div>
            </div>

            {/* Main Tabs Content */}
            {activeTab === 'inventory' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-white/5 bg-navy-light overflow-hidden"
              >
                <div className="p-6 border-b border-white/5">
                  <h2 className="font-serif text-xl text-white">Product Inventory</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm text-white/80">
                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-center">Stock</th>
                        <th className="px-6 py-4 text-right">Availability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((product) => (
                        <tr key={product.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={product.image} alt={product.name} className="h-10 w-10 rounded-sm object-cover bg-navy/50" />
                              <span className="font-serif text-base tracking-wide text-white">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/60">{product.category}</td>
                          <td className="px-6 py-4 text-gold">₦ {product.price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center min-w-[2.5rem] rounded-full px-2 py-1 text-xs font-semibold ${product.stock <= 5 ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-white/90'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleToggleAvailability(product.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${product.isAvailable ? 'bg-gold' : 'bg-white/20'}`}
                            >
                              <span className="sr-only">Toggle availability</span>
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-navy shadow transition duration-200 ease-in-out ${product.isAvailable ? 'translate-x-2' : '-translate-x-2'}`}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : activeTab === 'orders' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-white/5 bg-navy-light overflow-hidden"
              >
                <div className="p-6 border-b border-white/5">
                  <h2 className="font-serif text-xl text-white">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm text-white/80">
                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4 text-center">Receipt</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MOCK_DB.orders.map((order) => (
                        <tr key={order.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4 font-mono text-xs text-white/60">{order.id}</td>
                          <td className="px-6 py-4 font-serif text-base tracking-wide text-white">{order.customerName}</td>
                          <td className="px-6 py-4 text-white/60">{order.date}</td>
                          <td className="px-6 py-4 text-gold">₦ {order.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            {order.status === 'Paid' && (
                              <button onClick={() => setSelectedOrder(order)} className="text-xs tracking-widest text-gold hover:text-white uppercase font-bold border border-gold/30 rounded-sm px-3 py-1">View</button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                              order.status === 'Paid' ? 'bg-gold/10 text-gold border border-gold/20' : 
                              'bg-white/10 text-white/60 border border-white/10'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-white/5 bg-navy-light overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h2 className="font-serif text-xl text-white">Customer CRM</h2>
                  <button onClick={(e) => {
                    const str = MOCK_DB.customers.map(c => c.phone).join(', ');
                    navigator.clipboard.writeText(str);
                    const btn = e.currentTarget;
                    const originalText = btn.innerText;
                    btn.innerText = 'COPIED!';
                    setTimeout(() => btn.innerText = originalText, 2000);
                  }} className="text-xs uppercase tracking-widest bg-gold text-navy font-bold px-4 py-2 hover:bg-gold-light rounded-sm transition-colors">
                    Copy WhatsApp #s
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm text-white/80">
                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Phone Number</th>
                        <th className="px-6 py-4 text-center">Orders</th>
                        <th className="px-6 py-4 text-right">LTV (Spend)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {MOCK_DB.customers.map((customer) => (
                        <tr key={customer.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4 font-serif text-base tracking-wide text-white">{customer.name}</td>
                          <td className="px-6 py-4 text-white/60">{customer.phone}</td>
                          <td className="px-6 py-4 text-center text-white/80">{customer.ordersCount}</td>
                          <td className="px-6 py-4 text-right text-gold">₦ {customer.totalSpend.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>

      <ReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
