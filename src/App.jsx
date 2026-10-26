import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Staff from "./pages/admin/Staff";
import Students from "./pages/admin/Students";
import AdminLogin from "./pages/admin/AdminLogin";
import GenerateReceipt from "./pages/admin/GenerateReceipt";
import AllReceipts from "./pages/admin/AllReceipts";
import StaffAttendance from "./pages/attendance/StaffAttendance";
import StudentAttendance from "./pages/attendance/StudentAttendance";
import VerifyAttendance from "./pages/attendance/VerifyAttendance";
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import AttendanceList from "./pages/admin/AttendanceList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff" element={<Staff />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance/staff" element={<AttendanceList type="staff" />} />
          <Route path="attendance/students" element={<AttendanceList type="student" />} />
          <Route path="receipts/generate" element={<GenerateReceipt />} />
          <Route path="receipts" element={<AllReceipts />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/attendance/staff" element={<StaffAttendance />} />
          <Route path="/attendance/students" element={<StudentAttendance />} />
          <Route path="/attendance/verify" element={<VerifyAttendance />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
