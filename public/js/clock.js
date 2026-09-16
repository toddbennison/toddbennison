const formatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Sydney",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** Formats the time as "3:42 pm" regardless of browser quirks. */
export function formatSydneyTime(date = new Date()) {
  return formatter.format(date).replace(/\s?([ap])\.?m\.?/i, (_, x) => ` ${x.toLowerCase()}m`);
}

export function startClock(element) {
  if (!element) return;

  const tick = () => {
    element.textContent = formatSydneyTime();
  };

  tick();
  setInterval(tick, 15_000);
}
