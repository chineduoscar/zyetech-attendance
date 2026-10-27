import { useState } from "react";
import AttendanceVerification from "./VerifyAttendance";
import { COURSES } from "../../data/data";
import { apiRequest } from "../../api/client";

const fieldClass = (hasError) =>
  `w-full rounded-lg border-[1.5px] bg-white px-3.5 py-3 text-[#06066f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
    hasError ? "border-red-700" : "border-[#cfd3ec]"
  }`;

const StaffAttendance = () => {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Enter your full name.";
    if (!course) next.course = "Select a course.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const response = await apiRequest("/api/staff-attendance", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), course }),
      });
      setSubmitted({
        ...response.data,
        time: response.data.created_at,
      });
      setName("");
      setCourse("");
    } catch (error) {
      setErrors({
        form:
          error.message || "Attendance could not be saved. Please try again.",
      });
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

  return (
    <section className="flex min-h-full w-full flex-1 items-center justify-center px-0 py-4 sm:px-5 sm:py-10">
      <div className="h-fit w-full max-w-120 rounded-2xl border border-[#cfd3ec] bg-white p-5 sm:p-8">
        <h1 className="mb-1.5 text-xl font-bold leading-tight sm:text-2xl">
          Staff Attendance
        </h1>
        <p className="mb-5 text-sm text-[#4a4d85] sm:mb-6 sm:text-[0.95rem]">
          Enter your name and the course you are teaching today.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <p role="alert" className="mb-4 text-sm text-red-700">
              {errors.form}
            </p>
          )}
          <div className="mb-4 sm:mb-5">
            <label
              htmlFor="sa-name"
              className="mb-1.5 block text-sm font-semibold"
            >
              Name
            </label>
            <input
              id="sa-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-700">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="sa-course"
              className="mb-1.5 block text-sm font-semibold"
            >
              Course
            </label>
            <select
              id="sa-course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={fieldClass(errors.course)}
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.course && (
              <p className="mt-1.5 text-sm text-red-700">{errors.course}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer rounded-lg bg-[#06066f] py-3 font-bold text-white transition-colors hover:bg-[#04044f] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            {saving ? "Saving…" : "Mark attendance"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default StaffAttendance;
