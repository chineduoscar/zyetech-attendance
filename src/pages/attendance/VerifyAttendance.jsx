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
    <dd className="text-right text-sm font-semibold text-[#06066f]">{value}</dd>
  </div>
);

/**
 * record = { name, course, session?, time }  (time is an ISO string)
 */
const AttendanceVerification = ({ record }) => {
  if (!record) return null;

  return (
    <section className="flex flex-1 justify-center px-5 py-12">
      <div className="h-fit w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 text-center shadow-sm sm:p-8">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef0ff] text-[#06066f]"
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

        <h1
          role="status"
          className="text-2xl font-bold tracking-tight text-[#06066f]"
        >
          Attendance marked
        </h1>
        <p className="mt-1.5 mb-6 text-sm leading-relaxed text-[#4a4d85]">
          Your attendance has been recorded successfully.
        </p>

        <dl className="rounded-xl bg-[#f6f7fc] px-4 text-left">
          {record.student_number && (
            <Row label="Student ID" value={record.student_number} />
          )}
          {record.staff_number && (
            <Row label="Staff ID" value={record.staff_number} />
          )}
          <Row label="Name" value={record.name} />
          {record.course && <Row label="Course" value={record.course} />}
          {record.roles?.length > 0 && (
            <Row label="Role(s)" value={record.roles.join(", ")} />
          )}
          {record.session && <Row label="Session" value={record.session} />}
          <Row label="Date" value={formatDate(record.time)} />
          <Row label="Time" value={formatTime(record.time)} />
        </dl>
      </div>
    </section>
  );
};

export default AttendanceVerification;
