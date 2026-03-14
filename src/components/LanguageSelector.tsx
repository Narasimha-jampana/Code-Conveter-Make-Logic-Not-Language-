import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#",
  "Go", "Rust", "Ruby", "Swift", "Kotlin", "PHP", "Scala", "Haskell",
];

const LANG_ICONS: Record<string, string> = {
  Python: "🐍", JavaScript: "⚡", TypeScript: "🔷", Java: "☕", C: "⚙️",
  "C++": "🔧", "C#": "🎯", Go: "🐹", Rust: "🦀", Ruby: "💎",
  Swift: "🕊️", Kotlin: "🟣", PHP: "🐘", Scala: "🔴", Haskell: "λ",
};

interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (lang: string) => void;
}

export function LanguageSelector({ label, value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em]">{label}</span>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-secondary/80 border border-border rounded-lg px-3 py-2 pl-8 pr-8 text-xs font-mono text-foreground cursor-pointer hover:bg-muted hover:border-muted-foreground/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none">
          {LANG_ICONS[value] || "📄"}
        </span>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
      </div>
    </div>
  );
}
