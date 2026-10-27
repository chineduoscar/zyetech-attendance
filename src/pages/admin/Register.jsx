import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate(
        ["admin", "superadmin"].includes(user.role)
          ? "/admin/users"
          : "/pending-approval",
        { replace: true },
      );
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 409) {
        setError("An account with this email already exists. Try signing in.");
      } else if (
        requestError instanceof ApiError &&
        requestError.status >= 500
      ) {
        setError(
          "The server could not create your account. Please try again shortly.",
        );
      } else {
        setError(requestError.message || "Unable to create your account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef0fa] px-5 py-12 text-[#06066f]">
      <section className="w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Zyetech logo"
            className="h-12 w-12 object-contain"
          />
          <div className="leading-tight">
            <p className="font-bold">Zyetech</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#4a4d85]">
              Innovation Technology
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mb-6 mt-2 text-sm text-[#4a4d85]">
          New accounts need administrator approval before dashboard access.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="register-name"
              className="mb-1.5 block text-sm font-semibold"
            >
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              required
              maxLength={100}
              value={form.name}
              onChange={updateField}
              className="w-full rounded-lg border border-[#cfd3ec] px-3.5 py-3 focus-visible:outline-2 focus-visible:outline-indigo-400"
            />
          </div>
          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-semibold"
            >
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={updateField}
              className="w-full rounded-lg border border-[#cfd3ec] px-3.5 py-3 focus-visible:outline-2 focus-visible:outline-indigo-400"
            />
          </div>
          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                minLength={6}
                required
                value={form.password}
                onChange={updateField}
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
            className="w-full cursor-pointer rounded-lg bg-[#06066f] py-3 font-bold text-white transition-colors hover:bg-[#04044f] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
        <p className="mt-6 text-center text-sm text-[#4a4d85]">
          Already registered?{" "}
          <Link
            to="/admin/login"
            className="font-semibold text-[#06066f] underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
