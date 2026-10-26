const STORAGE_KEYS = {
  staff: "zyetech-staff-attendance",
  student: "zyetech-student-attendance",
};

export const getAttendanceRecords = (type) => {
  const records = localStorage.getItem(STORAGE_KEYS[type]);
  return records ? JSON.parse(records) : [];
};

export const saveAttendanceRecord = (type, record) => {
  const records = getAttendanceRecords(type);
  localStorage.setItem(
    STORAGE_KEYS[type],
    JSON.stringify([...records, record]),
  );
};
