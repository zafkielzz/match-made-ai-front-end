import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getProvinces } from "../service/provinceService";
interface Filters {
  location: string;
  jobLevel: string;
  category: string;
  salary: string;
  employmentType: string;
}

interface FilterSectionProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}
const provinceList = await getProvinces();
const locations = [
  { value: "all", label: "All Locations" },
  ...provinceList.map((item) => ({
    value: item.codename,
    label: item.name,
  })),
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
const salaryRanges = [
  { value: "all", label: "All Salaries" },
  { value: "under_5", label: "Under 5 million" },
  { value: "5_10", label: "5 – 10 million" },
  { value: "10_20", label: "10 – 20 million" },
  { value: "20_30", label: "20 – 30 million" },
  { value: "30_50", label: "30 – 50 million" },
  { value: "over_50", label: "Over 50 million" },
];
const employmentTypes = [
  { value: "all", label: "All Types" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "intern", label: "Internship" },
];

const FilterSection = ({ filters, onFilterChange }: FilterSectionProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Refine your search</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-foreground">
            Location
          </Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onFilterChange("location", value)}
          >
            <SelectTrigger
              id="location"
              className="h-11 border-border bg-background hover:border-primary focus:border-accent focus:ring-2 focus:ring-primary/50"
            >
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value} className="text-foreground hover:bg-accent">
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium text-foreground">
            Job Level
          </Label>
          <Select
            value={filters.jobLevel}
            onValueChange={(value) => onFilterChange("jobLevel", value)}
          >
            <SelectTrigger
              id="level"
              className="h-11 border-border bg-background hover:border-primary focus:border-accent focus:ring-2 focus:ring-primary/50"
            >
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {jobLevels.map((level) => (
                <SelectItem key={level.value} value={level.value} className="text-foreground hover:bg-accent">
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger
              id="category"
              className="h-11 border-border bg-background hover:border-primary focus:border-accent focus:ring-2 focus:ring-primary/50"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-foreground hover:bg-accent">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-sm font-medium text-foreground">
            Desired Salary
          </Label>
          <Select
            value={filters.salary}
            onValueChange={(value) => onFilterChange("salary", value)}
          >
            <SelectTrigger
              id="salary"
              className="h-11 border-border bg-background hover:border-primary focus:border-accent focus:ring-2 focus:ring-primary/50"
            >
              <SelectValue placeholder="Select salary range" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {salaryRanges.map((salary) => (
                <SelectItem key={salary.value} value={salary.value} className="text-foreground hover:bg-accent">
                  {salary.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employment" className="text-sm font-medium text-foreground">
            Employment Type
          </Label>
          <Select
            value={filters.employmentType}
            onValueChange={(value) => onFilterChange("employmentType", value)}
          >
            <SelectTrigger
              id="employment"
              className="h-11 border-border bg-background hover:border-primary focus:border-accent focus:ring-2 focus:ring-primary/50"
            >
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {employmentTypes.map((emType) => (
                <SelectItem key={emType.value} value={emType.value} className="text-foreground hover:bg-accent">
                  {emType.label}
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
