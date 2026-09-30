/**
 * Lieferbox: berechnet im Browser den Versandtag (heute vor Bestellschluss, sonst nächster Werktag)
 * und das voraussichtliche Lieferfenster in Werktagen. Zeitbasis ist Europe/Berlin, Wochenenden und
 * bundesweite Feiertage (plus Fronleichnam und Allerheiligen für NRW) werden übersprungen.
 *
 * Attribute: data-cutoff (Stunde), data-min-days, data-max-days,
 *            data-text-today ({cutoff}), data-text-next ({day}), data-text-window ({from}, {to}).
 * Refs:      title, window
 */
const TIME_ZONE = 'Europe/Berlin';
const DAY_MS = 24 * 60 * 60 * 1000;

/** @param {number} year */
function easterSunday(year) {
  // Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return Date.UTC(year, month - 1, day);
}

/** @param {number} year @returns {Set<string>} ISO-Daten (YYYY-MM-DD) */
function holidays(year) {
  const easter = easterSunday(year);
  const list = [
    Date.UTC(year, 0, 1), // Neujahr
    easter - 2 * DAY_MS, // Karfreitag
    easter + 1 * DAY_MS, // Ostermontag
    Date.UTC(year, 4, 1), // Tag der Arbeit
    easter + 39 * DAY_MS, // Christi Himmelfahrt
    easter + 50 * DAY_MS, // Pfingstmontag
    easter + 60 * DAY_MS, // Fronleichnam (NRW)
    Date.UTC(year, 9, 3), // Tag der Deutschen Einheit
    Date.UTC(year, 10, 1), // Allerheiligen (NRW)
    Date.UTC(year, 11, 25), // 1. Weihnachtstag
    Date.UTC(year, 11, 26), // 2. Weihnachtstag
  ];
  return new Set(list.map((ms) => new Date(ms).toISOString().slice(0, 10)));
}

/** Aktuelle Uhrzeit und Datum in Berlin */
function nowInBerlin() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  /** @type {Record<string, string>} */
  const map = {};
  for (const part of parts) map[part.type] = part.value;
  const hour = Number(map.hour) % 24;
  return {
    date: Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day)),
    minutes: hour * 60 + Number(map.minute),
  };
}

/** @param {number} utcMidnight */
function isBusinessDay(utcMidnight) {
  const d = new Date(utcMidnight);
  const weekday = d.getUTCDay();
  if (weekday === 0 || weekday === 6) return false;
  return !holidays(d.getUTCFullYear()).has(d.toISOString().slice(0, 10));
}

/** @param {number} utcMidnight @param {number} days */
function addBusinessDays(utcMidnight, days) {
  let current = utcMidnight;
  let remaining = days;
  while (remaining > 0) {
    current += DAY_MS;
    if (isBusinessDay(current)) remaining -= 1;
  }
  return current;
}

/** @param {number} utcMidnight */
function nextBusinessDay(utcMidnight) {
  return addBusinessDays(utcMidnight, 1);
}

const dayFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'UTC',
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
});

/** @param {number} utcMidnight → "Di., 29.09." */
function formatDay(utcMidnight) {
  return dayFormatter.format(new Date(utcMidnight));
}

class MahandoDelivery extends HTMLElement {
  connectedCallback() {
    try {
      this.#render();
    } catch (error) {
      console.warn('[mahando-delivery] Berechnung übersprungen:', error);
    }
  }

  #render() {
    const cutoff = Number(this.dataset.cutoff || 14);
    const minDays = Math.max(1, Number(this.dataset.minDays || 1));
    const maxDays = Math.max(minDays, Number(this.dataset.maxDays || 3));
    const { date: today, minutes } = nowInBerlin();

    const shipsToday = isBusinessDay(today) && minutes < cutoff * 60;
    const shipDate = shipsToday ? today : nextBusinessDay(today);
    const from = addBusinessDays(shipDate, minDays);
    const to = addBusinessDays(shipDate, maxDays);

    const title = this.querySelector('[ref="title"]');
    const window_ = this.querySelector('[ref="window"]');

    if (title) {
      const template = shipsToday ? this.dataset.textToday : this.dataset.textNext;
      if (template) {
        title.textContent = template.replace('{cutoff}', String(cutoff)).replace('{day}', formatDay(shipDate));
      }
    }
    if (window_ && this.dataset.textWindow) {
      const fromText = formatDay(from);
      const toText = formatDay(to);
      window_.textContent =
        fromText === toText
          ? this.dataset.textWindow.replace('{from} – {to}', fromText).replace('{from}', fromText).replace('{to}', toText)
          : this.dataset.textWindow.replace('{from}', fromText).replace('{to}', toText);
    }
  }
}

if (!customElements.get('mahando-delivery')) {
  customElements.define('mahando-delivery', MahandoDelivery);
}
