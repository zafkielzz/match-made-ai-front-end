import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMyApplications, getNotifications } from "@/mock/api";
import { 
  Bell, 
  Home, 
  FileText, 
  LogOut, 
  User, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserNavbar: React.FC = () => {
  const { user, signout } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    getMyApplications(user.id).then(setApps);
    getNotifications(user.id).then(setNotifs);
  }, [user]);

  const unread = notifs.filter((n) => !n.read).length;
  const pendingApps = apps.filter((a) => a.status === "pending").length;

  const navItems = [
    {
      label: "Home",
      path: "/home",
      icon: Home,
      badge: null
    },
    {
      label: "Applications",
      path: "/applications",
      icon: FileText,
      badge: pendingApps > 0 ? pendingApps : null,
      disabled: apps.length === 0
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      badge: unread > 0 ? unread : null
    }
  ];

  const handleLogout = () => {
    signout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all"></div>
              <Sparkles className="w-8 h-8 text-primary relative z-10 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MatchMade AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              location.pathname.startsWith(item.path + "/");
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 rounded-xl font-medium transition-all duration-300
                    flex items-center gap-2 group
                    ${isActive 
                      ? "bg-primary/20 text-primary shadow-lg shadow-primary/20" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-1 bg-blue-500 text-white text-xs px-2 py-0.5">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 hover:bg-white/5 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-200 font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-card/95 backdrop-blur-xl border-white/10"
              >
                <DropdownMenuLabel className="text-slate-300">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{user?.name}</span>
                    <span className="text-xs text-slate-400">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => navigate("/home")}
                  className="cursor-pointer hover:bg-white/5 text-slate-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/applications")}
                  className="cursor-pointer hover:bg-white/5 text-slate-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Applications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-red-500/10 text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-300 hover:bg-white/5"
                    }
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-blue-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
