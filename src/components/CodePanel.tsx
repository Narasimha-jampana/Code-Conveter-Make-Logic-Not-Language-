import { useRef } from "react";
import { Copy, Download, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CodePanelProps {
  title: string;
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  language: string;
  onUpload?: (code: string) => void;
}

export function CodePanel({ title, code, onChange, readOnly = false, language, onUpload }: CodePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = getExtension(language);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translated.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onUpload?.(text);
    };
    reader.readAsText(file);
  };

  const lines = code ? code.split("\n") : [""];

  return (
    <div className="flex flex-col h-full glass-card rounded-[24px] overflow-hidden group border border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10 bg-white/2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-[0_0_8px_#FF5F5644]" />
            <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_#FFBD2E44]" />
            <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_8px_#27C93F44]" />
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{title}</span>
          <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary font-bold uppercase tracking-widest">
            {language}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {!readOnly && onUpload && (
            <>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.js,.ts,.py,.java,.c,.cpp,.go,.rs,.rb,.swift,.kt,.php,.scala,.hs,.cs" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-muted-foreground/60 hover:text-primary transition-all duration-300"
                title="Upload file"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={handleCopy}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-muted-foreground/60 hover:text-primary transition-all duration-300"
            title="Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {readOnly && code && (
            <button
              onClick={handleDownload}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-muted-foreground/60 hover:text-primary transition-all duration-300"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 relative overflow-hidden bg-black/20">
        <div className="absolute inset-0 dot-grid-premium opacity-40 pointer-events-none" />
        
        {/* Line numbers with depth */}
        <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-white/5 flex flex-col items-end pr-4 pt-6 gap-0 overflow-hidden select-none bg-black/40 backdrop-blur-sm">
          {lines.map((_, i) => (
            <span key={i} className="text-[10px] font-mono text-muted-foreground/20 leading-[1.75rem] tabular-nums">
              {(i + 1).toString().padStart(2, '0')}
            </span>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full h-full bg-transparent resize-none p-6 pl-[5.5rem] text-[13px] code-font text-foreground/90 leading-7 focus:outline-none placeholder:text-muted-foreground/10 tracking-tight"
          placeholder={readOnly ? "// Waiting for neural sequence..." : "// Input logic here..."}
        />

        {/* Dynamic Glow FX */}
        {!code && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-primary/2 blur-[100px] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

function getExtension(lang: string): string {
  const map: Record<string, string> = {
    Python: "py", JavaScript: "js", TypeScript: "ts", Java: "java",
    C: "c", "C++": "cpp", "C#": "cs", Go: "go", Rust: "rs",
    Ruby: "rb", Swift: "swift", Kotlin: "kt", PHP: "php",
    Scala: "scala", Haskell: "hs",
  };
  return map[lang] || "txt";
}
