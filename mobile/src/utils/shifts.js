const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_MS = 24 * HOUR_MS;

const pad = (value) => String(value).padStart(2, '0');

export const ALL_CITIES = 'All';

export const dateKey = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const startOfDay = (timestamp) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const daysFromToday = (timestamp) =>
  Math.round((startOfDay(timestamp) - startOfDay(Date.now())) / DAY_MS);

export const formatDateLabel = (timestamp) => {
  const offset = daysFromToday(timestamp);

  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  if (offset === -1) return 'Yesterday';

  const date = new Date(timestamp);
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatTimeRange = (shift) =>
  `${formatTime(shift.startTime)} – ${formatTime(shift.endTime)}`;

export const formatDuration = (milliseconds) => {
  const minutes = Math.max(0, Math.round(milliseconds / MINUTE_MS));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

export const getShiftDuration = (shift) => formatDuration(shift.endTime - shift.startTime);

export const hasStarted = (shift, now = Date.now()) => now >= shift.startTime;

export const isUpcoming = (shift, now = Date.now()) => shift.endTime > now;

export const overlaps = (shift, other) =>
  shift.id !== other.id && shift.startTime < other.endTime && other.startTime < shift.endTime;

export const hasBookedConflict = (shift, bookedShifts) =>
  bookedShifts.some((booked) => overlaps(shift, booked));

export const getCities = (shifts) =>
  [...new Set(shifts.map((shift) => shift.area))].sort((a, b) => a.localeCompare(b));

export const getCityOptions = (shifts) => [
  { name: ALL_CITIES, count: shifts.length },
  ...getCities(shifts).map((name) => ({
    name,
    count: shifts.filter((shift) => shift.area === name).length,
  })),
];

export const filterByCity = (shifts, city) =>
  city === ALL_CITIES ? shifts : shifts.filter((shift) => shift.area === city);

export const sortByStartTime = (shifts) =>
  [...shifts].sort((a, b) => a.startTime - b.startTime || a.area.localeCompare(b.area));

/**
 * Groups shifts into SectionList ready sections, ordered by calendar date.
 * Each section carries the label shown in the header and its shift summary.
 */
export const groupByDate = (shifts) => {
  const groups = new Map();

  sortByStartTime(shifts).forEach((shift) => {
    const key = dateKey(shift.startTime);
    const group = groups.get(key) || { key, timestamp: shift.startTime, shifts: [] };
    group.shifts.push(shift);
    groups.set(key, group);
  });

  return [...groups.values()]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ key, timestamp, shifts: sectionShifts }) => ({
      key,
      title: formatDateLabel(timestamp),
      duration: formatDuration(
        sectionShifts.reduce((total, shift) => total + (shift.endTime - shift.startTime), 0),
      ),
      data: sectionShifts,
    }));
};

export const summarize = (shifts) => ({
  count: shifts.length,
  duration: formatDuration(
    shifts.reduce((total, shift) => total + (shift.endTime - shift.startTime), 0),
  ),
});
