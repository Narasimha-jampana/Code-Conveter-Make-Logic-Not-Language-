import { motion } from "framer-motion";
import { Terminal, Shield, Wifi, WifiOff } from "lucide-react";

interface StatusBarProps {
  status: "idle" | "translating" | "success" | "error";
  message?: string;
  isOnline: boolean;
}

export function StatusBar({ status, message, isOnline }: StatusBarProps) {
  return (
    <footer className="h-8 flex items-center justify-between px-6 border-t border-white/5 bg-black relative z-40 overflow-hidden">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            status === "translating" ? "bg-primary animate-pulse shadow-[0_0_8px_#00ffff]" :
            status === "success" ? "bg-primary" :
            status === "error" ? "bg-destructive shadow-[0_0_8px_#ff0000]" :
            "bg-white/10"
          }`} />
          <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-[0.2em]">
            SYSTEM_{status.toUpperCase()}
          </span>
        </div>
        
        {message && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-[9px] font-mono uppercase tracking-[0.1em] ${
              status === "success" ? "text-primary/60" :
              status === "error" ? "text-destructive/60" :
              "text-muted-foreground/40"
            }`}
          >
            {message}
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-6 text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-[0.15em]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          <span>ENCD: UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>SEC: ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-3 py-1 px-3 rounded-full bg-white/2 border border-white/5">
          <span className="text-muted-foreground/60">{isOnline ? "CLOUD_ENGINE" : "LOCAL_CORE"}</span>
          <div className={`w-1 h-1 rounded-full ${isOnline ? "bg-primary" : "bg-warning"} animate-pulse`} />
        </div>
      </div>
    </footer>
  );
}
