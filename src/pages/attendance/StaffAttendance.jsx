import { useState } from "react";
import AttendanceVerification from "./VerifyAttendance";
import { ApiError, apiRequest } from "../../api/client";
import FieldError from "../../components/FieldError";
import { Link } from "react-router-dom";

const fieldClass = (hasError) =>
  `w-full rounded-xl border-[1.5px] px-4 py-3 text-[#06066f] placeholder:text-[#9498c1] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
    hasError
      ? "border-red-600 bg-red-50/40 focus-visible:outline-red-400"
      : "border-[#cfd3ec] bg-white focus-visible:outline-indigo-400 hover:border-[#b4b9e4]"
  }`;

const linkClass =
  "font-semibold text-[#06066f] underline underline-offset-2 hover:text-[#04044f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

const StaffAttendance = () => {
  const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [saving, setSaving] = useState(false);

  const clearErrors = (field) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
    setNotFound(false);
  };

  const validate = () => {
    const next = {};
    if (!identifier.trim()) next.identifier = "Enter your staff ID.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setNotFound(false);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const response = await apiRequest("/api/staff-attendance", {
        method: "POST",
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      setSubmitted({
        ...response.data,
        time: response.data.created_at,
      });
      setIdentifier("");
    } catch (error) {
      const fieldErrors =
        error instanceof ApiError && error.errors ? { ...error.errors } : {};

      if (error.status === 404) {
        setNotFound(true);
        setErrors({ identifier: "No staff found with this ID." });
      } else if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setErrors({
          form:
            error.message || "Attendance could not be saved. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // After a successful submit, go to the verification page
  if (submitted) {
    return (
      <AttendanceVerification
        record={submitted}
        onDone={() => setSubmitted(null)}
      />
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <section className="flex min-h-full flex-1 items-center justify-center px-5 py-12">
      <div className="h-fit w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 shadow-sm sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#06066f]">
            Staff Attendance
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            Enter your staff ID to mark attendance.
          </p>
        </header>

        {notFound && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-amber-200 border-l-4 border-l-amber-500 bg-amber-50/70 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-amber-950">
                Staff ID not found. Check for typos or register.
              </p>
              <Link
                to="/onboarding/staff"
                className="shrink-0 rounded-lg border-[1.5px] border-[#06066f] bg-white px-3 py-1.5 text-xs font-semibold text-[#06066f] transition-colors hover:bg-[#eef0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Get your staff ID
              </Link>
            </div>
          </div>
        )}

        {errors.form && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 border-l-4 border-l-red-600 bg-red-50/70 p-4 shadow-sm"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M8.26 3.1c.75-1.34 2.73-1.34 3.48 0l6.1 10.9c.74 1.33-.22 2.99-1.74 2.99H3.9c-1.52 0-2.48-1.66-1.74-2.99L8.26 3.1zM10 7a.9.9 0 00-.9.98l.35 3.5a.55.55 0 001.1 0l.35-3.5A.9.9 0 0010 7zm0 6.2a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-900">
                Attendance not saved
              </p>
              <p className="mt-0.5 text-sm text-red-800">{errors.form}</p>
            </div>
          </div>
        )}

        {errorCount > 0 && !notFound && !errors.form && (
          <p role="alert" className="sr-only">
            There {errorCount === 1 ? "is 1 error" : `are ${errorCount} errors`}{" "}
            in the form.
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label
              htmlFor="sa-identifier"
              className="mb-1.5 block text-sm font-semibold text-[#06066f]"
            >
              Staff ID
            </label>
            <input
              id="sa-identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                clearErrors("identifier");
              }}
              placeholder="e.g. E26/001"
              autoComplete="off"
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={
                errors.identifier ? "sa-identifier-error" : undefined
              }
              className={fieldClass(errors.identifier)}
            />
            <FieldError id="sa-identifier-error">
              {errors.identifier}
            </FieldError>
          </div>

          <div className="mb-6 text-center text-xs text-[#4a4d85]">
            Haven&apos;t gotten a staff ID?{" "}
            <Link to="/onboarding/staff" className={linkClass}>
              Get your staff ID
            </Link>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer rounded-xl bg-[#06066f] py-3.5 font-semibold text-white shadow-xs transition-all hover:bg-[#04044f] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {saving ? "Saving…" : "Mark attendance"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default StaffAttendance;
