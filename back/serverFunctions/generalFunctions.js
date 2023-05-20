async function invokeIf(func, funcInputs, condition) {
  if (condition) return await func(...funcInputs);
}
function unixToRelativeTime(unixTimestamp) {
  const millisecondsPerSecond = 1000;
  const secondsPerMinute = 60;
  const minutesPerHour = 60 * secondsPerMinute;
  const hoursPerDay = 24 * minutesPerHour;
  const daysPerWeek = 7 * hoursPerDay;
  const weeksPerMonth = 4 * daysPerWeek;
  const monthsPerYear = 12 * weeksPerMonth;

  const currentTime = Math.round(new Date().getTime() / millisecondsPerSecond);
  const timeDifference = currentTime - unixTimestamp;

  if (timeDifference < secondsPerMinute) {
    return `${timeDifference} seconds ago`;
  } else if (timeDifference < minutesPerHour) {
    const minutes = Math.floor(timeDifference / secondsPerMinute);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (timeDifference < hoursPerDay) {
    const hours = Math.floor(timeDifference / minutesPerHour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (timeDifference < daysPerWeek) {
    const days = Math.floor(timeDifference / hoursPerDay);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (timeDifference < weeksPerMonth) {
    const weeks = Math.floor(timeDifference / daysPerWeek);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  } else if (timeDifference < monthsPerYear) {
    const months = Math.floor(timeDifference / weeksPerMonth);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(timeDifference / monthsPerYear);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
}
module.exports = {
  invokeIf,
  unixToRelativeTime,
};
