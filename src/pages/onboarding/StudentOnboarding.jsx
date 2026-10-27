import { useState } from "react";
import { ApiError, apiRequest } from "../../api/client";
import RegistrationSuccess from "../../components/RegistrationSuccess";
import FieldError from "../../components/FieldError";
import { COURSES } from "../../data/data";

const emptyForm = { name: "", email: "", course: "" };

const fieldClass = (hasError) =>
  `w-full rounded-xl border-[1.5px] px-4 py-3 text-[#06066f] placeholder:text-[#9498c1] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
    hasError
      ? "border-red-600 bg-red-50/40 focus-visible:outline-red-400"
      : "border-[#cfd3ec] bg-white focus-visible:outline-indigo-400 hover:border-[#b4b9e4]"
  }`;

const StudentOnboarding = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [serverError, setServerError] = useState("");

  const updateField = (event) => {
    setErrors((current) => ({ ...current, [event.target.name]: undefined }));
    setSuccess("");
    setStudentNumber("");
    setServerError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    if (!form.course) next.course = "Select your course.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setSuccess("");
    setServerError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const response = await apiRequest("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          course: form.course,
        }),
      });
      setForm(emptyForm);
      setErrors({});
      setSuccess(response.message || "Student registered successfully.");
      setStudentNumber(response.data.student.student_number);
    } catch (requestError) {
      const fieldErrors =
        requestError instanceof ApiError ? requestError.errors : {};
      if (requestError.status === 409 && !fieldErrors.email) {
        fieldErrors.email = requestError.message;
      }
      setErrors(fieldErrors);
      setStudentNumber("");
      if (Object.keys(fieldErrors).length === 0) {
        setServerError(requestError.message || "Unable to register student.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#06066f]">
            Student onboarding
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            Enter your details to register.
          </p>
        </header>

        {success && studentNumber ? (
          <RegistrationSuccess identifier={studentNumber} message={success} />
        ) : (
          <>
            {serverError && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 border-l-4 border-l-red-600 bg-red-50/70 p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-red-900">
                  Registration failed
                </p>
                <p className="mt-0.5 text-sm text-red-800">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="so-name"
                  className="mb-1.5 block text-sm font-semibold text-[#06066f]"
                >
                  Full name
                </label>
                <input
                  id="so-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "so-name-error" : undefined}
                  className={fieldClass(errors.name)}
                />
                <FieldError id="so-name-error">{errors.name}</FieldError>
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="so-email"
                  className="mb-1.5 block text-sm font-semibold text-[#06066f]"
                >
                  Email address
                </label>
                <input
                  id="so-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "so-email-error" : undefined}
                  className={fieldClass(errors.email)}
                />
                <FieldError id="so-email-error">{errors.email}</FieldError>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="so-course"
                  className="mb-1.5 block text-sm font-semibold text-[#06066f]"
                >
                  Course
                </label>
                <select
                  id="so-course"
                  name="course"
                  value={form.course}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.course)}
                  aria-describedby={
                    errors.course ? "so-course-error" : undefined
                  }
                  className={fieldClass(errors.course)}
                >
                  <option value="">Select your course</option>
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FieldError id="so-course-error">{errors.course}</FieldError>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer rounded-xl bg-[#06066f] py-3.5 font-semibold text-white shadow-xs transition-all hover:bg-[#04044f] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};

export default StudentOnboarding;
