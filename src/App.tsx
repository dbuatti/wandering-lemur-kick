import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import PageLoader from "./components/PageLoader";
import { consumePostLoginRedirect } from "./lib/post-login-redirect";
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

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

const queryClient = createQueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
};

// After Google sign-in lands on /dashboard, continue to the page the user asked for
const PostLoginRedirect = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session || location.pathname === "/login") return;
    const target = consumePostLoginRedirect();
    if (target && target !== location.pathname + location.search) {
      navigate(target, { replace: true });
    }
  }, [session, location.pathname, location.search, navigate]);

  return null;
};

// React Router doesn't scroll to #anchors on its own, so in-page nav links need this
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so the target section has rendered
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
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

// Shared by the browser entry and the build-time prerender (src/entry-server.tsx)
export const AppProviders = ({ client, children }: { client: QueryClient; children: React.ReactNode }) => (
  <QueryClientProvider client={client}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export const AppRoutes = () => (
  <>
    <PostLoginRedirect />
    <ScrollToHash />
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
  </>
);

const App = () => (
  <AppProviders client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;
