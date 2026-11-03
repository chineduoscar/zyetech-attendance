import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );
};

const AllReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReceipts = useCallback(async () => {
    try {
      const response = await apiRequest("/api/receipts");
      setReceipts(response.data.receipts);
    } catch (requestError) {
      setError(requestError.message || "Unable to load receipts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadReceipts);
  }, [loadReceipts]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Receipts</h1>
          <p className="mt-2 text-sm text-[#4a4d85]">
            Browse saved payments and view their Cloudinary receipt files.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError("");
            loadReceipts();
          }}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Refresh"}
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

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && receipts.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            Loading receipts…
          </p>
        ) : receipts.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-600">
            No saved receipts yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3">Receipt</th>
                  <th scope="col" className="px-5 py-3">Student</th>
                  <th scope="col" className="px-5 py-3">Course</th>
                  <th scope="col" className="px-5 py-3">Amount</th>
                  <th scope="col" className="px-5 py-3">Date</th>
                  <th scope="col" className="px-5 py-3">Payment method</th>
                  <th scope="col" className="px-5 py-3">File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="text-slate-700">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {receipt.receipt_number}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {receipt.student_name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {receipt.student_number || "Not linked to a student ID"}
                      </p>
                    </td>
                    <td className="px-5 py-4">{receipt.course}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      ₦{Number(receipt.amount).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {formatDate(receipt.payment_date)}
                    </td>
                    <td className="px-5 py-4">
                      {receipt.payment_method || "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {receipt.image_url ? (
                        <a
                          href={receipt.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#06066f] underline"
                        >
                          View receipt
                        </a>
                      ) : (
                        <span className="text-slate-400">No file</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllReceipts;
