import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Location {
  city: string;
  country: string;
  code?: string;
}

interface LocationSearchProps {
  value: Location | null;
  onChange: (value: Location | null) => void;
  required?: boolean;
}

// Mock location data - replace with real API
const MOCK_LOCATIONS = [
  { city: "Ho Chi Minh City", country: "Vietnam", code: "VN-SG" },
  { city: "Hanoi", country: "Vietnam", code: "VN-HN" },
  { city: "Da Nang", country: "Vietnam", code: "VN-DN" },
  { city: "Singapore", country: "Singapore", code: "SG" },
  { city: "Bangkok", country: "Thailand", code: "TH-BKK" },
  { city: "Kuala Lumpur", country: "Malaysia", code: "MY-KL" },
  { city: "Jakarta", country: "Indonesia", code: "ID-JK" },
  { city: "Manila", country: "Philippines", code: "PH-MNL" },
  { city: "Remote", country: "Global", code: "REMOTE" },
];

export const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

    debounceTimer.current = setTimeout(() => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const filtered = MOCK_LOCATIONS.filter(
          (loc) =>
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.country.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
        setIsLoading(false);
      }, 200);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelect = (location: Location) => {
    onChange(location);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor="location">
        Job Location {required && <span className="text-red-400">*</span>}
      </Label>

      {value ? (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-2 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {value.city}, {value.country}
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
              id="location"
              type="text"
              placeholder="Search city or country..."
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
              {results.length === 0 && !isLoading && (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-400">No locations found</p>
                </div>
              )}

              {results.map((location) => (
                <button
                  key={location.code}
                  type="button"
                  onClick={() => handleSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {location.city}
                      </p>
                      <p className="text-xs text-slate-400">{location.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Search for city or select "Remote" for remote positions
      </p>
    </div>
  );
};
