import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DevAuthSwitcher from "./components/DevAuthSwitcher";
import UserNavbar from "./components/layout/UserNavbar";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import UserHome from "./pages/user/UserHome";
import HRDashboard from "./pages/hr/HRDashboard";
import PostJob from "./pages/hr/PostJob";
import MyJobs from "./pages/hr/MyJobs";
import HRJobDetail from "./pages/hr/HRJobDetail";

const queryClient = new QueryClient();

const App = () => {
  const { role } = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {role === "user" && <UserNavbar />}
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />

            {/* User-only */}
            <Route
              path="/home"
              element={
                <ProtectedRoute allowed={["user"]}>
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowed={["user"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowed={["user"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* HR-only */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowed={["hr"]}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs"
              element={
                <ProtectedRoute allowed={["hr"]}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/new"
              element={
                <ProtectedRoute allowed={["hr"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/:jobId"
              element={
                <ProtectedRoute allowed={["hr"]}>
                  <HRJobDetail />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {import.meta.env && import.meta.env.DEV ? <DevAuthSwitcher /> : null}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
