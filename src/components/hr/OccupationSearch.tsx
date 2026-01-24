import React, { useState, useEffect, useRef } from "react";
import { Search, Check, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { searchESCOOccupations, ESCOOccupation, MOCK_ESCO_OCCUPATIONS } from "@/services/taxonomyService";

interface OccupationSearchProps {
  value: { code: string; label: string } | null;
  onChange: (value: { code: string; label: string } | null) => void;
  required?: boolean;
}

export const OccupationSearch: React.FC<OccupationSearchProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ESCOOccupation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
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
        const occupations = await searchESCOOccupations(query);
        setResults(occupations);
        setIsOpen(true);
        setUseFallback(false);
      } catch (err) {
        console.error("ESCO search failed:", err);
        setError("Unable to connect to ESCO API. Using fallback data.");
        // Use mock data as fallback
        const filtered = MOCK_ESCO_OCCUPATIONS.filter((occ) =>
          occ.preferredLabel.en.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelect = (occupation: ESCOOccupation) => {
    onChange({
      code: occupation.code,
      label: occupation.preferredLabel.en,
    });
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setResults([]);
  };

  const handleManualEntry = () => {
    if (query.trim()) {
      onChange({
        code: "MANUAL",
        label: query.trim(),
      });
      setQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor="occupation">
        Job Role / Occupation {required && <span className="text-red-400">*</span>}
      </Label>

      {value ? (
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-2 text-sm">
            <Check className="w-4 h-4 mr-2" />
            {value.label}
            {value.code !== "MANUAL" && (
              <span className="ml-2 text-xs opacity-70">({value.code})</span>
            )}
          </Badge>
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="occupation"
              type="text"
              placeholder="Search for job role (e.g., Software Developer)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              className="pl-10 pr-10"
              required={required}
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
                  <div className="flex-1">
                    <p className="text-xs text-yellow-300">{error}</p>
                    {useFallback && (
                      <p className="text-xs text-slate-400 mt-1">
                        Showing limited results. You can also enter manually.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {results.length === 0 && !isLoading && (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-400 mb-3">No occupations found</p>
                  {query.trim() && (
                    <button
                      type="button"
                      onClick={handleManualEntry}
                      className="text-sm text-primary hover:text-primary/80 underline"
                    >
                      Use "{query}" as custom occupation
                    </button>
                  )}
                </div>
              )}

              {results.map((occupation) => (
                <button
                  key={occupation.uri}
                  type="button"
                  onClick={() => handleSelect(occupation)}
                  className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {occupation.preferredLabel.en}
                      </p>
                      {occupation.iscoGroup && (
                        <p className="text-xs text-slate-400 mt-1">
                          ISCO Group: {occupation.iscoGroup} • Code: {occupation.code}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {results.length > 0 && query.trim() && (
                <button
                  type="button"
                  onClick={handleManualEntry}
                  className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-t border-white/10 text-sm text-slate-300"
                >
                  <span className="text-primary">+ </span>
                  Use "{query}" as custom occupation
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Search from ESCO occupation taxonomy or enter custom role
      </p>
    </div>
  );
};
