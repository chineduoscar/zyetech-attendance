import { useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, apiRequest } from "../../api/client";
import FieldError from "../../components/FieldError";

const fieldClass =
  "w-full rounded-xl border-[1.5px] border-[#cfd3ec] bg-white px-4 py-3 text-[#06066f] placeholder:text-[#9498c1] transition-colors hover:border-[#b4b9e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";
const linkClass =
  "font-semibold text-[#06066f] underline underline-offset-2 hover:text-[#04044f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "—";

const SignOut = ({ type }) => {
  const isStaff = type === "staff";
  const personType = isStaff ? "staff" : "student";
  const identifierLabel = isStaff ? "Staff ID" : "Student ID";
  const attendancePath = isStaff ? "/staff/attendance" : "/student/attendance";
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [record, setRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setFieldError(`Enter your ${personType} ID.`);
      return;
    }

    setFieldError("");
    setError("");
    setSaving(true);
    try {
      const response = await apiRequest(
        `/api/${personType}-attendance/sign-out`,
        {
          method: "POST",
          body: JSON.stringify({ identifier: trimmedIdentifier }),
        },
      );
      setRecord(response.data);
      setIdentifier("");
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 404) {
        setError(
          `No attendance was found for this ${personType} today. Mark attendance before signing out.`,
        );
      } else if (
        requestError instanceof ApiError &&
        requestError.status === 409
      ) {
        setError(`This ${personType} has already signed out today.`);
      } else {
        setError(
          requestError.message || "Unable to sign out. Please try again.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex min-h-full flex-1 items-center justify-center px-5 py-12">
      <div className="h-fit w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 shadow-sm sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#06066f]">
            {isStaff ? "Staff Sign Out" : "Student Sign Out"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            Enter your {personType} ID to record today&apos;s time out.
          </p>
        </header>

        {record ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <p className="font-semibold text-emerald-900">
              Signed out successfully
            </p>
            <dl className="mt-3 space-y-2 text-sm text-emerald-950">
              <div className="flex justify-between gap-4">
                <dt>{identifierLabel}</dt>
                <dd className="font-semibold">
                  {isStaff ? record.staff_number : record.student_number}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Time in</dt>
                <dd className="font-semibold">
                  {formatTime(record.time_in || record.created_at)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Time out</dt>
                <dd className="font-semibold">{formatTime(record.time_out)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            <div className="mb-6">
              <label
                htmlFor="sign-out-identifier"
                className="mb-1.5 block text-sm font-semibold text-[#06066f]"
              >
                {identifierLabel}
              </label>
              <input
                id="sign-out-identifier"
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  setFieldError("");
                  setError("");
                }}
                placeholder={isStaff ? "e.g. E26/001" : "e.g. S26/001"}
                autoComplete="off"
                aria-invalid={Boolean(fieldError)}
                aria-describedby={
                  fieldError ? "sign-out-identifier-error" : undefined
                }
                className={fieldClass}
              />
              <FieldError id="sign-out-identifier-error">
                {fieldError}
              </FieldError>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded-xl bg-[#06066f] py-3.5 font-semibold text-white shadow-xs transition-all hover:bg-[#04044f] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              {saving ? "Signing out…" : "Sign out"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-[#4a4d85]">
          <Link to={attendancePath} className={linkClass}>
            Return to {personType} attendance
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignOut;
