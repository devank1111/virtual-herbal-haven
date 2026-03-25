import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Index from "./pages/Index";
import Garden from "./components/PlantsPortal/ExploreGarden/Garden";
import PlantDetail from "./components/PlantsPortal/Un Used Componets/PlantDetail";
import VirtualTour from "./pages/VirtualTour";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./components/PlantsPortal/Profile"
import PlantDetails from "./components/PlantsPortal/PlantDetails/PlantDetails";
import GlobalMusicPlayer from "./components/GlobalMusicPlayer";

// Admin panel
import AdminDashboard from "./pages/adminPanel/dashboard";
import AdminLogin from "./pages/adminPanel/Login";
import AdminSignup from "./pages/adminPanel/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <GlobalMusicPlayer />
        
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/garden" element={<ProtectedRoute><Garden /></ProtectedRoute>} />
            {/* <Route path="/plant/:id" element={<ProtectedRoute><PlantDetail /></ProtectedRoute>} /> */}
            <Route path = "/plant/:id" element= {<PlantDetails />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/tour" element={<ProtectedRoute><VirtualTour /></ProtectedRoute>} />

            {/* Admin Panel */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
