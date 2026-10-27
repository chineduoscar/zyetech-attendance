import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

const AttendanceList = ({ type }) => {
  const isStaff = type === "staff";
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const title = isStaff ? "Staff Attendance" : "Student Attendance";
  const filteredRecords = records.filter((record) =>
    `${record.student_number || record.staff_number || ""} ${record.name} ${record.course || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const loadRecords = useCallback(async () => {
    try {
      const response = await apiRequest(`/api/${type}-attendance`);
      setRecords(response.data.map((record) => ({
        ...record,
        time: record.created_at,
      })));
    } catch (requestError) {
      setError(requestError.message || "Unable to load attendance records.");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    void Promise.resolve().then(loadRecords);
  }, [loadRecords]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-[#4a4d85]">
            View attendance records submitted by{" "}
            {isStaff ? "staff" : "students"}.
          </p>
        </div>
        <label className="w-full sm:max-w-xs">
          <span className="sr-only">Search attendance records</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, name or course"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-indigo-400"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError("");
            loadRecords();
          }}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Attendance records</h2>
          <span className="text-sm text-slate-600">
            {filteredRecords.length} records
          </span>
        </div>
        {loading ? (
          <p role="status" className="px-5 py-12 text-center text-sm text-slate-600">
            Loading attendance…
          </p>
        ) : error ? null : filteredRecords.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-155 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Name
                  </th>
                  {!isStaff && (
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Course
                    </th>
                  )}
                  {!isStaff && (
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Session
                    </th>
                  )}
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {isStaff ? record.staff_number : record.student_number}
                    </td>
                    <td className="px-5 py-4 font-medium">{record.name}</td>
                    {!isStaff && <td className="px-5 py-4">{record.course}</td>}
                    {!isStaff && (
                      <td className="px-5 py-4">{record.session}</td>
                    )}
                    <td className="px-5 py-4">{formatDate(record.time)}</td>
                    <td className="px-5 py-4">{formatTime(record.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            {search
              ? "No attendance records match your search."
              : "No attendance has been recorded yet."}
          </p>
        )}
      </div>
    </section>
  );
};

export default AttendanceList;
