import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const FiltersSheet = ({ isOpen, onClose, filters, selectedFilters, onFilterChange }: FiltersSheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-background border-t border-border sm:border sm:rounded-xl w-full sm:max-w-md max-h-[80vh] sm:max-h-[60vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filter by Match Level</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                selectedFilters.includes(filter.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{filter.label}</span>
                <Badge variant="secondary">{filter.count}</Badge>
              </div>
            </button>
          ))}
        </div>
        
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <Button onClick={onClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersSheet;
