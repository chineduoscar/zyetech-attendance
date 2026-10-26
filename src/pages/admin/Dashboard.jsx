const metrics = [
  { label: "Total students", value: "0", detail: "No student records yet" },
  { label: "Total staff", value: "0", detail: "No staff records yet" },
  { label: "Attendance today", value: "0", detail: "Records for today" },
  { label: "Receipts this month", value: "0", detail: "Receipts generated" },
];

const Dashboard = () => (
  <div>
    <p className="mb-2 text-sm font-semibold text-[#4a4d85]">
      {new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
    <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
      Welcome to your dashboard
    </h1>
    <p className="mb-8 mt-2 text-[0.95rem] text-[#4a4d85]">
      Here is an overview of your students, staff, attendance, and receipts.
    </p>

    <section aria-label="Dashboard overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-2xl border border-[#cfd3ec] bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-[#4a4d85]">{metric.label}</h2>
          <p className="mt-4 text-3xl font-bold">{metric.value}</p>
          <p className="mt-1 text-sm text-[#73769a]">{metric.detail}</p>
        </article>
      ))}
    </section>

    <section className="mt-6 rounded-2xl border border-[#cfd3ec] bg-white p-6">
      <h2 className="text-lg font-bold">Getting started</h2>
      <p className="mt-2 text-sm text-[#4a4d85]">
        Use the sidebar to manage students and staff, record attendance, and
        generate or review receipts. Dashboard totals will update when records
        are connected.
      </p>
    </section>
  </div>
);

export default Dashboard;
