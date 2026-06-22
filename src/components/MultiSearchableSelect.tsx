import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface SearchableSelectProps {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  allowCustom?: boolean;
  placeholder?: string;
  className?: string;
}

export const MultiSearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  allowCustom = false,
  placeholder = "ابحث...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // limit to 50 for performance and as requested (short list)

  const handleSelect = (opt: string) => {
    if (multiple) {
      let currentVal = value ? (typeof value === "string" ? value.split(",") : value) : [];
      if (currentVal.includes(opt)) {
        currentVal = currentVal.filter((v: string) => v !== opt);
      } else {
        currentVal = [...currentVal, opt];
      }
      onChange(currentVal.join(","));
      // don't close on multi-select
    } else {
      onChange(opt);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const removeValue = (opt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      let currentVal = value ? (typeof value === "string" ? value.split(",") : value) : [];
      currentVal = currentVal.filter((v: string) => v !== opt);
      onChange(currentVal.join(","));
    }
  };

  const displayValue = () => {
    if (multiple) {
      const vals = value ? (typeof value === "string" ? value.split(",").filter(Boolean) : value) : [];
      if (vals.length === 0) return <span className="text-slate-400">{placeholder}</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {(vals as string[]).map((v, i) => (
            <span key={i} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">
              {v}
              <button type="button" onClick={(e) => removeValue(v, e)} className="hover:text-red-500">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      );
    } else {
      return value ? <span className="text-navy dark:text-white truncate block">{value as string}</span> : <span className="text-slate-400">{placeholder}</span>;
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div 
        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer flex items-center justify-between min-h-[56px] transition-all hover:border-primary focus:ring-4 focus:ring-primary/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 overflow-hidden pr-2">
          {displayValue()}
        </div>
        <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text"
              autoFocus
              className="w-full bg-transparent border-none outline-none text-sm text-navy dark:text-white"
              placeholder="ابحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => {
                const isSelected = multiple 
                  ? (value ? (typeof value === "string" ? value.split(",") : value).includes(opt) : false)
                  : value === opt;
                
                return (
                  <div 
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? "bg-primary/10 text-primary font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
                  >
                    {opt}
                    {isSelected && <Check size={16} className="text-primary" />}
                  </div>
                );
              })
            ) : (
              !allowCustom && <div className="p-3 text-center text-sm text-slate-400">لا توجد نتائج</div>
            )}
            
            {allowCustom && searchTerm.trim() !== "" && !options.some(opt => opt.toLowerCase() === searchTerm.trim().toLowerCase()) && (
              <div 
                onClick={() => handleSelect(searchTerm.trim())}
                className="px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between text-primary font-bold hover:bg-primary/10 transition-colors mt-1 border-t border-slate-100 dark:border-slate-700"
              >
                <span>{searchTerm.trim()}</span>
                <Check size={16} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
