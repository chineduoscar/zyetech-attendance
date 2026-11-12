import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const hasDashboardAccess = (user) =>
  user?.approval_status === "approved" &&
  ["admin", "superadmin"].includes(user.role);

const LoadingScreen = ({ error, onRetry }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-[#06066f]">
    <div className="text-center">
      {error ? (
        <>
          <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[#06066f] px-4 py-2 font-semibold text-white"
          >
            Retry
          </button>
        </>
      ) : (
        <div
          role="status"
          aria-label="Checking your session"
          className="flex items-center justify-center"
        >
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="h-20 w-20 animate-pulse object-contain"
          />
        </div>
      )}
    </div>
  </main>
);

export const AdminRoute = () => {
  const { user, loading, sessionError, refreshSession } = useAuth();
  const location = useLocation();
  if (loading || sessionError) {
    return <LoadingScreen error={sessionError} onRetry={refreshSession} />;
  }
  if (!user) {
    return <Navigate to="/dean/login" replace state={{ from: location }} />;
  }
  if (!hasDashboardAccess(user)) {
    return <Navigate to="/dean/pending-approval" replace />;
  }
  return <Outlet />;
};

export const SuperadminRoute = () => {
  const { user, loading, sessionError, refreshSession } = useAuth();
  const location = useLocation();
  if (loading || sessionError) {
    return <LoadingScreen error={sessionError} onRetry={refreshSession} />;
  }
  if (!user) {
    return <Navigate to="/dean/login" replace state={{ from: location }} />;
  }
  if (!hasDashboardAccess(user) || user.role !== "superadmin") {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/dean/dashboard"
            : "/dean/pending-approval"
        }
        replace
      />
    );
  }
  return <Outlet />;
};

export const SignedInRoute = () => {
  const { user, loading, sessionError, refreshSession } = useAuth();
  if (loading || sessionError) {
    return <LoadingScreen error={sessionError} onRetry={refreshSession} />;
  }
  if (!user) return <Navigate to="/dean/login" replace />;
  if (hasDashboardAccess(user)) {
    return <Navigate to="/dean/dashboard" replace />;
  }
  return <Outlet />;
};

export const AuthPageRoute = () => {
  const { user, loading, sessionError, refreshSession } = useAuth();
  if (loading) {
    return <LoadingScreen error={sessionError} onRetry={refreshSession} />;
  }
  if (user) {
    return (
      <Navigate
        to={hasDashboardAccess(user)
          ? "/dean/dashboard"
          : "/dean/pending-approval"}
        replace
      />
    );
  }
  return <Outlet />;
};
