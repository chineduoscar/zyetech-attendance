import { useState } from "react";

const AdminLogin = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Admin sign-in is not connected yet.");
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
              required
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
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#cfd3ec] px-3.5 py-3 focus-visible:outline-2 focus-visible:outline-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#06066f] py-3 font-bold text-white transition-colors hover:bg-[#04044f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Sign in
          </button>
          {message && (
            <p role="status" className="text-sm text-amber-800">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default AdminLogin;
