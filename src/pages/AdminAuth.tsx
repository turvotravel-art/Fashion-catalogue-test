import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';

interface AdminAuthProps {
  onLogin: () => void;
}

export function AdminAuth({ onLogin }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@demo.com' && password === 'password123') {
      onLogin();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials for demo login. Try admin@demo.com / password123');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 selection:bg-gold/30 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] rounded-lg border border-white/5 bg-navy-light p-8 shadow-2xl"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <Lock className="h-5 w-5 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-light tracking-[0.1em] text-white">Admin Portal</h1>
          <p className="mt-2 text-center font-sans text-xs text-white/50 tracking-wider">
            Sign in to manage inventory and orders
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm border border-white/10 bg-navy px-4 py-3 text-sm text-white transition-colors focus:border-gold focus:outline-none"
              placeholder="admin@demo.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm border border-white/10 bg-navy px-4 py-3 text-sm text-white transition-colors focus:border-gold focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="group mt-4 flex items-center justify-center gap-2 rounded-sm bg-gold px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-navy transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            Authenticate
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 rounded-sm bg-white/5 p-4 text-center font-sans text-[11px] text-white/40">
          Demo Access: <br />
          <span className="font-mono text-white/80">admin@demo.com</span> / <span className="font-mono text-white/80">password123</span>
        </div>
      </motion.div>
    </div>
  );
}
