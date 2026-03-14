import { motion } from "framer-motion";
import { Wifi, WifiOff, Zap, Terminal, Shield } from "lucide-react";

interface WorkbenchHeaderProps {
  isOnline: boolean;
  onToggleMode: () => void;
}

export function WorkbenchHeader({ isOnline, onToggleMode }: WorkbenchHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 glass-premium relative z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Terminal className="w-5 h-5 text-primary relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="heading-premium text-lg leading-none font-black tracking-tighter">
              SYSTEM.CORE
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em]">
                Neural Transpiler v4.0
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <Shield className="w-3 h-3 text-primary/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">
              High-Precision Engine
            </span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span>Lat: 12ms</span>
            <span className="text-white/20">•</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMode}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
            isOnline
              ? "border-primary/20 bg-primary/5 text-primary shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Network Active</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary relative">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Core</span>
              <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
            </>
          )}
        </motion.button>
      </div>
    </header>
  );
}
