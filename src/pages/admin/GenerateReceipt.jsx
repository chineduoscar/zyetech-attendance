const GenerateReceipt = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold">Generate Receipt</h1>
      <p className="mb-6 mt-2 text-sm text-[#4a4d85]">
        Save a payment and generate its receipt number.
      </p>

      <div className="max-w-2xl rounded-2xl border border-[#cfd3ec] bg-white p-6">
        <p className="py-6 text-center text-sm text-slate-600">
          You will be able to generate a receipt here.
        </p>
      </div>
    </section>
  );
};

export default GenerateReceipt;
