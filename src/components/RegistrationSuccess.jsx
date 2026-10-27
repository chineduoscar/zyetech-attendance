import { useState } from "react";

const RegistrationSuccess = ({ identifier, message }) => {
  const [copyMessage, setCopyMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const copyIdentifier = async () => {
    try {
      await navigator.clipboard.writeText(identifier);
      setCopied(true);
      setCopyMessage("ID copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyMessage(
        "Unable to copy automatically. Please select and copy your ID.",
      );
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-[#cfd3ec] bg-[#f6f7ff] p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#06066f] text-white">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <p role="status" className="text-sm font-semibold text-[#06066f]">
          {message}
        </p>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#4a4d85]">
        Your unique ID
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-[#cfd3ec] bg-white px-4 py-3 shadow-2xs">
        <output className="select-all font-mono text-xl font-bold tracking-wide text-[#06066f]">
          {identifier}
        </output>
        <button
          type="button"
          onClick={copyIdentifier}
          className="shrink-0 cursor-pointer rounded-lg border-[1.5px] border-[#06066f] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#06066f] transition-colors hover:bg-[#eef0ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          {copied ? "Copied ✓" : "Copy ID"}
        </button>
      </div>

      {copyMessage && (
        <p role="status" className="mt-2 text-xs font-medium text-[#4a4d85]">
          {copyMessage}
        </p>
      )}
    </div>
  );
};

export default RegistrationSuccess;
