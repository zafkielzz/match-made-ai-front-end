import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, AlertCircle, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { searchVSICIndustries, VSICIndustry, MOCK_VSIC_INDUSTRIES } from "@/services/taxonomyService";

interface IndustryValue {
  code: string;
  label: string;
  version: string;
}

interface IndustryMultiSelectProps {
  value: IndustryValue[];
  onChange: (value: IndustryValue[]) => void;
  required?: boolean;
  version?: string;
}

export const IndustryMultiSelect: React.FC<IndustryMultiSelectProps> = ({
  value,
  onChange,
  required = false,
  version = "2018",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VSICIndustry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const industries = await searchVSICIndustries(query, version);
        setResults(industries);
        setIsOpen(true);
      } catch (err) {
        console.error("VSIC search failed:", err);
        setError("Unable to connect to VSIC API. Using fallback data.");
        // Use mock data as fallback
        const filtered = MOCK_VSIC_INDUSTRIES.filter((ind) =>
          ind.label.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, version]);

  const handleSelect = (industry: VSICIndustry) => {
    // Check if already selected
    if (value.some((v) => v.code === industry.code)) {
      return;
    }

    onChange([
      ...value,
      {
        code: industry.code,
        label: industry.label,
        version: industry.version,
      },
    ]);
    setQuery("");
    setIsOpen(false);
  };

  const handleRemove = (code: string) => {
    onChange(value.filter((v) => v.code !== code));
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor="industry">
        Industry {required && <span className="text-red-400">*</span>}
      </Label>

      {/* Selected Industries */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((industry) => (
            <Badge
              key={industry.code}
              className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1.5 text-sm"
            >
              <Building2 className="w-3 h-3 mr-1.5" />
              {industry.label}
              <span className="ml-1.5 text-xs opacity-70">({industry.code})</span>
              <button
                type="button"
                onClick={() => handleRemove(industry.code)}
                className="ml-2 hover:text-white transition"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            id="industry"
            type="text"
            placeholder="Search for industries (e.g., Software Development)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            className="pl-10 pr-10"
            required={required && value.length === 0}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-white/10 rounded-lg shadow-2xl z-[100] max-h-80 overflow-y-auto">
            {error && (
              <div className="p-3 bg-yellow-500/10 border-b border-yellow-500/20 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-300 flex-1">{error}</p>
              </div>
            )}

            {results.length === 0 && !isLoading && (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-400">No industries found</p>
              </div>
            )}

            {results.map((industry) => {
              const isSelected = value.some((v) => v.code === industry.code);

              return (
                <button
                  key={industry.code}
                  type="button"
                  onClick={() => !isSelected && handleSelect(industry)}
                  disabled={isSelected}
                  className={`
                    w-full px-4 py-3 text-left transition-colors border-b border-white/5 last:border-b-0
                    ${isSelected 
                      ? "bg-primary/10 cursor-not-allowed opacity-50" 
                      : "hover:bg-white/5 cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {industry.label}
                        {isSelected && (
                          <span className="ml-2 text-xs text-green-400">✓ Selected</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Code: {industry.code}
                        {industry.level && ` • Level ${industry.level}`}
                        {industry.parentCode && ` • Parent: ${industry.parentCode}`}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Search and select multiple industries from VSIC {version} taxonomy
      </p>
    </div>
  );
};
