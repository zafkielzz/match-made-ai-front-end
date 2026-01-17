import { Briefcase, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Icon icon={Briefcase} size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">JobMatch AI</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/5 px-4 py-2">
            <Icon icon={Shield} size={16} className="text-success" />
            <span className="text-sm font-semibold text-success">Privacy-first</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
