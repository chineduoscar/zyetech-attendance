const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-[#e3e6f5] py-3 last:border-b-0">
    <dt className="text-sm text-[#4a4d85]">{label}</dt>
    <dd className="text-right text-sm font-semibold">{value}</dd>
  </div>
);

/**
 * record = { name, course, session?, time }  (time is an ISO string)
 */
const AttendanceVerification = ({ record, onDone }) => {
  if (!record) return null;

  return (
    <section className="flex flex-1 justify-center px-5 py-12">
        <div className="h-fit w-full max-w-120 rounded-2xl border border-[#cfd3ec] bg-white p-7 text-center sm:p-8">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#06066f]"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>

          <h1 role="status" className="mb-1.5 text-2xl font-bold leading-tight">
            Attendance marked
          </h1>
          <p className="mb-6 text-[0.95rem] text-[#4a4d85]">
            Your attendance has been recorded successfully.
          </p>

          <dl className="mb-6 rounded-xl bg-[#f6f7fc] px-4 text-left">
            <Row label="Name" value={record.name} />
            <Row label="Course" value={record.course} />
            {record.session && <Row label="Session" value={record.session} />}
            <Row label="Date" value={formatDate(record.time)} />
            <Row label="Time" value={formatTime(record.time)} />
          </dl>

          <button
            type="button"
            onClick={onDone}
            className="w-full cursor-pointer rounded-lg bg-[#06066f] py-3 font-bold text-white transition-colors hover:bg-[#04044f] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Done
          </button>
        </div>
    </section>
  );
};

export default AttendanceVerification;
