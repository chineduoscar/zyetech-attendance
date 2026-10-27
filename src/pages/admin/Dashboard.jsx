import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    try {
      const response = await apiRequest("/api/analytics");
      setSummary(response.data);
    } catch (requestError) {
      setError(requestError.message || "Unable to load dashboard totals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadSummary);
  }, [loadSummary]);

  const metrics = [
    {
      label: "Total students",
      value: summary?.total_students,
      detail: "Student profiles",
    },
    {
      label: "Total staff",
      value: summary?.total_staff,
      detail: "Staff profiles",
    },
    {
      label: "Student attendance today",
      value: summary?.today?.student_attendance,
      detail: "Students marked today",
    },
    {
      label: "Staff attendance today",
      value: summary?.today?.staff_attendance,
      detail: "Staff marked today",
    },
    {
      label: "Receipts today",
      value: summary?.receipts_today,
      detail: "Receipts generated today",
    },
  ];

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#4a4d85]">
        {new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            Welcome to your dashboard
          </h1>
          <p className="mt-2 text-[0.95rem] text-[#4a4d85]">
            Today's attendance and receipts at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError("");
            loadSummary();
          }}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}
      <section
        aria-label="Dashboard overview"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-[#cfd3ec] bg-white p-5 shadow-sm"
          >
            <h2 className="text-sm font-semibold text-[#4a4d85]">
              {metric.label}
            </h2>
            <p className="mt-4 text-3xl font-bold" aria-live="polite">
              {loading ? "…" : summary ? metric.value : "—"}
            </p>
            <p className="mt-1 text-sm text-[#73769a]">{metric.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
