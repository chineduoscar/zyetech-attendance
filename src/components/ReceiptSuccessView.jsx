import { useRef, useState } from "react";

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const ReceiptSuccessView = ({ onReset, onDownload, studentName, course }) => {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const lockRef = useRef(false);

  const runDownload = async (action) => {
    if (lockRef.current) return false;
    lockRef.current = true;
    setBusy(action);
    setError("");
    setShareUrl("");

    try {
      await onDownload();
      return true;
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Unable to download the receipt. Please try again.",
      );
      return false;
    } finally {
      lockRef.current = false;
      setBusy("");
    }
  };

  const handleWhatsAppShare = async () => {
    const message = encodeURIComponent(
      `Hello ${studentName}, here is your payment receipt for your enrollment in ${course} at Zyetech Innovation Technology.`,
    );
    const url = `https://api.whatsapp.com/send?text=${message}`;
    const shareWindow = window.open("", "_blank");
    const downloaded = await runDownload("whatsapp");

    if (!downloaded) {
      shareWindow?.close();
      return;
    }

    if (shareWindow) {
      shareWindow.location.href = url;
    } else {
      setShareUrl(url);
    }
  };

  const isBusy = Boolean(busy);

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="h-12 w-12 object-contain"
        />
        <h1 className="text-xl font-bold text-[#06066f]">Zyetech</h1>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Innovation Technology
        </p>
      </div>

      <div className="space-y-2 py-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">
          Your receipt is ready
        </h2>
        <p className="text-sm text-slate-500">
          Download the PDF or share it through WhatsApp. It is not saved in the
          app.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-left text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => runDownload("download")}
          disabled={isBusy}
          aria-busy={busy === "download"}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#06066f] px-4 py-3 font-semibold text-white shadow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "download" ? (
            <>
              <Spinner />
              <span>Downloading...</span>
            </>
          ) : (
            "Download Receipt"
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          disabled={isBusy}
          aria-busy={busy === "whatsapp"}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "whatsapp" ? (
            <>
              <Spinner />
              <span>Preparing receipt...</span>
            </>
          ) : (
            "Download & Share via WhatsApp"
          )}
        </button>

        {shareUrl && (
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-sm font-semibold text-emerald-700 underline"
          >
            Continue to WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={isBusy}
          className="w-full cursor-pointer pt-2 text-xs text-slate-500 transition-colors hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Another Receipt
        </button>
      </div>
    </section>
  );
};

export default ReceiptSuccessView;
