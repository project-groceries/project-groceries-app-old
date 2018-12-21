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

// converting between weights and volumes
// where the unit of weight is kilogram and the unit of volume is metres cubed
export const massToKilograms = (amount, multiplier) => amount / multiplier;
export const kilogramsToMass = (amount, multiplier) => amount * multiplier;

export const kilogramsToMetresCubed = (kilograms, density) =>
  kilograms / density;
export const metresCubedToKilograms = (metresCubed, density) =>
  metresCubed * density;

export const metresCubedToVolume = (amount, multiplier) => amount * multiplier;
export const volumeToMetresCubed = (amount, multiplier) => amount / multiplier;

export const volumeToMass = (amount, multiplier, density) =>
  kilogramsToMass(
    metresCubedToKilograms(volumeToMetresCubed(amount, multiplier), density),
    1000000
  );

export const massToVolume = (amount, multiplier, density) =>
  metresCubedToVolume(
    kilogramsToMetresCubed(massToKilograms(amount, 1000000), density),
    multiplier
  );

// lower case, upper case
export const lowerCase = str => str.toLowerCase();
export const upperCase = str => str.toUpperCase();

export const includesAllWords = (searchStr, str) =>
  str.split(" ").every(word => searchStr.includes(word));

// search for ingredients
export const searchIngredients = (query, ingredients, selectedIngredients) =>
  ingredients
    .filter(i => includesAllWords(lowerCase(i.name), lowerCase(query)))
    .filter(i => !selectedIngredients.has(i.id))
    .map(i => ({ value: i, label: i.name }))
    .slice(0, query.length > 2 ? undefined : 40); // reduce results for faster loading
