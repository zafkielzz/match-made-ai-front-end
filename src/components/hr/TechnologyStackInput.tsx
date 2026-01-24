import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Award } from "lucide-react";

export type TechProficiency = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export interface TechCertificate {
  name: string;
  level?: string; // e.g., "Associate", "Professional"
}

export interface TechnologyItem {
  name: string;
  proficiency?: TechProficiency;
  certificate?: TechCertificate;
}

interface TechnologyStackInputProps {
  label: string;
  value: TechnologyItem[];
  onChange: (value: TechnologyItem[]) => void;
  suggestions?: string[];
  placeholder?: string;
  helperText?: string;
}

export const TechnologyStackInput: React.FC<TechnologyStackInputProps> = ({
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter",
  helperText,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Check if already exists
    if (value.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange([...value, { name: trimmed }]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (value.some((item) => item.name.toLowerCase() === suggestion.toLowerCase())) {
      return;
    }
    onChange([...value, { name: suggestion }]);
  };

  const updateItem = (index: number, updates: Partial<TechnologyItem>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const formatProficiency = (level?: TechProficiency): string => {
    if (!level) return "";
    const map: Record<TechProficiency, string> = {
      BASIC: "Basic",
      INTERMEDIATE: "Intermediate",
      ADVANCED: "Advanced",
    };
    return map[level];
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={label}>{label}</Label>
        {helperText && <p className="text-xs text-slate-400 mt-1">{helperText}</p>}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          variant="outline"
          className="border-white/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter(
              (s) => !value.some((item) => item.name.toLowerCase() === s.toLowerCase())
            )
            .slice(0, 8)
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-white/10 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}

      {/* Technology Items */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg border border-white/10 p-3"
              >
                {/* Main Display */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {item.name}
                    </Badge>
                    {item.proficiency && (
                      <span className="text-xs text-slate-400">
                        {formatProficiency(item.proficiency)}
                      </span>
                    )}
                    {item.certificate && (
                      <div className="flex items-center gap-1 text-xs text-blue-300">
                        <Award className="w-3 h-3" />
                        <span>
                          {item.certificate.name}
                          {item.certificate.level && ` (${item.certificate.level})`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {isEditing ? "Done" : "Details"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                    <p className="text-xs text-slate-400">
                      Optional: Add proficiency level and certification
                    </p>

                    {/* Proficiency */}
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        Proficiency Level
                      </Label>
                      <Select
                        value={item.proficiency || ""}
                        onValueChange={(v) =>
                          updateItem(index, {
                            proficiency: v ? (v as TechProficiency) : undefined,
                          })
                        }
                      >
                        <SelectTrigger className="bg-background border-white/10">
                          <SelectValue placeholder="Select proficiency (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 z-[200]">
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Certificate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">
                          Certificate Name
                        </Label>
                        <Input
                          value={item.certificate?.name || ""}
                          onChange={(e) =>
                            updateItem(index, {
                              certificate: e.target.value
                                ? {
                                    name: e.target.value,
                                    level: item.certificate?.level,
                                  }
                                : undefined,
                            })
                          }
                          placeholder="e.g. AWS Solutions Architect"
                          className="bg-background border-white/10"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">
                          Certificate Level
                        </Label>
                        <Input
                          value={item.certificate?.level || ""}
                          onChange={(e) =>
                            updateItem(index, {
                              certificate: item.certificate?.name
                                ? {
                                    name: item.certificate.name,
                                    level: e.target.value,
                                  }
                                : undefined,
                            })
                          }
                          placeholder="e.g. Associate, Professional"
                          className="bg-background border-white/10"
                          disabled={!item.certificate?.name}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-slate-400">
          {value.length} technolog{value.length !== 1 ? "ies" : "y"} added
        </p>
      )}
    </div>
  );
};
