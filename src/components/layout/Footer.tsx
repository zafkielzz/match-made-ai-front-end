import { Shield, RefreshCw } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              <span>Data sourced from public job postings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4" />
              <span>Updated daily</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} JobMatch AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
