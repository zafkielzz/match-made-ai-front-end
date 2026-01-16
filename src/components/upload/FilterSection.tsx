import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Filters {
  location: string;
  jobLevel: string;
  category: string;
}

interface FilterSectionProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const locations = [
  { value: "all", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { value: "new-york", label: "New York, NY" },
  { value: "san-francisco", label: "San Francisco, CA" },
  { value: "los-angeles", label: "Los Angeles, CA" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "austin", label: "Austin, TX" },
  { value: "seattle", label: "Seattle, WA" },
  { value: "boston", label: "Boston, MA" },
  { value: "london", label: "London, UK" },
  { value: "berlin", label: "Berlin, Germany" },
];

const jobLevels = [
  { value: "all", label: "All Levels" },
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "product", label: "Product" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "data", label: "Data Science" },
];

const FilterSection = ({ filters, onFilterChange }: FilterSectionProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Refine your search</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange("location", value)}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Job Level</Label>
          <Select
            value={filters.jobLevel}
            onValueChange={(value) => onFilterChange("jobLevel", value)}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {jobLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
