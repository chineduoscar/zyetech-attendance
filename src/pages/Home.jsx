import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => (
  <div className="flex min-h-screen flex-col bg-[#eef0fa] text-[#06066f]">
    <Header />
    <main className="flex flex-1 items-center justify-center px-5 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-[#cfd3ec] bg-white p-8 text-center shadow-sm sm:p-12">
        <img
          src="/logo.png"
          alt="Zyetech logo"
          className="mx-auto mb-5 h-16 w-16 object-contain"
        />
        <h1 className="text-3xl font-bold tracking-tight">
          Zyetech Attendance
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#4a4d85]">
          Zyetech Innovation Technology attendance and administration portal.
          This service helps keep attendance records organized for students and
          staff.
        </p>
        <p className="mt-5 text-sm font-medium text-[#4a4d85]">
          Sign-in is available from 10:00 AM. Sign-out closes at 7:00 PM.
        </p>
      </section>
    </main>
    <Footer />
  </div>
);

export default Home;
