import { useState } from "react";
import { customAlphabet } from "nanoid";
import { COURSES } from "../../data/data";
import ReceiptSuccessView from "../../components/ReceiptSuccessView";

const generateReceiptId = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6,
);

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#06066f]";

const Field = ({ label, children }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
    {label}
    <span className="mt-1 block">{children}</span>
  </label>
);

const getInitialDate = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getReceiptNumber = () => `PR-${generateReceiptId()}`;

const GenerateReceipt = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [course, setCourse] = useState(COURSES[0]);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [totalCost, setTotalCost] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [previousPaid, setPreviousPaid] = useState("");
  const [paymentPlan, setPaymentPlan] = useState("Full payment");
  const [installmentStructure, setInstallmentStructure] = useState("2-part");
  const [currentStage, setCurrentStage] = useState("1st");
  const [settleByDate, setSettleByDate] = useState("");
  const [note, setNote] = useState("");
  const [includeReceiptNumber, setIncludeReceiptNumber] = useState(true);
  const [receiptNumber, setReceiptNumber] = useState(getReceiptNumber);
  const [receiptDate, setReceiptDate] = useState(getInitialDate);

  const numericTotal = Number(totalCost) || 0;
  const numericCurrentPaid = Number(amountPaid) || 0;
  const numericPreviousPaid =
    paymentPlan === "Installment" && currentStage !== "1st"
      ? Number(previousPaid) || 0
      : 0;
  const totalPaid = numericPreviousPaid + numericCurrentPaid;
  const outstandingBalance = Math.max(0, numericTotal - totalPaid);
  const isFinalPayment =
    paymentPlan === "Full payment" ||
    (paymentPlan === "Installment" &&
      ((installmentStructure === "2-part" && currentStage === "2nd") ||
        (installmentStructure === "3-part" && currentStage === "3rd")));

  const getReceiptData = () => ({
    studentName,
    studentPhone,
    course,
    totalCost: numericTotal,
    amountPaid: numericCurrentPaid,
    previousPaid: numericPreviousPaid,
    totalPaid,
    outstandingBalance,
    paymentMethod,
    paymentPlan,
    installmentStructure,
    currentStage,
    settleByDate,
    note,
    receiptNumber: includeReceiptNumber ? receiptNumber : "",
    receiptDate,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const handleDownload = async () => {
    const { generatePDFReceipt } = await import("../../utils/downloadReceipt");
    await generatePDFReceipt(getReceiptData());
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setStudentName("");
    setStudentPhone("");
    setCourse(COURSES[0]);
    setPaymentMethod("Bank Transfer");
    setTotalCost("");
    setAmountPaid("");
    setPreviousPaid("");
    setPaymentPlan("Full payment");
    setInstallmentStructure("2-part");
    setCurrentStage("1st");
    setSettleByDate("");
    setNote("");
    setIncludeReceiptNumber(true);
    setReceiptNumber(getReceiptNumber());
    setReceiptDate(getInitialDate());
  };

  if (isSubmitted) {
    return (
      <ReceiptSuccessView
        onReset={resetForm}
        onDownload={handleDownload}
        studentName={studentName}
        course={course}
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generate Receipt</h1>
        <p className="mt-2 text-sm text-[#4a4d85]">
          Create and download a student payment receipt. Receipts are generated
          in this browser and are not saved to a database.
        </p>
      </div>

      <header className="mb-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold text-[#06066f]">Zyetech</h2>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              Innovation Technology
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Payment Receipt Generator
        </span>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="mb-6 border-b border-slate-100 pb-3 text-lg font-semibold text-[#06066f]">
          Create Payment Receipt
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student Name">
              <input
                type="text"
                required
                autoComplete="name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="e.g. Jane Doe"
                className={inputClass}
              />
            </Field>
            <Field label="Student Phone Number">
              <input
                type="tel"
                autoComplete="tel"
                value={studentPhone}
                onChange={(event) => setStudentPhone(event.target.value)}
                placeholder="e.g. 09068097269"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Course / Program">
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className={inputClass}
            >
              {COURSES.map((courseName) => (
                <option key={courseName} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Total Cost (₦)">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={totalCost}
                onChange={(event) => setTotalCost(event.target.value)}
                placeholder="e.g. 120000"
                className={inputClass}
              />
            </Field>
            <Field label="Amount Paid This Session (₦)">
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amountPaid}
                onChange={(event) => setAmountPaid(event.target.value)}
                placeholder="e.g. 60000"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex flex-col justify-between gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Calculated Outstanding Balance
            </span>
            <span className="text-lg font-bold text-slate-900">
              ₦{outstandingBalance.toLocaleString()}
            </span>
          </div>

          <Field label="Payment Method">
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className={inputClass}
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="POS / Card">POS / Card</option>
              <option value="Cash">Cash</option>
            </select>
          </Field>

          <Field label="Payment Plan Type">
            <select
              value={paymentPlan}
              onChange={(event) => setPaymentPlan(event.target.value)}
              className={inputClass}
            >
              <option value="Full payment">Full Payment</option>
              <option value="Installment">Installment</option>
            </select>
          </Field>

          {paymentPlan === "Installment" && (
            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Installment Structure">
                  <select
                    value={installmentStructure}
                    onChange={(event) => {
                      const nextStructure = event.target.value;
                      setInstallmentStructure(nextStructure);
                      if (nextStructure === "2-part" && currentStage === "3rd") {
                        setCurrentStage("2nd");
                      }
                    }}
                    className={inputClass}
                  >
                    <option value="2-part">2-Part Installment</option>
                    <option value="3-part">3-Part Installment</option>
                  </select>
                </Field>
                <Field label="Installment Stage">
                  <select
                    value={currentStage}
                    onChange={(event) => setCurrentStage(event.target.value)}
                    className={inputClass}
                  >
                    <option value="1st">1st Installment</option>
                    <option value="2nd">2nd Installment</option>
                    {installmentStructure === "3-part" && (
                      <option value="3rd">3rd Installment</option>
                    )}
                  </select>
                </Field>
              </div>

              {currentStage !== "1st" && (
                <Field label="Total Amount Already Paid Previously (₦)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={previousPaid}
                    onChange={(event) => setPreviousPaid(event.target.value)}
                    placeholder="e.g. 40000"
                    className={inputClass}
                  />
                </Field>
              )}

              {!isFinalPayment && (
                <Field label="Settle Balance By Date">
                  <input
                    type="date"
                    value={settleByDate}
                    onChange={(event) => setSettleByDate(event.target.value)}
                    className={inputClass}
                  />
                </Field>
              )}
            </div>
          )}

          <Field label="Additional Notes (Optional)">
            <textarea
              rows="3"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Enter any additional details, waivers, or notes here..."
              className={inputClass}
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeReceiptNumber}
                onChange={(event) =>
                  setIncludeReceiptNumber(event.target.checked)
                }
                className="h-4 w-4 accent-[#06066f]"
              />
              Include receipt number
            </label>
            <Field label="Receipt Date">
              <input
                type="text"
                value={receiptDate}
                onChange={(event) => setReceiptDate(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {includeReceiptNumber && (
            <p className="text-xs text-slate-500">
              Receipt number: <span className="font-semibold">{receiptNumber}</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#06066f] px-4 py-3 font-semibold text-white shadow transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#06066f] focus:ring-offset-2"
          >
            Generate Receipt
          </button>
        </form>
      </div>
    </section>
  );
};

export default GenerateReceipt;
