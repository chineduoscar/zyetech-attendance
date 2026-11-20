export const STAFF_ROLES = [
  "AI Automation Specialist",
  "Back End Developer",
  "Front End Developer",
  "Full Stack Web Developer",
  "Cybersecurity Specialist",
  "Data Analyst",
  "Data Scientist",
  "Digital Marketer",
  "Content Creator",
  "Graphics Designer",
  "Product / UI/UX Designer",
  "Video Editor",
  "Generative AI / Video Animator",
  "Virtual Assistant",
  "Kiddies Bootcamp Instructor",
  "Receptionist",
  "Administrator",
  "Other",
];

// Sidebar menu items. Each path is registered under the dean layout in App.jsx.
export const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: "home", path: "/dean/dashboard" },
  {
    key: "user-management",
    label: "User Management",
    icon: "userManagement",
    path: "/dean/users",
  },
  {
    key: "staff-attendance",
    label: "Staff Attendance",
    icon: "staffAttendance",
    path: "/dean/staff/attendance",
  },
  {
    key: "student-attendance",
    label: "Student Attendance",
    icon: "studentAttendance",
    path: "/dean/student/attendance",
  },
  {
    key: "generate-receipts",
    label: "Generate Receipt",
    icon: "generateReceipts",
    path: "/dean/receipts/generate",
  },
  {
    key: "all-receipts",
    label: "All Receipts",
    icon: "allReceipts",
    path: "/dean/receipts",
  },
  {
    key: "students",
    label: "Students",
    icon: "students",
    path: "/dean/students",
  },
  { key: "staffs", label: "Staffs", icon: "staffs", path: "/dean/staff" },
];
