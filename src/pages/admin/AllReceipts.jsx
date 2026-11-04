import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import ConfirmationModal from "../../components/ConfirmationModal";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );
};

const getDownloadUrl = (url) =>
  url.includes("/upload/") && !url.includes("/upload/fl_attachment/")
    ? url.replace("/upload/", "/upload/fl_attachment/")
    : url;

const getFileName = (receiptNumber) =>
  `${String(receiptNumber || "receipt").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

const AllReceipts = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [deletingReceiptId, setDeletingReceiptId] = useState("");
  const isSuperadmin = user?.role === "superadmin";

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

  const confirmDeleteReceipt = async () => {
    if (!receiptToDelete) return;
    const receipt = receiptToDelete;
    setReceiptToDelete(null);
    setError("");
    setMessage("");
    setDeletingReceiptId(receipt.id);
    try {
      const response = await apiRequest(`/api/receipts/${receipt.id}`, {
        method: "DELETE",
      });
      setReceipts((current) =>
        current.filter((item) => item.id !== receipt.id),
      );
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to delete this receipt.");
    } finally {
      setDeletingReceiptId("");
    }
  };

  return (
    <section>
      {receiptToDelete && (
        <ConfirmationModal
          title="Delete receipt"
          message={`Permanently delete receipt ${receiptToDelete.receipt_number}? Its PDF will also be deleted from Cloudinary.`}
          confirmLabel="Delete receipt"
          destructive
          onCancel={() => setReceiptToDelete(null)}
          onConfirm={confirmDeleteReceipt}
        />
      )}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Receipts</h1>
          <p className="mt-2 text-sm text-[#4a4d85]">
            Browse saved payments and download receipt PDFs.
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
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60 sm:w-auto"
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
      {message && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {message}
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
          <>
            <div className="space-y-3 p-3 xl:hidden">
              {receipts.map((receipt) => (
                <article
                  key={receipt.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-all font-semibold text-slate-900">
                        {receipt.receipt_number}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-700">
                        {receipt.student_name}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-slate-900">
                      ₦{Number(receipt.amount).toLocaleString()}
                    </p>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
                    <div className="min-w-0">
                      <dt className="text-slate-500">Course</dt>
                      <dd className="mt-1 break-words font-medium text-slate-800">
                        {receipt.course}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Date</dt>
                      <dd className="mt-1 font-medium text-slate-800">
                        {formatDate(receipt.payment_date)}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500">Payment method</dt>
                      <dd className="mt-1 font-medium text-slate-800">
                        {receipt.payment_method || "—"}
                      </dd>
                    </div>
                  </dl>
                  {receipt.image_url ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a
                        href={receipt.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-center rounded-lg border border-[#06066f] px-3 py-2 text-sm font-semibold text-[#06066f]"
                      >
                        View receipt
                      </a>
                      <a
                        href={getDownloadUrl(receipt.image_url)}
                        download={getFileName(receipt.receipt_number)}
                        className="flex min-h-11 items-center justify-center rounded-lg bg-[#06066f] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <p className="mt-4 text-center text-sm text-slate-400">
                      Receipt file unavailable
                    </p>
                  )}
                  {isSuperadmin && (
                    <button
                      type="button"
                      onClick={() => setReceiptToDelete(receipt)}
                      disabled={deletingReceiptId === receipt.id}
                      className="mt-3 min-h-11 w-full rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
                    >
                      {deletingReceiptId === receipt.id
                        ? "Deleting…"
                        : "Delete receipt"}
                    </button>
                  )}
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto xl:block">
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
                    {isSuperadmin && (
                      <th scope="col" className="px-5 py-3">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="text-slate-700">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                        {receipt.receipt_number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{receipt.student_name}</p>
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
                          <div className="flex items-center gap-3">
                            <a
                              href={receipt.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#06066f] underline"
                            >
                              View
                            </a>
                            <a
                              href={getDownloadUrl(receipt.image_url)}
                              download={getFileName(receipt.receipt_number)}
                              className="font-semibold text-[#06066f] underline"
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400">No file</span>
                        )}
                      </td>
                      {isSuperadmin && (
                        <td className="whitespace-nowrap px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setReceiptToDelete(receipt)}
                            disabled={deletingReceiptId === receipt.id}
                            className="font-semibold text-red-700 underline disabled:opacity-60"
                          >
                            {deletingReceiptId === receipt.id
                              ? "Deleting…"
                              : "Delete"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllReceipts;
