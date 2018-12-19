function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return "just now";
  }

  if (elapsed < milliSecondsPerMinute) {
    return "less than 1 min ago";
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + " min ago";
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + " h ago";
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + " days ago";
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + " mo ago";
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + " years ago";
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}

// A logging function to help with debugging
export const logify = _ => {
  console.log(_);
  return _;
};

export const changesNotice =
  "Changes may take a few seconds to be reflected on the page.";

export const sum = arr => arr.reduce((acc, cur) => acc + cur, 0);

export const sumBy = (arr, fn) => arr.reduce((acc, cur) => acc + fn(cur), 0);

const isAnything = source => test => test === source;

export const isTeacher = isAnything("TEACHER");

// functions for working with measurements and scales
export const getScaleOptions = measurement =>
  measurement.scales.map(scaleToOption);

export const getUnitScale = measurement =>
  scaleToOption(getSpecificScale(measurement, 1000));

export const getSpecificScale = (measurement, amount) =>
  measurement.scales.find(s => s.amount === amount);

export const scaleToOption = scale => ({
  label: scale.name,
  value: scale.amount
});

// lower case, upper case
export const lowerCase = str => str.toLowerCase();
export const upperCase = str => str.toUpperCase();

export const includesAllWords = (searchStr, str) =>
  str.split(" ").every(word => searchStr.includes(word));
