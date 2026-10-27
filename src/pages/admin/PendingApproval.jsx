import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isApproved = user.approval_status === "approved";

  const handleLogout = async () => {
    setError("");
    setSubmitting(true);
    try {
      await logout();
      window.location.assign("/admin/login");
    } catch (requestError) {
      setError(requestError.message || "Unable to log out. Please retry.");
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 text-[#06066f]">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <img src="/logo.png" alt="Zyetech logo" className="mx-auto mb-5 h-14 w-14 object-contain" />
        <h1 className="text-2xl font-bold">
          {isApproved ? "Account approved" : "Approval pending"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isApproved
            ? "Your account has been approved, but it does not have an administrator role. Contact an administrator if you need dashboard access."
            : "Your account was created successfully and is waiting for a superadmin to approve it. You cannot access the administration dashboard until you are assigned an administrator role."}
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Signed in as <span className="font-semibold text-slate-900">{user.email}</span>
        </p>
        <button
          type="button"
          disabled={submitting}
          onClick={handleLogout}
          className="mt-7 rounded-lg bg-[#06066f] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Signing out…" : "Log out"}
        </button>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      </section>
    </main>
  );
};

export default PendingApproval;
