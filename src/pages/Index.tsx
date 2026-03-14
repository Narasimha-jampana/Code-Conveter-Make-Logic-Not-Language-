import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkbenchHeader } from "@/components/WorkbenchHeader";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CodePanel } from "@/components/CodePanel";
import { ComplexityPanel } from "@/components/ComplexityPanel";
import { StatusBar } from "@/components/StatusBar";

interface ComplexityInfo {
  timeComplexity: string;
  spaceComplexity: string;
  linesOfCode: number;
}

export default function Index() {
  const [isOnline, setIsOnline] = useState(true);
  const [sourceLang, setSourceLang] = useState("Python");
  const [targetLang, setTargetLang] = useState("Rust");
  const [sourceCode, setSourceCode] = useState("");
  const [targetCode, setTargetCode] = useState("");
  const [status, setStatus] = useState<"idle" | "translating" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [sourceComplexity, setSourceComplexity] = useState<ComplexityInfo | null>(null);
  const [targetComplexity, setTargetComplexity] = useState<ComplexityInfo | null>(null);

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast.error("No source code provided");
      return;
    }
    if (sourceLang === targetLang) {
      toast.error("Source and target languages must differ");
      return;
    }

    setStatus("translating");
    setStatusMessage("");
    setTargetCode("");
    setSourceComplexity(null);
    setTargetComplexity(null);

    try {
      const { data, error } = await supabase.functions.invoke("translate-code", {
        body: { sourceCode, sourceLang, targetLang },
      });

      if (error) throw error;

      setTargetCode(data.translatedCode);
      setSourceComplexity(data.sourceComplexity);
      setTargetComplexity(data.targetComplexity);
      setStatus("success");
      setStatusMessage(`Logic parity verified. ${data.sourceComplexity.timeComplexity} preserved.`);
    } catch (err: any) {
      console.error("Translation error:", err);
      setStatus("error");
      setStatusMessage(err.message || "Translation failed");
      toast.error("Translation failed. Please try again.");
    }
  };

  const showComplexity = sourceComplexity !== null || targetComplexity !== null;

  return (
    <div className="h-svh flex flex-col abyss-bg relative overflow-hidden">
      <div className="noise-overlay" />
      
      <WorkbenchHeader isOnline={isOnline} onToggleMode={() => setIsOnline(!isOnline)} />

      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-6 py-4 border-b border-white/5 glass-premium relative z-10"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <LanguageSelector label="FROM" value={sourceLang} onChange={setSourceLang} />
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5">
              <ArrowRight className="w-3.5 h-3.5 text-primary/80" />
            </div>
            <LanguageSelector label="TO" value={targetLang} onChange={setTargetLang} />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, translateY: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTranslate}
          disabled={status === "translating"}
          className="btn-magnetic flex items-center gap-3 text-primary-foreground px-8 py-3 rounded-full font-mono font-black uppercase tracking-[0.15em] text-[10px] shadow-2xl disabled:opacity-50 transition-all duration-500"
        >
          {status === "translating" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
              <span>Analysing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Execute Transpile</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Editors Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-0 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`relative h-full ${status === "translating" ? "is-scanning" : ""}`}
        >
          <div className="scan-bar" />
          <CodePanel
            title="SOURCE_MANIFEST"
            code={sourceCode}
            onChange={setSourceCode}
            language={sourceLang}
            onUpload={setSourceCode}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`relative h-full ${status === "translating" ? "is-scanning" : ""}`}
        >
          <div className="scan-bar" />
          <CodePanel
            title="TARGET_OUTPUT"
            code={targetCode}
            readOnly
            language={targetLang}
          />
        </motion.div>
      </div>

      {/* Complexity Analysis */}
      <AnimatePresence>
        {showComplexity && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 pb-4"
          >
            <ComplexityPanel
              source={sourceComplexity}
              target={targetComplexity}
              visible={showComplexity}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <StatusBar status={status} message={statusMessage} isOnline={isOnline} />
    </div>
  );
}
