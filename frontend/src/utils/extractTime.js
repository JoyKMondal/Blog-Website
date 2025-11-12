const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function extractTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const timeDifference = calculateTimeDifference(now, date);
  return ` ${date.getDate()} ${months[date.getMonth()]}`;
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}

function calculateTimeDifference(currentDate, messageDate) {
  const diffInMilliseconds = currentDate - messageDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  // const remainingHours = diffInHours % 24;

  if (diffInDays >= 7) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = messageDate.toLocaleDateString(undefined, options);
    const hours = padZero(messageDate.getHours());
    const minutes = padZero(messageDate.getMinutes());
    return `${formattedDate} at ${hours}:${minutes}`;
  } else if (diffInDays >= 1) {
    const options = { weekday: "long" };
    const formattedWeekday = messageDate.toLocaleDateString(undefined, options);
    const hours = padZero(messageDate.getHours());
    const minutes = padZero(messageDate.getMinutes());
    return `${formattedWeekday} at ${hours}:${minutes}`;
  } else if (diffInHours >= 1) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }
}
