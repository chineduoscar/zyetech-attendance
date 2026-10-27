import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

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
        <p role="status">Checking your session…</p>
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
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  if (!["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/pending-approval" replace />;
  }
  return <Outlet />;
};

export const SignedInRoute = () => {
  const { user, loading, sessionError, refreshSession } = useAuth();
  if (loading || sessionError) {
    return <LoadingScreen error={sessionError} onRetry={refreshSession} />;
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/admin/users" replace />;
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
        to={["admin", "superadmin"].includes(user.role)
          ? "/admin/users"
          : "/pending-approval"}
        replace
      />
    );
  }
  return <Outlet />;
};
