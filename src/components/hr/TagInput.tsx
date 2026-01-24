import React, { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  helperText?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  suggestions = [],
  helperText,
}) => {
  const [currentInput, setCurrentInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !value.includes(s) &&
      s.toLowerCase().includes(currentInput.toLowerCase())
  );

  const handleAdd = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCurrentInput("");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentInput.trim()) {
        handleAdd(currentInput);
      }
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      if (currentInput.trim()) {
        handleAdd(currentInput);
      }
    }
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="ml-2 hover:text-white transition"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={currentInput}
            onChange={(e) => {
              setCurrentInput(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => currentInput.length > 0 && setShowSuggestions(true)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => handleAdd(currentInput)}
            disabled={!currentInput.trim()}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-white/10 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAdd(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition border-b border-white/5 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
