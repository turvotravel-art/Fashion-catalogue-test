import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [isLight]);

  return (
    <button 
      onClick={() => setIsLight(!isLight)}
      className="p-2 text-white/70 hover:text-gold transition-colors"
      title="Toggle Theme"
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
