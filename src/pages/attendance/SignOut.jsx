import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, apiRequest } from "../../api/client";
import FieldError from "../../components/FieldError";
import {
  getAttendanceMinutes,
  getAttendanceScheduleError,
} from "../../utils/attendanceSchedule";

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
  const [email, setEmail] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState(() =>
    getAttendanceMinutes(),
  );
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [record, setRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCurrentMinutes(getAttendanceMinutes()), 15000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const scheduleError = getAttendanceScheduleError(
      "sign-out",
      currentMinutes,
    );
    if (scheduleError) {
      setError(scheduleError);
      return;
    }

    const trimmedIdentifier = identifier.trim();
    const trimmedEmail = email.trim();
    const nextErrors = {};
    if (!trimmedIdentifier) nextErrors.identifier = `Enter your ${personType} ID.`;
    if (!trimmedEmail) nextErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setError("");
    setSaving(true);
    try {
      const response = await apiRequest(
        `/api/${personType}-attendance/sign-out`,
        {
          method: "POST",
          body: JSON.stringify({
            identifier: trimmedIdentifier,
            email: trimmedEmail,
          }),
        },
      );
      setRecord(response.data);
      setIdentifier("");
      setEmail("");
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 404) {
        setError(
          `The ${personType} ID and email address do not match an active profile, or no attendance was found for today.`,
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

  const scheduleError = getAttendanceScheduleError(
    "sign-out",
    currentMinutes,
  );

  return (
    <section className="flex min-h-full flex-1 items-center justify-center px-5 py-12">
      <div className="h-fit w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 shadow-sm sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#06066f]">
            {isStaff ? "Staff Sign Out" : "Student Sign Out"}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            Enter your {personType} ID and registered email address to record
            today&apos;s time out. Sign-out closes at 7:00 PM.
          </p>
        </header>

        {record ? (
          <div className="text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef0ff] text-[#06066f]"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <h2
              role="status"
              className="text-2xl font-bold tracking-tight text-[#06066f]"
            >
              Signed out successfully
            </h2>
            <p className="mb-6 mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
              Your time out has been recorded.
            </p>
            <dl className="rounded-xl bg-[#f6f7fc] px-4 text-left">
              <div className="flex items-start justify-between gap-4 border-b border-[#e3e6f5] py-3">
                <dt className="text-sm text-[#4a4d85]">Name</dt>
                <dd className="text-right text-sm font-semibold text-[#06066f]">
                  {record.name}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[#e3e6f5] py-3">
                <dt className="text-sm text-[#4a4d85]">{identifierLabel}</dt>
                <dd className="text-right text-sm font-semibold text-[#06066f]">
                  {isStaff ? record.staff_number : record.student_number}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[#e3e6f5] py-3">
                <dt className="text-sm text-[#4a4d85]">Time in</dt>
                <dd className="text-right text-sm font-semibold text-[#06066f]">
                  {formatTime(record.time_in || record.created_at)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-3 last:border-b-0">
                <dt className="text-sm text-[#4a4d85]">Time out</dt>
                <dd className="text-right text-sm font-semibold text-[#06066f]">
                  {formatTime(record.time_out)}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {(scheduleError || error) && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
              >
                {scheduleError || error}
              </p>
            )}
            <div className="mb-5">
              <label
                htmlFor="sign-out-email"
                className="mb-1.5 block text-sm font-semibold text-[#06066f]"
              >
                Email address
              </label>
              <input
                id="sign-out-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((current) => ({ ...current, email: "" }));
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "sign-out-email-error" : undefined
                }
                className={fieldClass}
              />
              <FieldError id="sign-out-email-error">
                {fieldErrors.email}
              </FieldError>
            </div>
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
                  setFieldErrors((current) => ({
                    ...current,
                    identifier: "",
                  }));
                  setError("");
                }}
                placeholder={isStaff ? "e.g. E26/001" : "e.g. S26/001"}
                autoComplete="off"
                aria-invalid={Boolean(fieldErrors.identifier)}
                aria-describedby={
                  fieldErrors.identifier
                    ? "sign-out-identifier-error"
                    : undefined
                }
                className={fieldClass}
              />
              <FieldError id="sign-out-identifier-error">
                {fieldErrors.identifier}
              </FieldError>
            </div>
            <button
              type="submit"
              disabled={saving || Boolean(scheduleError)}
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
