import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import DietPlanGenerator from "./pages/DietPlanGenerator";
import Chatbot from "./pages/Chatbot";
import Emergency from "./pages/Emergency";
import ExerciseVideos from "./pages/ExerciseVideos";
import ManualHealthEntry from "./pages/ManualHealthEntry";
import DietPlanResults from "./pages/DietPlanResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Initialize global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/diet-plan-generator" element={<DietPlanGenerator />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/exercise-videos" element={<ExerciseVideos />} />
      <Route path="/manual-health-entry" element={<ManualHealthEntry />} />
      <Route path="/diet-plan-results" element={<DietPlanResults />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
