
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import PetsPage from "./pages/PetsPage";
import NotFound from "./pages/NotFound";
import PetDetailPage from "./pages/PetDetailPage";
import PetFormPage from "./pages/PetFormPage";
import CalendarPage from "./pages/CalendarPage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import ScheduleFormPage from "./pages/ScheduleFormPage";
import MasterProfilePage from "./pages/MasterProfilePage";
import EditMasterProfilePage from "./pages/EditMasterProfilePage";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<PetsPage />} />
                <Route
                  path="/pet/:id"
                  element={
                    <AuthGuard>
                      <PetDetailPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/pet/new"
                  element={<PetFormPage />}
                />
                <Route
                  path="/pet/:id/edit"
                  element={
                    <AuthGuard>
                      <PetFormPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <AuthGuard>
                      <CalendarPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/schedule/new"
                  element={
                    <AuthGuard>
                      <ScheduleFormPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/schedule/:id"
                  element={
                    <AuthGuard>
                      <ScheduleDetailPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/schedule/:id/edit"
                  element={
                    <AuthGuard>
                      <ScheduleFormPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/master"
                  element={
                    <AuthGuard>
                      <MasterProfilePage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/master/edit"
                  element={
                    <AuthGuard>
                      <EditMasterProfilePage />
                    </AuthGuard>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
