import React, { useState, KeyboardEvent } from "react";
import { Plus, X, GripVertical, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { validateBulletItem } from "@/utils/jobValidation";

interface BulletListInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  minItems?: number;
  helperText?: string;
  showExamples?: boolean;
  exampleItems?: string[];
}

export const BulletListInput: React.FC<BulletListInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter item and press Enter",
  required = false,
  minItems = 0,
  helperText,
  showExamples = false,
  exampleItems = [],
}) => {
  const [currentInput, setCurrentInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;
    
    // Validate the item
    const validation = validateBulletItem(trimmed, 20);
    if (!validation.valid) {
      setInputError(validation.error || "Invalid item");
      return;
    }
    
    // Check for duplicates
    if (value.includes(trimmed)) {
      setInputError("This item already exists");
      return;
    }
    
    onChange([...value, trimmed]);
    setCurrentInput("");
    setInputError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    // Clear error when user starts typing
    if (inputError) setInputError(null);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newValue = [...value];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= value.length) return;

    [newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]];
    onChange(newValue);
  };

  const isValid = !required || value.length >= minItems;

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-400">*</span>}
        {minItems > 0 && (
          <span className="text-xs text-slate-400 ml-2">
            (min {minItems} {minItems === 1 ? "item" : "items"})
          </span>
        )}
      </Label>

      {/* Examples */}
      {showExamples && exampleItems.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-300 font-medium mb-2">Examples:</p>
          <ul className="space-y-1">
            {exampleItems.map((example, idx) => (
              <li key={idx} className="text-xs text-blue-200 flex items-start gap-1">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Existing Items */}
      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-black/30 rounded-lg p-3 border border-white/10 group hover:border-white/20 transition"
            >
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => handleMove(index, "up")}
                  disabled={index === 0}
                  className="text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="text-primary mr-2">•</span>
                  {item}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-slate-400 hover:text-red-400 transition flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Item */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`flex-1 ${inputError ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!currentInput.trim()}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Input Error */}
        {inputError && (
          <div className="flex items-start gap-1 text-red-400">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p className="text-xs">{inputError}</p>
          </div>
        )}
      </div>

      {/* Helper Text & Validation */}
      <div className="flex items-start justify-between gap-2">
        {helperText && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {!isValid && (
          <p className="text-xs text-red-400">
            Please add at least {minItems} {minItems === 1 ? "item" : "items"}
          </p>
        )}
        {value.length > 0 && (
          <p className="text-xs text-slate-500">
            {value.length} {value.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>
      
      {/* Why This Matters */}
      {label.includes("Responsibilities") || label.includes("Requirements") ? (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
          <p className="text-xs text-purple-300 flex items-start gap-1">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Why this matters:</strong> Detailed {label.toLowerCase()} enable better AI matching 
              between candidate skills and job requirements.
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
};
