import Footer from "../components/Footer";
import Header from "../components/Header";

const NotFound = () => (
  <div className="flex min-h-screen flex-col bg-[#eef0fa] text-[#06066f]">
    <Header />
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <div className="h-fit w-full max-w-md rounded-2xl border border-[#cfd3ec] bg-white p-7 text-center shadow-sm sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#06066f]">
            Page Not Found
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4a4d85]">
            The page you are looking for does not exist.
          </p>
        </header>
        <p
          aria-label="404"
          className="text-8xl font-extrabold leading-none tracking-tight"
        >
          <span className="text-[#06066f]">4</span>
          <span className="text-slate-950">0</span>
          <span className="text-[#06066f]">4</span>
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
