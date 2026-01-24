import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Briefcase } from "lucide-react";

interface ExperienceInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
}

export const ExperienceInput: React.FC<ExperienceInputProps> = ({
  value,
  onChange,
  label = "Required Experience (Years)",
  required = false,
}) => {
  const [error, setError] = useState<string>("");

  const handleChange = (newValue: string) => {
    const num = parseInt(newValue) || 0;
    
    // Validate
    if (num < 0) {
      setError("Experience cannot be negative");
      return;
    }
    
    if (num > 30) {
      setError("Experience cannot exceed 30 years");
      return;
    }
    
    setError("");
    onChange(num);
  };

  const increment = () => {
    if (value < 30) {
      onChange(value + 1);
      setError("");
    }
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
      setError("");
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="experience" className="flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-orange-400" />
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={decrement}
          disabled={value <= 0}
          className="h-10 w-10 p-0 border-white/10 hover:bg-white/5"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {/* Numeric Input */}
        <div className="flex-1">
          <Input
            id="experience"
            type="number"
            min="0"
            max="30"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className={`text-center ${error ? "border-red-500" : ""}`}
            placeholder="0"
          />
        </div>

        {/* Increment Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={increment}
          disabled={value >= 30}
          className="h-10 w-10 p-0 border-white/10 hover:bg-white/5"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-slate-400">
          {value === 0 
            ? "No experience required - suitable for entry-level positions" 
            : `Minimum ${value} year${value !== 1 ? "s" : ""} of professional experience required`}
        </p>
      )}

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { onChange(0); setError(""); }}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            value === 0 
              ? "border-primary bg-primary/20 text-primary" 
              : "border-white/10 text-slate-400 hover:border-white/20"
          }`}
        >
          Entry Level
        </button>
        <button
          type="button"
          onClick={() => { onChange(2); setError(""); }}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            value === 2 
              ? "border-primary bg-primary/20 text-primary" 
              : "border-white/10 text-slate-400 hover:border-white/20"
          }`}
        >
          2 years
        </button>
        <button
          type="button"
          onClick={() => { onChange(5); setError(""); }}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            value === 5 
              ? "border-primary bg-primary/20 text-primary" 
              : "border-white/10 text-slate-400 hover:border-white/20"
          }`}
        >
          5 years
        </button>
        <button
          type="button"
          onClick={() => { onChange(7); setError(""); }}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            value === 7 
              ? "border-primary bg-primary/20 text-primary" 
              : "border-white/10 text-slate-400 hover:border-white/20"
          }`}
        >
          7+ years
        </button>
      </div>
    </div>
  );
};
