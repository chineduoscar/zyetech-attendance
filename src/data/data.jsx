export const COURSES = [
  "AI Automation",
  "Back End Development",
  "Content Creation",
  "Cybersecurity",
  "Data Analysis with AI and Machine Learning",
  "Data Analysis with Python",
  "Data Analytics",
  "Data Science",
  "Digital Marketing",
  "Front End Development",
  "Full Stack Development",
  "Generative AI for Video Animation",
  "Graphics Design",
  "Kiddies Bootcamp",
  "Product Design",
  "UI/UX Design",
  "Video Editing",
  "Virtual Assistance",
];

// Sidebar menu items. Each path is registered under the admin layout in App.jsx.
export const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "home", path: "/admin/dashboard" },
  {
    key: "staff-attendance",
    label: "Staff Attendance",
    icon: "staffAttendance",
    path: "/admin/attendance/staff",
  },
  {
    key: "student-attendance",
    label: "Student Attendance",
    icon: "studentAttendance",
    path: "/admin/attendance/students",
  },
  {
    key: "generate-receipts",
    label: "Generate Receipt",
    icon: "generateReceipts",
    path: "/admin/receipts/generate",
  },
  {
    key: "all-receipts",
    label: "All Receipts",
    icon: "allReceipts",
    path: "/admin/receipts",
  },
  { key: "students", label: "Students", icon: "students", path: "/admin/students" },
  { key: "staffs", label: "Staffs", icon: "staffs", path: "/admin/staff" },
];
