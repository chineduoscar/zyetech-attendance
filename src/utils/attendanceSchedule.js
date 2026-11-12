export const SIGN_IN_START_MINUTES = 10 * 60;
export const SIGN_OUT_END_MINUTES = 19 * 60;
const AFTERNOON_START_MINUTES = 13 * 60;
const EVENING_START_MINUTES = 17 * 60 + 30;

export const getAttendanceMinutes = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  return hour * 60 + minute;
};

export const getStudentAttendanceSession = (minutes) => {
  if (minutes < AFTERNOON_START_MINUTES || minutes >= SIGN_OUT_END_MINUTES) {
    return "Morning";
  }
  if (minutes < EVENING_START_MINUTES) return "Afternoon";
  return "Evening";
};

export const getAttendanceScheduleError = (action, minutes) => {
  if (action === "sign-in" && minutes < SIGN_IN_START_MINUTES) {
    return "Sign-in is unavailable before 10:00 AM. Please wait until 10:00 AM.";
  }
  if (action === "sign-in" && minutes >= SIGN_OUT_END_MINUTES) {
    return "Sign-in closes at 7:00 PM. Sign-in is unavailable now.";
  }
  if (action === "sign-out" && minutes >= SIGN_OUT_END_MINUTES) {
    return "Sign-out closes at 7:00 PM. Sign-out is unavailable now.";
  }
  return "";
};
