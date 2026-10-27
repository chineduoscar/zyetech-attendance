const AllReceipts = () => {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Receipts</h1>
        <p className="mt-2 text-sm text-[#4a4d85]">
          Browse payments saved in the database.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <p className="px-5 py-12 text-center text-sm text-slate-600">
          All your receipts will appear here.
        </p>
      </div>
    </section>
  );
};

export default AllReceipts;
