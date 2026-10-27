import { useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";

const displayDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const UserManagement = () => {
  const { user: currentUser, refreshSession } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const isSuperadmin = currentUser.role === "superadmin";

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest("/api/users");
      setUsers(response.data.users);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        [401, 403].includes(requestError.status)
      ) {
        await refreshSession();
      } else {
        setError(requestError.message || "Unable to load users.");
      }
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateUser = async (targetUser, operation, payload, confirmation) => {
    if (confirmation && !window.confirm(confirmation)) return;
    setError("");
    setMessage("");
    setSavingId(targetUser.id);
    try {
      const response = await apiRequest(`/api/users/${targetUser.id}/${operation}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setMessage(response.message);
      await loadUsers();
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        [401, 403].includes(requestError.status)
      ) {
        await refreshSession();
      } else {
        setError(requestError.message || "Unable to update this user.");
      }
    } finally {
      setSavingId("");
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review registered accounts, approval status, and access roles.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p role="status" className="px-5 py-12 text-center text-sm text-slate-600">
            Loading users…
          </p>
        ) : users.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            No registered users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Approval</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Registered</th>
                  {isSuperadmin && (
                    <th scope="col" className="px-5 py-3 font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {users.map((account) => {
                  const isSelf = account.id === currentUser.id;
                  const saving = savingId === account.id;
                  return (
                    <tr key={account.id} className="align-top hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium">
                        {account.name}
                        {isSelf && <span className="ml-2 text-xs text-slate-500">(you)</span>}
                      </td>
                      <td className="px-5 py-4">{account.email}</td>
                      <td className="px-5 py-4 capitalize">{account.role}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          account.approval_status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {account.approval_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{displayDate(account.created_at)}</td>
                      {isSuperadmin && (
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {!isSelf && account.approval_status === "pending" && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => updateUser(
                                  account,
                                  "approval",
                                  { approval_status: "approved" },
                                )}
                                className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Approve"}
                              </button>
                            )}
                            {!isSelf && account.approval_status === "approved" && account.role === "user" && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => updateUser(
                                  account,
                                  "role",
                                  { role: "admin" },
                                  `Promote ${account.name} to admin? This grants access to the admin dashboard.`,
                                )}
                                className="rounded-md bg-[#06066f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#04044f] disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Make admin"}
                              </button>
                            )}
                            {!isSelf && account.approval_status === "approved" && account.role === "admin" && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => updateUser(
                                  account,
                                  "role",
                                  { role: "superadmin" },
                                  `Promote ${account.name} to superadmin? This grants full user-management privileges.`,
                                )}
                                className="rounded-md bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-800 disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Make superadmin"}
                              </button>
                            )}
                            {!isSelf && account.role === "admin" && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => updateUser(
                                  account,
                                  "role",
                                  { role: "user" },
                                  `Revoke admin access for ${account.name}?`,
                                )}
                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Revoke admin"}
                              </button>
                            )}
                            {!isSelf && account.role === "superadmin" && (
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => updateUser(
                                  account,
                                  "role",
                                  { role: "admin" },
                                  `Remove superadmin privileges from ${account.name}?`,
                                )}
                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                              >
                                {saving ? "Saving…" : "Revoke superadmin"}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!isSuperadmin && (
        <p className="mt-4 text-sm text-slate-600">
          Only a superadmin can approve accounts or change user roles.
        </p>
      )}
    </section>
  );
};

export default UserManagement;
