import { useState } from "react";
import { ApiError, apiRequest } from "../../api/client";
import RegistrationSuccess from "../../components/RegistrationSuccess";
import FieldError from "../../components/FieldError";
import { STAFF_ROLES } from "../../data/data";

const emptyForm = { name: "", email: "", roles: [] };

const fieldClass = (hasError) =>
  `w-full rounded-xl border-[1.5px] px-4 py-3 text-[#06066f] placeholder:text-[#9498c1] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
    hasError
      ? "border-red-600 bg-red-50/40 focus-visible:outline-red-400"
      : "border-[#cfd3ec] bg-white focus-visible:outline-indigo-400 hover:border-[#b4b9e4]"
  }`;

const StaffOnboarding = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [staffNumber, setStaffNumber] = useState("");
  const [serverError, setServerError] = useState("");

  const updateField = (event) => {
    setErrors((current) => ({ ...current, [event.target.name]: undefined }));
    setSuccess("");
    setStaffNumber("");
    setServerError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleRole = (role) => {
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((r) => r !== role)
        : [...current.roles, role],
    }));
    setErrors((current) => ({ ...current, roles: undefined }));
    setSuccess("");
    setStaffNumber("");
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    if (form.roles.length === 0) next.roles = "Select at least one role.";
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
      const response = await apiRequest("/api/staff", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          roles: form.roles,
        }),
      });
      setForm(emptyForm);
      setErrors({});
      setSuccess(response.message || "Staff registered successfully.");
      setStaffNumber(response.data.staff.staff_number);
    } catch (requestError) {
      const fieldErrors =
        requestError instanceof ApiError ? requestError.errors : {};
      if (requestError.status === 409 && !fieldErrors.email) {
        fieldErrors.email = requestError.message;
      }
      setErrors(fieldErrors);
      setStaffNumber("");
      if (Object.keys(fieldErrors).length === 0) {
        setServerError(requestError.message || "Unable to register staff.");
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
            Staff onboarding
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            Enter your details to register.
          </p>
        </header>

        {success && staffNumber ? (
          <RegistrationSuccess identifier={staffNumber} message={success} />
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
                  htmlFor="sf-name"
                  className="mb-1.5 block text-sm font-semibold text-[#06066f]"
                >
                  Full name
                </label>
                <input
                  id="sf-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "sf-name-error" : undefined}
                  className={fieldClass(errors.name)}
                />
                <FieldError id="sf-name-error">{errors.name}</FieldError>
              </div>

              <div className="mb-4 sm:mb-5">
                <label
                  htmlFor="sf-email"
                  className="mb-1.5 block text-sm font-semibold text-[#06066f]"
                >
                  Email address
                </label>
                <input
                  id="sf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "sf-email-error" : undefined}
                  className={fieldClass(errors.email)}
                />
                <FieldError id="sf-email-error">{errors.email}</FieldError>
              </div>

              <fieldset className="mb-6 min-w-0 border-0 p-0">
                <legend className="mb-0.5 p-0 text-sm font-semibold text-[#06066f]">
                  Your role(s) at Zyetech
                </legend>
                <p className="mb-2 text-xs text-[#4a4d85]">
                  Select all that apply.
                </p>
                <div
                  className={`max-h-64 space-y-2 overflow-y-auto rounded-xl border-[1.5px] p-3 transition-colors ${
                    errors.roles
                      ? "border-red-600 bg-red-50/40"
                      : "border-[#cfd3ec] bg-white"
                  }`}
                >
                  {STAFF_ROLES.map((role) => (
                    <label
                      key={role}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[#06066f]"
                    >
                      <input
                        type="checkbox"
                        checked={form.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="h-4 w-4 shrink-0 accent-[#06066f]"
                      />
                      {role}
                    </label>
                  ))}
                </div>
                <FieldError id="sf-roles-error">{errors.roles}</FieldError>
              </fieldset>

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

export default StaffOnboarding;
