"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, GraduationCap, Search } from "lucide-react"; // Using lucide-react for modern icons

interface DropdownJurusanProps {
  selected: string | null;
  onSelect: (j: string) => void;
  jurusanList: string[];
}

function DropdownJurusan({ selected, onSelect, jurusanList }: DropdownJurusanProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  
  const baseButtonClasses = `
    h-12 w-full px-4 rounded-xl flex items-center justify-between gap-2 text-sm
    bg-white text-gray-800 border-2 border-gray-300 transition-all duration-200
    focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm
    hover:border-blue-500
    dark:bg-gray-800 dark:text-gray-50 dark:border-gray-600 dark:focus:ring-blue-900 dark:hover:border-blue-400
  `;

  const menuContainerClasses = `
    absolute z-30 mt-2 rounded-xl shadow-2xl max-h-72 overflow-y-auto border border-gray-200
    bg-white dark:bg-gray-800 dark:border-gray-700
    origin-top transition-all duration-300
    ${open ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}
  `;

  const menuItemClasses = (isSelected: boolean) => `
    w-full text-left px-4 py-2 flex items-center gap-3 transition-colors duration-150 text-sm
    ${isSelected 
        ? "bg-blue-500 text-white font-semibold" 
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
    }
  `;

  return (
    <div className="relative inline-block text-sm font-medium" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={baseButtonClasses}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={`truncate ${selected ? 'font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {selected || <><Search className="inline w-4 h-4 mr-2" /> Pilih Jurusan</>}
        </span>
        <ChevronDown 
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`} 
          aria-hidden="true" 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={menuContainerClasses}
        style={{ width: buttonWidth }}
      >
        <ul role="listbox" className="p-1">
          {jurusanList.map((jur) => {
            const isSelected = jur === selected;
            return (
              <li key={jur} role="option" aria-selected={isSelected}>
                <button
                  onClick={() => {
                    onSelect(jur);
                    setOpen(false);
                  }}
                  className={`${menuItemClasses(isSelected)} rounded-lg`}
                  type="button"
                >
                  {isSelected 
                    ? <Check className="w-4 h-4 text-white" /> 
                    : <GraduationCap className="w-4 h-4" />
                  }
                  {jur}
                </button>
              </li>
            );
          })}
        </ul>
        {jurusanList.length === 0 && (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                Tidak ada pilihan.
            </p>
        )}
      </div>
    </div>
  );
}

export default DropdownJurusan;