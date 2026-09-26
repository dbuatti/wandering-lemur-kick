import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import PageLoader from "./components/PageLoader";
import Index from "./pages/Index";

// Portal pages are split out so public visitors don't download the admin bundle
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tickets = lazy(() => import("./pages/Tickets"));
const TicketDetail = lazy(() => import("./pages/TicketDetail"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const Invoices = lazy(() => import("./pages/Invoices"));
const InvoiceDetail = lazy(() => import("./pages/InvoiceDetail"));
const PublicInvoice = lazy(() => import("./pages/PublicInvoice"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
};

const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/tickets", element: <Tickets /> },
  { path: "/tickets/:id", element: <TicketDetail /> },
  { path: "/clients", element: <Clients /> },
  { path: "/clients/:id", element: <ClientDetail /> },
  { path: "/invoices", element: <Invoices /> },
  { path: "/invoices/:id", element: <InvoiceDetail /> },
  { path: "/settings", element: <Settings /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/invoice/view/:id" element={<PublicInvoice />} />
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={<ProtectedRoute>{element}</ProtectedRoute>}
                />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
