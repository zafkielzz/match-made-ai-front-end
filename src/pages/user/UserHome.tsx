import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getMyApplications, getNotifications } from "@/mock/api";
import StatusPill from "@/components/StatusPill";
import ScoreRing from "@/components/ScoreRing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  FileText, 
  Clock, 
  Bell, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  Target,
  CheckCircle2
} from "lucide-react";

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([getMyApplications(user.id), getNotifications(user.id)]).then(
      ([apps, notifs]) => {
        setApplications(apps);
        setNotifications(notifs);
        setLoading(false);
      },
    );
  }, [user]);

  const matchedJobs = 5;
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const stats = [
    {
      label: "Matched Jobs",
      value: matchedJobs,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "+2 this week"
    },
    {
      label: "Applications",
      value: applications.length,
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      trend: `${approvedCount} approved`
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      trend: "In review"
    },
    {
      label: "Notifications",
      value: unreadNotifs,
      icon: Bell,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      trend: unreadNotifs > 0 ? "New updates" : "All read"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-8 border border-primary/20">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Welcome back</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Hi, {user?.name}! 👋
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Your AI-powered job matching dashboard is ready. Explore personalized opportunities and track your applications.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommended Matches */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                  AI Recommended Matches
                </CardTitle>
                <CardDescription>
                  Jobs perfectly matched to your skills and experience
                </CardDescription>
              </div>
              <Button 
                onClick={() => navigate("/results")}
                className="bg-primary hover:bg-primary/90 group"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card 
                  key={i}
                  className="border-white/10 bg-black/30 hover:bg-black/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group"
                  onClick={() => navigate(`/jobs/${i}`)}
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-primary transition-colors">
                          Senior AI Engineer
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                          <Building2 className="w-4 h-4" />
                          <span>Tech Company {i}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>Remote / Hybrid</span>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        New
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <ScoreRing score={85 + i * 3} />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your job applications
                </CardDescription>
              </div>
              {applications.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/applications")}
                  className="border-white/10 hover:bg-white/5"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">No applications yet</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Start applying to matched jobs and track your progress here
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/upload")}
                  className="bg-primary hover:bg-primary/90 mt-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find Your First Match
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.slice(0, 3).map((app) => (
                  <Card 
                    key={app.id}
                    className="border-white/10 bg-black/30 hover:bg-black/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => navigate(`/jobs/${app.jobId}`)}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white text-lg">{app.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Building2 className="w-4 h-4" />
                          <span>{app.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>{app.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <StatusPill status={app.status} />
                        <ScoreRing score={app.score} />
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-white/10">
                        <Calendar className="w-3 h-3" />
                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bell className="w-6 h-6 text-blue-400" />
                  Recent Notifications
                  {unreadNotifs > 0 && (
                    <Badge className="bg-blue-500 text-white">{unreadNotifs}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Stay updated with your application progress
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/notifications")}
                className="border-white/10 hover:bg-white/5"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-400" />
                <p className="text-slate-300 font-medium">You're all caught up!</p>
                <p className="text-sm text-slate-500">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((n) => (
                  <Card
                    key={n.id}
                    className={`border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      n.read 
                        ? "bg-black/20 hover:bg-black/30" 
                        : "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
                    }`}
                    onClick={() => navigate("/notifications")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${n.read ? "bg-slate-700" : "bg-blue-500/20"}`}>
                          <Bell className={`w-4 h-4 ${n.read ? "text-slate-400" : "text-blue-400"}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-semibold ${n.read ? "text-slate-300" : "text-blue-300"}`}>
                              {n.title}
                            </h4>
                            {!n.read && (
                              <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{n.body}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserHome;
