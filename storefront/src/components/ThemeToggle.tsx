import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A premium, animated theme toggle for switching between Light and Dark (Atelier Noir) modes.
 * Features smooth spring animations and theme-aware iconography.
 */
const ThemeToggle: React.FC<{ sidebar?: boolean }> = ({ sidebar = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`
        relative overflow-hidden transition-all duration-500
        ${sidebar 
          ? "w-full h-14 bg-sf-surface border border-sf-outline/10 rounded-2xl flex items-center justify-center gap-4 px-6 group" 
          : "w-10 h-10 rounded-xl bg-sf-surface border border-sf-outline/10 shadow-sm flex items-center justify-center hover:shadow-xl hover:scale-110 active:scale-95"
        }
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
           key={theme}
           initial={{ y: 20, rotate: 180, opacity: 0 }}
           animate={{ y: 0, rotate: 0, opacity: 1 }}
           exit={{ y: -20, rotate: -180, opacity: 0 }}
           transition={{ duration: 0.4, ease: "backOut" }}
           className="flex items-center gap-4"
        >
           {theme === 'light' ? (
             <>
               <Moon size={18} className="text-sf-text" />
               {sidebar && <span className="text-[10px] font-black tracking-widest uppercase">ENABLE ATELIER NOIR</span>}
             </>
           ) : (
             <>
               <Sun size={18} className="text-sf-primary" />
               {sidebar && <span className="text-[10px] font-black tracking-widest uppercase">RESTORE LIGHT ATELIER</span>}
             </>
           )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
