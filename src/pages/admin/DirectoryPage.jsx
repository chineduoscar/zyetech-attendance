import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { COURSES, STAFF_ROLES } from "../../data/data";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
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

  const loadRecords = useCallback(async () => {
    try {
      const response = await apiRequest(endpoint);
      setRecords(response.data.records);
    } catch (requestError) {
      setError(requestError.message || `Unable to load ${title.toLowerCase()}.`);
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
      setError(requestError.message || `Unable to save ${title.toLowerCase()} record.`);
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
      phone: record.phone || "",
      course: record.course || "",
      roles: record.roles || [],
      status: record.status,
    });
  };

  const deleteRecord = async (record) => {
    if (!window.confirm(`Delete ${record.name}?`)) return;
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
      setError(requestError.message || `Unable to delete ${title.toLowerCase()} record.`);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-400";

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
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
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>}

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-[#cfd3ec] bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">
          {editingId ? `Edit ${isStudents ? "student" : "staff"}` : `Add ${isStudents ? "student" : "staff"}`}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold">
            Full name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className={`${inputClass} mt-1.5`}
              autoComplete="name"
            />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className={`${inputClass} mt-1.5`}
              autoComplete="email"
            />
          </label>
          <label className="text-sm font-semibold">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className={`${inputClass} mt-1.5`}
              autoComplete="tel"
            />
          </label>
          {isStudents && (
            <label className="text-sm font-semibold">
              Course
              <select
                required
                value={form.course}
                onChange={(event) => setForm({ ...form, course: event.target.value })}
                className={`${inputClass} mt-1.5`}
              >
                <option value="">Select a course</option>
                {COURSES.map((course) => <option key={course} value={course}>{course}</option>)}
              </select>
            </label>
          )}
          {!isStudents && (
            <fieldset className="min-w-0 border-0 p-0 text-sm font-semibold">
              <legend>Staff role(s)</legend>
              <div className="mt-1.5 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-300 p-3">
                {STAFF_ROLES.map((role) => (
                  <label key={role} className="flex items-center gap-2 font-normal">
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
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className={`${inputClass} mt-1.5`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#06066f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : `Add ${isStudents ? "student" : "staff"}`}
          </button>
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
            {editingId ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p role="status" className="px-5 py-12 text-center text-sm text-slate-600">Loading {title.toLowerCase()}…</p>
        ) : error ? null : records.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">No {title.toLowerCase()} records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">ID</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Phone</th>
                  {isStudents && <th scope="col" className="px-5 py-3 font-semibold">Course</th>}
                  {!isStudents && <th scope="col" className="px-5 py-3 font-semibold">Roles</th>}
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold">{isStudents ? record.student_number : record.staff_number}</td>
                    <td className="px-5 py-4 font-medium">{record.name}</td>
                    <td className="px-5 py-4">{record.email || "—"}</td>
                    <td className="px-5 py-4">{record.phone || "—"}</td>
                    {isStudents && <td className="px-5 py-4">{record.course}</td>}
                    {!isStudents && <td className="px-5 py-4">{(record.roles || []).join(", ")}</td>}
                    <td className="px-5 py-4 capitalize">{record.status}</td>
                    <td className="px-5 py-4">
                      {user.role === "superadmin" && (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => editRecord(record)} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                            Edit
                          </button>
                          <button type="button" onClick={() => deleteRecord(record)} className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700">
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
        )}
      </div>
      {user.role !== "superadmin" && (
        <p className="mt-3 text-sm text-slate-600">Only a superadmin can edit or delete profile records.</p>
      )}
    </section>
  );
};

export default DirectoryPage;
