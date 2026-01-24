import React from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  negotiable: boolean;
  type: "GROSS" | "NET";
}

interface SalaryRangeInputProps {
  value: SalaryRange;
  onChange: (value: SalaryRange) => void;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD - US Dollar" },
  { code: "VND", symbol: "₫", label: "VND - Vietnamese Dong" },
  { code: "EUR", symbol: "€", label: "EUR - Euro" },
  { code: "GBP", symbol: "£", label: "GBP - British Pound" },
  { code: "SGD", symbol: "S$", label: "SGD - Singapore Dollar" },
  { code: "THB", symbol: "฿", label: "THB - Thai Baht" },
];

export const SalaryRangeInput: React.FC<SalaryRangeInputProps> = ({
  value,
  onChange,
}) => {
  const [errors, setErrors] = React.useState<{ min?: string; max?: string }>({});

  const updateField = <K extends keyof SalaryRange>(
    field: K,
    fieldValue: SalaryRange[K]
  ) => {
    const updated = { ...value, [field]: fieldValue };
    
    // Validate
    const newErrors: { min?: string; max?: string } = {};
    
    if (updated.min < 0) {
      newErrors.min = "Minimum cannot be negative";
    }
    
    if (updated.max < 0) {
      newErrors.max = "Maximum cannot be negative";
    }
    
    if (updated.min > 0 && updated.max > 0 && updated.min > updated.max) {
      newErrors.min = "Minimum cannot be greater than maximum";
    }
    
    setErrors(newErrors);
    onChange(updated);
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === value.currency);

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-green-400" />
        Salary Range (Optional)
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-xs text-slate-400">
            Currency
          </Label>
          <Select
            value={value.currency}
            onValueChange={(v) => updateField("currency", v)}
          >
            <SelectTrigger className="bg-background border-white/10">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10 z-[200]">
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Salary */}
        <div className="space-y-2">
          <Label htmlFor="minSalary" className="text-xs text-slate-400">
            Minimum
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {selectedCurrency?.symbol || "$"}
            </span>
            <Input
              id="minSalary"
              type="number"
              placeholder="0"
              value={value.min || ""}
              onChange={(e) => updateField("min", parseFloat(e.target.value) || 0)}
              className={`pl-8 ${errors.min ? "border-red-500" : ""}`}
              min="0"
            />
          </div>
          {errors.min && (
            <p className="text-xs text-red-400">{errors.min}</p>
          )}
        </div>

        {/* Max Salary */}
        <div className="space-y-2">
          <Label htmlFor="maxSalary" className="text-xs text-slate-400">
            Maximum
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {selectedCurrency?.symbol || "$"}
            </span>
            <Input
              id="maxSalary"
              type="number"
              placeholder="0"
              value={value.max || ""}
              onChange={(e) => updateField("max", parseFloat(e.target.value) || 0)}
              className={`pl-8 ${errors.max ? "border-red-500" : ""}`}
              min="0"
            />
          </div>
          {errors.max && (
            <p className="text-xs text-red-400">{errors.max}</p>
          )}
        </div>
      </div>

      {/* Salary Notes */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="negotiable"
            checked={value.negotiable}
            onCheckedChange={(checked) =>
              updateField("negotiable", checked as boolean)
            }
          />
          <label
            htmlFor="negotiable"
            className="text-sm text-slate-300 cursor-pointer"
          >
            Negotiable
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="gross"
            checked={value.type === "GROSS"}
            onCheckedChange={(checked) =>
              updateField("type", checked ? "GROSS" : "NET")
            }
          />
          <label
            htmlFor="gross"
            className="text-sm text-slate-300 cursor-pointer"
          >
            Gross (before tax)
          </label>
        </div>
      </div>

      {/* Preview */}
      {(value.min > 0 || value.max > 0) && (
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <p className="text-sm text-slate-300">
            <span className="text-slate-400">Salary: </span>
            {value.min > 0 && value.max > 0 ? (
              <>
                {selectedCurrency?.symbol}
                {value.min.toLocaleString()} -{" "}
                {selectedCurrency?.symbol}
                {value.max.toLocaleString()}
              </>
            ) : value.min > 0 ? (
              <>
                From {selectedCurrency?.symbol}
                {value.min.toLocaleString()}
              </>
            ) : (
              <>
                Up to {selectedCurrency?.symbol}
                {value.max.toLocaleString()}
              </>
            )}
            {" "}
            {value.currency}
            {value.negotiable && (
              <span className="text-green-400 ml-2">(Negotiable)</span>
            )}
            {value.type === "GROSS" && (
              <span className="text-blue-400 ml-2">(Gross)</span>
            )}
          </p>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Providing salary range increases application rate by 30%
      </p>
    </div>
  );
};
