import React, { useState } from "react";
import { Check, Gift, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Benefit {
  id: string;
  label: string;
  icon?: string;
}

interface BenefitsMultiSelectProps {
  value: string[]; // Array of benefit IDs
  customBenefits: string[]; // Array of custom benefit text
  onChange: (value: string[]) => void;
  onCustomChange: (value: string[]) => void;
  required?: boolean;
}

// Predefined benefits matching TopCV-style
export const PREDEFINED_BENEFITS: Benefit[] = [
  { id: "health_insurance", label: "Health Insurance", icon: "🏥" },
  { id: "13th_month", label: "13th Month Salary", icon: "💰" },
  { id: "performance_bonus", label: "Performance Bonus", icon: "🎯" },
  { id: "laptop_provided", label: "Laptop Provided", icon: "💻" },
  { id: "team_building", label: "Team Building", icon: "🎉" },
  { id: "annual_leave", label: "Annual Leave", icon: "🏖️" },
  { id: "training_budget", label: "Training Budget", icon: "📚" },
  { id: "flexible_hours", label: "Flexible Working Hours", icon: "⏰" },
  { id: "remote_work", label: "Remote Work Option", icon: "🏠" },
  { id: "parking", label: "Free Parking", icon: "🚗" },
  { id: "lunch", label: "Free Lunch", icon: "🍱" },
  { id: "gym", label: "Gym Membership", icon: "💪" },
  { id: "insurance_family", label: "Family Insurance", icon: "👨‍👩‍👧‍👦" },
  { id: "stock_options", label: "Stock Options", icon: "📈" },
  { id: "relocation", label: "Relocation Support", icon: "🚚" },
  { id: "childcare", label: "Childcare Support", icon: "👶" },
];

export const BenefitsMultiSelect: React.FC<BenefitsMultiSelectProps> = ({
  value,
  customBenefits,
  onChange,
  onCustomChange,
  required = false,
}) => {
  const [customInput, setCustomInput] = useState("");

  const toggleBenefit = (benefitId: string) => {
    if (value.includes(benefitId)) {
      onChange(value.filter((id) => id !== benefitId));
    } else {
      onChange([...value, benefitId]);
    }
  };

  const addCustomBenefit = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customBenefits.includes(trimmed)) {
      onCustomChange([...customBenefits, trimmed]);
      setCustomInput("");
    }
  };

  const removeCustomBenefit = (benefit: string) => {
    onCustomChange(customBenefits.filter((b) => b !== benefit));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomBenefit();
    }
  };

  const totalSelected = value.length + customBenefits.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-green-400" />
          Benefits & Perks {required && <span className="text-red-400">*</span>}
        </Label>
        {totalSelected > 0 && (
          <span className="text-xs text-slate-400">
            {totalSelected} {totalSelected === 1 ? "benefit" : "benefits"} selected
          </span>
        )}
      </div>

      {/* Predefined Benefits Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {PREDEFINED_BENEFITS.map((benefit) => {
          const isSelected = value.includes(benefit.id);
          
          return (
            <button
              key={benefit.id}
              type="button"
              onClick={() => toggleBenefit(benefit.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? "border-green-500 bg-green-500/10"
                  : "border-white/10 hover:border-white/20 bg-black/20"
                }
              `}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{benefit.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isSelected ? "text-green-300" : "text-white"}`}>
                    {benefit.label}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Benefits Preview */}
      {value.length > 0 && (
        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-2">Selected benefits:</p>
          <div className="flex flex-wrap gap-2">
            {value.map((benefitId) => {
              const benefit = PREDEFINED_BENEFITS.find((b) => b.id === benefitId);
              return benefit ? (
                <Badge
                  key={benefitId}
                  className="bg-green-500/20 text-green-300 border-green-500/30"
                >
                  {benefit.icon} {benefit.label}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Custom Benefits */}
      <div className="space-y-2">
        <Label className="text-sm text-slate-400">Additional Benefits (Optional)</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g. Company car, Visa sponsorship..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addCustomBenefit}
            disabled={!customInput.trim()}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {customBenefits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customBenefits.map((benefit, index) => (
              <Badge
                key={index}
                className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1.5"
              >
                {benefit}
                <button
                  type="button"
                  onClick={() => removeCustomBenefit(benefit)}
                  className="ml-2 hover:text-white transition"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        💡 Jobs with detailed benefits receive 40% more applications
      </p>
    </div>
  );
};
