import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      navigate(
        ["admin", "superadmin"].includes(user.role)
          ? location.state?.from?.pathname || "/admin/users"
          : "/pending-approval",
        { replace: true },
      );
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setError("The email or password is incorrect.");
      } else if (
        requestError instanceof ApiError &&
        requestError.status >= 500
      ) {
        setError("The server could not sign you in. Please try again shortly.");
      } else {
        setError(
          requestError.message || "Unable to sign in. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef0fa] px-5 py-12 text-[#06066f]">
      <section className="w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Zyetech logo"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div className="leading-tight">
            <p className="text-base font-bold">Zyetech</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#4a4d85]">
              Innovation Technology
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Admin login</h1>
        <p className="mb-6 mt-2 text-sm text-[#4a4d85]">
          Sign in to access the administration dashboard.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-semibold"
            >
              Email address
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#cfd3ec] px-3.5 py-3 focus-visible:outline-2 focus-visible:outline-indigo-400"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#cfd3ec] py-3 pl-3.5 pr-16 focus-visible:outline-2 focus-visible:outline-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 cursor-pointer rounded-r-lg px-3.5 text-sm font-semibold text-[#4a4d85] hover:text-[#06066f] focus-visible:outline-2 focus-visible:outline-indigo-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-lg bg-[#06066f] py-3 font-bold text-white transition-colors hover:bg-[#04044f] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
        <p className="mt-6 text-center text-sm text-[#4a4d85]">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#06066f] underline"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AdminLogin;
