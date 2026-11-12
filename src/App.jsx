import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import {
  AdminRoute,
  AuthPageRoute,
  SignedInRoute,
  SuperadminRoute,
} from "./auth/RouteGuards";
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
import SignOut from "./pages/attendance/SignOut";
import VerifyAttendance from "./pages/attendance/VerifyAttendance";
import StaffOnboarding from "./pages/onboarding/StaffOnboarding";
import StudentOnboarding from "./pages/onboarding/StudentOnboarding";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthPageRoute />}>
            <Route path="/dean/login" element={<AdminLogin />} />
            <Route path="/dean/register" element={<Register />} />
          </Route>

          <Route element={<SignedInRoute />}>
            <Route
              path="/dean/pending-approval"
              element={<PendingApproval />}
            />
          </Route>

          <Route path="/attendance/staff" element={<NotFound />} />
          <Route path="/attendance/students" element={<NotFound />} />

          <Route element={<AdminRoute />}>
            <Route path="/dean" element={<DashboardLayout />}>
              <Route
                index
                element={<Navigate to="/dean/dashboard" replace />}
              />
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="staff/attendance"
                element={<AttendanceList type="staff" />}
              />
              <Route
                path="student/attendance"
                element={<AttendanceList type="student" />}
              />
              <Route path="receipts/generate" element={<GenerateReceipt />} />
              <Route path="receipts" element={<AllReceipts />} />
              <Route path="students" element={<Students />} />
              <Route path="staff" element={<Staff />} />
              <Route element={<SuperadminRoute />}>
                <Route path="users" element={<UserManagement />} />
              </Route>
              <Route
                path="*"
                element={<NotFound />}
              />
            </Route>
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/staff/attendance" element={<StaffAttendance />} />
            <Route
              path="/staff/sign-out"
              element={<SignOut type="staff" />}
            />
            <Route
              path="/student/attendance"
              element={<StudentAttendance />}
            />
            <Route
              path="/student/sign-out"
              element={<SignOut type="student" />}
            />
            <Route path="/attendance/verify" element={<VerifyAttendance />} />
            <Route path="/onboarding/staff" element={<StaffOnboarding />} />
            <Route
              path="/onboarding/students"
              element={<StudentOnboarding />}
            />
          </Route>

          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
