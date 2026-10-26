import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#eef0fa] text-[#06066f]">
    <Header />
    <main className="flex flex-1 flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;