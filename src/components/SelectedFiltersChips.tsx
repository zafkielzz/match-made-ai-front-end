import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/Icon";
import { Shield } from "lucide-react";
interface SelectedFilter {
  id: string;
  label: string;
}

interface SelectedFiltersChipsProps {
  filters: SelectedFilter[];
  onRemove: (filterId: string) => void;
  onClearAll: () => void;
}

const SelectedFiltersChips = ({ filters, onRemove, onClearAll }: SelectedFiltersChipsProps) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 border-b border-border [&_svg]:shrink-0 [&_svg]:flex-none [&_svg]:block">
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 overflow-visible"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.id)}
            className="inline-flex items-center justify-center shrink-0 flex-none h-6 w-6 rounded-full hover:bg-muted-foreground/20 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Remove filter ${filter.label}`}
          >
            <Icon icon={X} size={14} className="shrink-0" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
      >
        Clear all
      </button>
    </div>
  );
};

export default SelectedFiltersChips;
