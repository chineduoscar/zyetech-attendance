import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const PendingApproval = () => {
  const { user, logout, refreshSession } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const isApproved = user.approval_status === "approved";
  const hasAdminRole = ["admin", "superadmin"].includes(user.role);

  const handleLogout = async () => {
    setError("");
    setSubmitting(true);
    try {
      await logout();
      window.location.assign("/dean/login");
    } catch (requestError) {
      setError(requestError.message || "Unable to log out. Please retry.");
      setSubmitting(false);
    }
  };

  const handleCheckAccess = async () => {
    setChecking(true);
    setError("");
    await refreshSession();
    setChecking(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 text-[#06066f]">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <img src="/logo.png" alt="Zyetech logo" className="mx-auto mb-5 h-14 w-14 object-contain" />
        <h1 className="text-2xl font-bold">
          {!isApproved
            ? "Approval pending"
            : hasAdminRole
              ? "Account approved"
              : "Awaiting role assignment"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {!isApproved
            ? "Your account is waiting for a superadmin to approve it. You cannot access the dean dashboard until your account is approved and assigned an admin or superadmin role."
            : hasAdminRole
              ? "Your account is approved. You can now access the dean dashboard."
              : "Your account is approved and waiting for a superadmin to assign an admin or superadmin role before dashboard access is enabled."}
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Signed in as <span className="font-semibold text-slate-900">{user.email}</span>
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            disabled={checking || submitting}
            onClick={handleCheckAccess}
            className="rounded-lg border border-[#06066f] px-5 py-3 font-semibold text-[#06066f] disabled:opacity-60"
          >
            {checking ? "Checking…" : "Check access"}
          </button>
          <button
            type="button"
            disabled={submitting || checking}
            onClick={handleLogout}
            className="rounded-lg bg-[#06066f] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Signing out…" : "Log out"}
          </button>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      </section>
    </main>
  );
};

export default PendingApproval;
