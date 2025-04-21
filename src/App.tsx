import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PetDetailPage from "./pages/PetDetailPage";
import PetFormPage from "./pages/PetFormPage";
import CalendarPage from "./pages/CalendarPage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleFormPage from "./pages/ScheduleFormPage";
import MasterProfilePage from "./pages/MasterProfilePage";
import EditMasterProfilePage from "./pages/EditMasterProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pet/:id" element={<PetDetailPage />} />
            <Route path="/pet/:id/edit" element={<PetFormPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/schedule/:id" element={<ScheduleDetailPage />} />
            <Route path="/schedule/:id/edit" element={<ScheduleFormPage />} />
            <Route path="/master" element={<MasterProfilePage />} />
            <Route path="/master/edit" element={<EditMasterProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
