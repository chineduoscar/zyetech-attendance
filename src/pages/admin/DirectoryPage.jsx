import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import { COURSES, STAFF_ROLES } from "../../data/data";

const emptyForm = {
  name: "",
  email: "",
  course: "",
  roles: [],
  status: "active",
};

const DirectoryPage = ({ kind }) => {
  const isStudents = kind === "students";
  const title = isStudents ? "Students" : "Staff";
  const endpoint = `/api/${kind}`;
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [recordToDelete, setRecordToDelete] = useState(null);
  const filteredRecords = records.filter((record) =>
    [
      isStudents ? record.student_number : record.staff_number,
      record.name,
      record.email,
      record.course,
      ...(record.roles || []),
      record.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  const loadRecords = useCallback(async () => {
    try {
      const response = await apiRequest(endpoint);
      setRecords(response.data.records);
    } catch (requestError) {
      setError(
        requestError.message || `Unable to load ${title.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    void Promise.resolve().then(loadRecords);
  }, [loadRecords]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const response = await apiRequest(
        editingId ? `${endpoint}/${editingId}` : endpoint,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(form),
        },
      );
      setMessage(response.message);
      resetForm();
      setLoading(true);
      await loadRecords();
    } catch (requestError) {
      setError(
        requestError.message || `Unable to save ${title.toLowerCase()} record.`,
      );
    } finally {
      setSaving(false);
    }
  };

  const editRecord = (record) => {
    setError("");
    setMessage("");
    setEditingId(record.id);
    setForm({
      name: record.name,
      email: record.email || "",
      course: record.course || "",
      roles: record.roles || [],
      status: record.status,
    });
  };

  const deleteRecord = (record) => {
    setRecordToDelete(record);
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;

    const record = recordToDelete;
    setRecordToDelete(null);
    setError("");
    setMessage("");
    try {
      const response = await apiRequest(`${endpoint}/${record.id}`, {
        method: "DELETE",
      });
      setMessage(response.message);
      setLoading(true);
      await loadRecords();
    } catch (requestError) {
      setError(
        requestError.message ||
          `Unable to delete ${title.toLowerCase()} record.`,
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-400";

  return (
    <section>
      {recordToDelete && (
        <ConfirmationModal
          title={`Delete ${isStudents ? "student" : "staff"} record`}
          message={`Delete ${recordToDelete.name}?`}
          confirmLabel="Delete"
          destructive
          onCancel={() => setRecordToDelete(null)}
          onConfirm={confirmDeleteRecord}
        />
      )}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-[#4a4d85]">
            Manage {title.toLowerCase()} profiles stored in the database.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError("");
            loadRecords();
          }}
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-2xl border border-[#cfd3ec] bg-white p-5"
      >
        <h2 className="mb-4 text-lg font-bold">
          {editingId
            ? `Edit ${isStudents ? "student" : "staff"}`
            : `Add ${isStudents ? "student" : "staff"}`}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold">
            Full name
            <input
              required
              value={form.name}
              placeholder="Your full name"
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className={`${inputClass} mt-1.5`}
              autoComplete="name"
            />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input
              required
              type="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className={`${inputClass} mt-1.5`}
              autoComplete="email"
            />
          </label>
          {isStudents && (
            <label className="text-sm font-semibold">
              Course
              <select
                required
                value={form.course}
                onChange={(event) =>
                  setForm({ ...form, course: event.target.value })
                }
                className={`${inputClass} mt-1.5`}
              >
                <option value="">Select a course</option>
                {COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!isStudents && (
            <fieldset className="min-w-0 border-0 p-0 text-sm font-semibold">
              <legend>Staff role(s)</legend>
              <div className="mt-1.5 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-300 p-3">
                {STAFF_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 font-normal"
                  >
                    <input
                      type="checkbox"
                      checked={form.roles.includes(role)}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          roles: current.roles.includes(role)
                            ? current.roles.filter((item) => item !== role)
                            : [...current.roles, role],
                        }))
                      }
                    />
                    {role}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {editingId && (
            <label className="text-sm font-semibold">
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
                className={`${inputClass} mt-1.5`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 rounded-lg bg-[#06066f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
          >
            {saving
              ? "Saving…"
              : editingId
                ? "Save changes"
                : `Add ${isStudents ? "student" : "staff"}`}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="min-h-11 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 sm:w-auto"
          >
            {editingId ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <h2 className="font-semibold text-slate-900">
            {title} records
            <span className="ml-2 text-sm font-normal text-slate-500">
              {filteredRecords.length}
            </span>
          </h2>
          <label className="w-full sm:max-w-sm">
            <span className="sr-only">Search {title.toLowerCase()}</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${isStudents ? "students" : "staff"} by name, ID, email${isStudents ? " or course" : ""}`}
              className={inputClass}
            />
          </label>
        </div>
        {loading ? (
          <p
            role="status"
            className="px-5 py-12 text-center text-sm text-slate-600"
          >
            Loading {title.toLowerCase()}…
          </p>
        ) : error ? null : records.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            No {title.toLowerCase()} records yet.
          </p>
        ) : filteredRecords.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            No {title.toLowerCase()} match your search.
          </p>
        ) : (
          <>
            <div className="space-y-3 p-3 xl:hidden">
              {filteredRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-900">
                        {record.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {isStudents ? record.student_number : record.staff_number}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        record.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-500">Email</dt>
                      <dd className="mt-0.5 break-all text-slate-800">
                        {record.email || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-500">
                        {isStudents ? "Course" : "Roles"}
                      </dt>
                      <dd className="mt-0.5 break-words text-slate-800">
                        {isStudents
                          ? record.course
                          : (record.roles || []).join(", ") || "—"}
                      </dd>
                    </div>
                  </dl>
                  {user.role === "superadmin" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => editRecord(record)}
                        className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(record)}
                        className="min-h-11 flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-175 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Email
                  </th>
                  {isStudents && (
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Course
                    </th>
                  )}
                  {!isStudents && (
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Roles
                    </th>
                  )}
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold">
                      {isStudents ? record.student_number : record.staff_number}
                    </td>
                    <td className="px-5 py-4 font-medium">{record.name}</td>
                    <td className="px-5 py-4">{record.email || "—"}</td>
                    {isStudents && (
                      <td className="px-5 py-4">{record.course}</td>
                    )}
                    {!isStudents && (
                      <td className="px-5 py-4">
                        {(record.roles || []).join(", ")}
                      </td>
                    )}
                    <td className="px-5 py-4 capitalize">{record.status}</td>
                    <td className="px-5 py-4">
                      {user.role === "superadmin" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editRecord(record)}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRecord(record)}
                            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
      {user.role !== "superadmin" && (
        <p className="mt-3 text-sm text-slate-600">
          Only a superadmin can edit or delete profile records.
        </p>
      )}
    </section>
  );
};

export default DirectoryPage;
