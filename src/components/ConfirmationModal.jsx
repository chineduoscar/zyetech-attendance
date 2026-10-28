import { useEffect, useRef } from "react";

const ConfirmationModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50"
    >
      <div className="p-6">
        <h2 className="text-lg font-bold" id="confirmation-modal-title">
          {title}
        </h2>
        <p
          className="mt-2 text-sm leading-6 text-slate-600"
          id="confirmation-modal-description"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
              destructive
                ? "bg-red-700 hover:bg-red-800"
                : "bg-[#06066f] hover:bg-[#04044f]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
