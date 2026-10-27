import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { AdminRoute, AuthPageRoute, SignedInRoute } from "./auth/RouteGuards";
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import PendingApproval from "./pages/admin/PendingApproval";
import Register from "./pages/admin/Register";
import UserManagement from "./pages/admin/UserManagement";
import Dashboard from "./pages/admin/Dashboard";
import AttendanceList from "./pages/admin/AttendanceList";
import Students from "./pages/admin/Students";
import Staff from "./pages/admin/Staff";
import GenerateReceipt from "./pages/admin/GenerateReceipt";
import AllReceipts from "./pages/admin/AllReceipts";
import StaffAttendance from "./pages/attendance/StaffAttendance";
import StudentAttendance from "./pages/attendance/StudentAttendance";
import VerifyAttendance from "./pages/attendance/VerifyAttendance";
import StaffOnboarding from "./pages/onboarding/StaffOnboarding";
import StudentOnboarding from "./pages/onboarding/StudentOnboarding";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthPageRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<SignedInRoute />}>
            <Route path="/pending-approval" element={<PendingApproval />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="attendance/staff"
                element={<AttendanceList type="staff" />}
              />
              <Route
                path="attendance/students"
                element={<AttendanceList type="student" />}
              />
              <Route path="receipts/generate" element={<GenerateReceipt />} />
              <Route path="receipts" element={<AllReceipts />} />
              <Route path="students" element={<Students />} />
              <Route path="staff" element={<Staff />} />
              <Route path="users" element={<UserManagement />} />
              <Route
                path="*"
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Route>
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/attendance/staff" element={<StaffAttendance />} />
            <Route
              path="/attendance/students"
              element={<StudentAttendance />}
            />
            <Route path="/attendance/verify" element={<VerifyAttendance />} />
            <Route path="/onboarding/staff" element={<StaffOnboarding />} />
            <Route
              path="/onboarding/students"
              element={<StudentOnboarding />}
            />
          </Route>

          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
