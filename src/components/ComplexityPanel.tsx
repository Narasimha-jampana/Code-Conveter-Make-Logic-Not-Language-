import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, HardDrive, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface ComplexityInfo {
  timeComplexity: string;
  spaceComplexity: string;
  linesOfCode: number;
}

interface ComplexityPanelProps {
  source: ComplexityInfo | null;
  target: ComplexityInfo | null;
  visible: boolean;
}

export function ComplexityPanel({ source, target, visible }: ComplexityPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: 20 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="glass-premium rounded-[24px] p-6 border border-white/5 relative bg-white/2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <h3 className="heading-premium font-mono text-sm uppercase tracking-[0.2em] font-black">LOGIC_METRICS_DASHBOARD</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Analysis Engine Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ComplexityGauge
                label="Time_Complexity"
                icon={Clock}
                sourceValue={source?.timeComplexity}
                targetValue={target?.timeComplexity}
              />
              <ComplexityGauge
                label="Space_Complexity"
                icon={HardDrive}
                sourceValue={source?.spaceComplexity}
                targetValue={target?.spaceComplexity}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-5 border border-white/5 relative group bg-black/40"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/5 border border-accent/10">
                    <Activity className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Source_v_Target_Lines</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">SRC</span>
                    <p className="text-xl font-mono text-foreground font-black tracking-tighter">{source?.linesOfCode ?? "00"}</p>
                  </div>
                  <div className="h-8 w-px bg-white/5 mx-4" />
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">TRGT</span>
                    <p className="text-xl font-mono text-primary font-black tracking-tighter">{target?.linesOfCode ?? "00"}</p>
                  </div>
                </div>

                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-gradient-to-r from-accent to-primary"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ComplexityGauge({ label, icon: Icon, sourceValue, targetValue }: {
  label: string;
  icon: typeof Activity;
  sourceValue?: string;
  targetValue?: string;
}) {
  const match = sourceValue && targetValue && sourceValue === targetValue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-5 border border-white/5 relative group bg-black/40"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/5 border border-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">{label}</span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest mb-1">Delta_Mapping</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground/60 font-medium">{sourceValue || "N/A"}</span>
            <ArrowRight className="w-3 h-3 text-white/20" />
            <span className={`text-lg font-mono font-black tracking-tighter ${match ? "text-primary" : "text-warning"}`}>
              {targetValue || "N/A"}
            </span>
          </div>
        </div>
        {match && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-mono text-primary font-black uppercase tracking-widest">LOGIC_STABLE</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
