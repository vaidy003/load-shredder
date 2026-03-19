const hasDom = typeof document !== "undefined";
const INDIA_DESIGN_CSV = "data/weather/india_design_conditions.csv";
const AIR_DENSITY = 1.2; // kg/m3
const AIR_CP = 1006; // J/kg-K
const HFG = 2501000; // J/kg
const M2_TO_FT2 = 10.7639;
const STD_PRESSURE_PA = 101325;
const DEFAULT_CITY_STATION_ID = "432950";
const TARGET_SFTR = 500;
const MILESTONE_DISPLAY_MS = 4000;
const MILESTONE_QUEUE_GAP_MS = 4150;
const TARGET_BASE_SFTR = 150;
const BASE_SFTR_TOLERANCE = 20;
const OCCUPANCY_62_1_2022 = {
  office: { rp: 2.5, ra: 0.3 },
  conference: { rp: 2.5, ra: 0.3 },
  classroom: { rp: 5.0, ra: 0.6 },
  retail: { rp: 3.8, ra: 0.6 },
  restaurant: { rp: 3.8, ra: 0.9 },
  lobby: { rp: 2.5, ra: 0.3 },
  residential: { rp: 2.5, ra: 0.3 },
  hotel: { rp: 2.5, ra: 0.3 },
};
const EXCEL_STARTING_SPACES = [
  {
    floorLabel: "Ground Floor",
    template: { label: "Classroom", occupancy: "classroom" },
    orientation: "S",
    exposures: [{ area: 19.84, ori: "S" }],
    values: { floorArea: 62.3, wallArea: 22.86, windowArea: 19.84, roofArea: 0, people: 31, lpd: 1.043338683788122, epd: 4.4943820224719104 },
    variants: 4,
  },
  {
    floorLabel: "Ground Floor",
    template: { label: "Pantry", occupancy: "restaurant" },
    orientation: "N",
    exposures: [{ area: 14.25, ori: "N" }],
    values: { floorArea: 48.11, wallArea: 20.260000000000002, windowArea: 14.25, roofArea: 0, people: 0, lpd: 1.3510704635210975, epd: 160.56952816462274 },
    variants: 3,
  },
  {
    floorLabel: "Ground Floor",
    template: { label: "Gym", occupancy: "retail" },
    orientation: "N + E",
    exposures: [{ area: 28.39, ori: "N" }],
    values: { floorArea: 165.04, wallArea: 87.72, windowArea: 28.39, roofArea: 0, people: 20, lpd: 0.39384391662627244, epd: 9.936984973339797 },
    variants: 3,
  },
  {
    floorLabel: "First Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "S",
    exposures: [{ area: 34.19, ori: "S" }],
    values: { floorArea: 108.55, wallArea: 36.86, windowArea: 34.19, roofArea: 0, people: 32, lpd: 0.5343159834177799, epd: 5.803777061262092 },
    variants: 4,
  },
  {
    floorLabel: "First Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "S + E",
    exposures: [{ area: 54.01, ori: "S" }, { area: 17.77, ori: "E" }],
    values: { floorArea: 135.37, wallArea: 40.220000000000006, windowArea: 71.78, roofArea: 0, people: 40, lpd: 0.42845534461106594, epd: 6.131343724606634 },
    variants: 4,
  },
  {
    floorLabel: "First Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "N + E",
    exposures: [{ area: 28.39, ori: "N" }, { area: 15.39, ori: "E" }],
    values: { floorArea: 128.25, wallArea: 64.25, windowArea: 43.78, roofArea: 0, people: 40, lpd: 0.4522417153996101, epd: 6.4717348927875245 },
    variants: 4,
  },
  {
    floorLabel: "First Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "N",
    exposures: [{ area: 28.39, ori: "N" }],
    values: { floorArea: 102.6, wallArea: 41.49, windowArea: 28.39, roofArea: 0, people: 32, lpd: 0.5653021442495128, epd: 6.140350877192983 },
    variants: 4,
  },
  {
    floorLabel: "First Floor",
    template: { label: "Conference Room", occupancy: "conference" },
    orientation: "W",
    exposures: [{ area: 18.36, ori: "W" }],
    values: { floorArea: 50.4, wallArea: 12.84, windowArea: 18.36, roofArea: 0, people: 10, lpd: 1.2896825396825398, epd: 3.9682539682539684 },
    variants: 3,
  },
  {
    floorLabel: "Second Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "S",
    exposures: [{ area: 33.49, ori: "S" }],
    values: { floorArea: 108.55, wallArea: 37.520000000000003, windowArea: 33.49, roofArea: 108.55, people: 32, lpd: 0.5988023952095809, epd: 5.803777061262092 },
    variants: 4,
  },
  {
    floorLabel: "Second Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "S + E",
    exposures: [{ area: 46.99, ori: "S" }, { area: 14.46, ori: "E" }],
    values: { floorArea: 135.37, wallArea: 50.55, windowArea: 61.45, roofArea: 135.37, people: 40, lpd: 0.48016547240895324, epd: 6.131343724606634 },
    variants: 4,
  },
  {
    floorLabel: "Second Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "N + E",
    exposures: [{ area: 37.59, ori: "N" }, { area: 13.73, ori: "E" }],
    values: { floorArea: 128.25, wallArea: 58.42, windowArea: 51.32, roofArea: 128.25, people: 40, lpd: 0.50682261208577, epd: 6.4717348927875245 },
    variants: 4,
  },
  {
    floorLabel: "Second Floor",
    template: { label: "Open Office", occupancy: "office" },
    orientation: "N",
    exposures: [{ area: 37.59, ori: "N" }],
    values: { floorArea: 102.6, wallArea: 32.29, windowArea: 37.59, roofArea: 102.6, people: 32, lpd: 0.6335282651072125, epd: 6.140350877192983 },
    variants: 4,
  },
  {
    floorLabel: "Second Floor",
    template: { label: "Conference Room", occupancy: "conference" },
    orientation: "W",
    exposures: [{ area: 16.415, ori: "W" }],
    values: { floorArea: 50.4, wallArea: 14.77, windowArea: 16.415, roofArea: 50.4, people: 10, lpd: 1.2896825396825398, epd: 3.9682539682539684 },
    variants: 3,
  },
];

const STARTING_CITY_VARIANTS = [
  { label: "Bengaluru, KA", tOutCool: 33.3, wOut: 18.5, month: 5, hour: 15 },
  { label: "Hyderabad, TS", tOutCool: 33.4, wOut: 18.0, month: 5, hour: 15 },
  { label: "Jaipur, RJ", tOutCool: 35.9, wOut: 17.7, month: 5, hour: 15 },
  { label: "Nagpur, MH", tOutCool: 39.6, wOut: 15.3, month: 5, hour: 15 },
];

const STARTING_ASSUMPTION_VARIANTS = [
  { id: "balanced", uWall: 1.3, uWindow: 3.6, uRoof: 1.1, shgc: 0.4, lightingUF: 0.82, equipUF: 0.74, oaPersonFactor: 1.0, oaAreaFactor: 1.0, height: 3.0, ach: 0.18 },
  { id: "solar-heavy", uWall: 1.7, uWindow: 4.7, uRoof: 1.5, shgc: 0.58, lightingUF: 0.89, equipUF: 0.8, oaPersonFactor: 1.08, oaAreaFactor: 1.08, height: 3.2, ach: 0.28 },
  { id: "envelope-heavy", uWall: 2.4, uWindow: 5.0, uRoof: 2.5, shgc: 0.52, lightingUF: 0.9, equipUF: 0.84, oaPersonFactor: 1.12, oaAreaFactor: 1.12, height: 3.4, ach: 0.36 },
  { id: "leaky-shell", uWall: 1.9, uWindow: 4.2, uRoof: 1.8, shgc: 0.47, lightingUF: 0.86, equipUF: 0.78, oaPersonFactor: 1.05, oaAreaFactor: 1.05, height: 3.1, ach: 0.24 },
];

const STARTING_SCENARIO_LIBRARY = buildExcelStartingScenarioLibrary();

const indiaProfiles = [];
const gameState = {
  active: false,
  picksMax: 5,
  score: 0,
  picksUsed: 0,
  revealed: false,
  current: null,
  dragActionId: "",
  waterfallOpen: {},
  waterfallTouched: {},
};
const gameFx = {
  soundEnabled: true,
  audioCtx: null,
  soundClips: {},
};
let milestoneTimer = null;
let milestoneQueueTimer = null;
let waterfallAutoOpenTimer = null;

function qs(id) {
  return hasDom ? document.getElementById(id) : null;
}

function id(base, caseId) {
  return `${base}_${caseId}`;
}

function runSplashScreen() {
  const splash = qs("splashScreen");
  if (!splash) return;
  const start = qs("splashStart");
  if (!start) return;
  start.addEventListener("click", () => {
    splash.classList.add("hidden");
    setTimeout(() => splash.remove(), 520);
  }, { once: true });
}

function setSplashBrief(scenario) {
  const [spaceName, floorName] = String(scenario.template.label || "").split("|").map((part) => part.trim());
  const setText = (id, value) => {
    const el = qs(id);
    if (el) el.textContent = value;
  };
  setText("splashLocation", `Building location: ${scenario.city?.label || "Selected City"}`);
  setText("splashSpace", `Space name: ${spaceName || scenario.template.label}`);
  setText("splashFloor", `Floor: ${floorName || "Building Floor"}`);
  setText("splashDateTime", `Date time: ${monthName(scenario.month)} ${String(scenario.hour).padStart(2, "0")}:00`);
  setText("splashSftr", `Starting Case SF/TR: ${getSfPerTr(scenario.baseValues).toFixed(0)}`);
}

function getNum(base, caseId) {
  return Number(qs(id(base, caseId)).value);
}

function setNum(base, caseId, value) {
  qs(id(base, caseId)).value = value;
}

function setGlobalSummary(caseId, capText, sftrText) {
  const cap = qs(id("globalCap", caseId));
  const sftr = qs(id("globalSftr", caseId));
  if (cap) cap.textContent = capText;
  if (sftr) sftr.textContent = sftrText;
}

function wattsToKw(watts) {
  return watts / 1000;
}

function wattsToTr(watts) {
  return wattsToKw(watts) / 3.517;
}

function monthName(month) {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Math.max(1, Math.min(12, Number(month))) - 1;
  return names[idx];
}

function saturationVaporPressurePa(tempC) {
  return 610.78 * Math.exp((17.2694 * tempC) / (tempC + 237.3));
}

function humidityRatioGkgFromDbRh(tempC, rhPercent, pressurePa = STD_PRESSURE_PA) {
  const rh = Math.max(0, Math.min(100, rhPercent)) / 100;
  const pws = saturationVaporPressurePa(tempC);
  const pw = rh * pws;
  const wKgKg = 0.62198 * pw / Math.max(1, pressurePa - pw);
  return wKgKg * 1000;
}

function estimateSolarIrr(caseId) {
  const ori = qs(id("solarOri", caseId))?.value || "S";
  const month = Number(qs(id("solarMonth", caseId))?.value || 5);
  const hour = Number(qs(id("solarHour", caseId))?.value || 14);
  const tOutCool = Number(qs(id("tOutCool", caseId))?.value || 35);

  // Practical ASHRAE-style shortcut: orientation peak values + month/hour modifiers.
  const oriPeak = {
    N: { peak: 230, peakHour: 12 },
    NE: { peak: 430, peakHour: 10 },
    E: { peak: 560, peakHour: 9 },
    SE: { peak: 620, peakHour: 10 },
    S: { peak: 700, peakHour: 12 },
    SW: { peak: 760, peakHour: 14 },
    W: { peak: 800, peakHour: 15 },
    NW: { peak: 520, peakHour: 14 },
  };

  const monthFactor = {
    1: 0.66, 2: 0.76, 3: 0.9, 4: 1.0, 5: 1.08, 6: 1.1,
    7: 1.08, 8: 1.03, 9: 0.92, 10: 0.82, 11: 0.72, 12: 0.64,
  };

  const { peak, peakHour } = oriPeak[ori] || oriPeak.S;
  const sigma = 2.4;
  const hourFactor = 0.45 + 0.55 * Math.exp(-((hour - peakHour) ** 2) / (2 * sigma * sigma));
  const seasonal = monthFactor[month] || 1.0;
  const climateAdj = Math.min(1.15, Math.max(0.85, tOutCool / 35));

  return Math.round(Math.max(80, Math.min(950, peak * seasonal * hourFactor * climateAdj)));
}

function updateSolarIrr(caseId) {
  const irr = estimateSolarIrr(caseId);
  setNum("solarIrr", caseId, irr);
}

function applyOccupancyDefaults(caseId) {
  const occupancy = qs(id("occupancy", caseId))?.value || "office";
  const defaults = OCCUPANCY_62_1_2022[occupancy] || OCCUPANCY_62_1_2022.office;
  setNum("oaPerPerson", caseId, defaults.rp);
  setNum("oaPerArea", caseId, defaults.ra);
  renderCase(caseId);
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        cur += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function ensureAudioContext() {
  if (!hasDom) return null;
  if (gameFx.audioCtx) return gameFx.audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  gameFx.audioCtx = new Ctx();
  return gameFx.audioCtx;
}

function unlockAudioContext() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function withReadyAudioContext(run) {
  if (!gameFx.soundEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().then(() => run(ctx)).catch(() => {});
    return;
  }
  run(ctx);
}

function playTone(ctx, freq, durationMs, wave = "triangle", gainLevel = 0.03, delayMs = 0) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delayMs / 1000;
  const end = start + durationMs / 1000;
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainLevel), start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(end + 0.02);
}

function encodeWavClip(samples, sampleRate = 11025) {
  const byteRate = sampleRate * 2;
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  samples.forEach((sample, idx) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + idx * 2, Math.round(clamped * 32767), true);
  });
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function synthesizeClip(notes, sampleRate = 11025) {
  if (!hasDom || typeof btoa === "undefined") return "";
  const totalMs = notes.reduce((max, note) => Math.max(max, (note.delayMs || 0) + note.durationMs), 0) + 40;
  const totalSamples = Math.max(1, Math.ceil((totalMs / 1000) * sampleRate));
  const samples = new Float32Array(totalSamples);
  notes.forEach((note) => {
    const start = Math.floor(((note.delayMs || 0) / 1000) * sampleRate);
    const end = Math.min(totalSamples, start + Math.floor((note.durationMs / 1000) * sampleRate));
    for (let i = start; i < end; i += 1) {
      const t = (i - start) / sampleRate;
      const fadeIn = Math.min(1, t / 0.01);
      const fadeOut = Math.min(1, Math.max(0.001, (end - i) / sampleRate) / 0.02);
      samples[i] += Math.sin(2 * Math.PI * note.freq * t) * note.gain * fadeIn * fadeOut;
    }
  });
  return encodeWavClip(samples, sampleRate);
}

function getSoundClip(kind) {
  if (!hasDom) return "";
  if (gameFx.soundClips[kind]) return gameFx.soundClips[kind];
  const clipMap = {
    pick: [
      { freq: 520, durationMs: 65, gain: 0.18, delayMs: 0 },
      { freq: 700, durationMs: 65, gain: 0.14, delayMs: 70 },
    ],
    "finale-success": [
      { freq: 523, durationMs: 90, gain: 0.18, delayMs: 0 },
      { freq: 659, durationMs: 90, gain: 0.16, delayMs: 110 },
      { freq: 784, durationMs: 100, gain: 0.15, delayMs: 220 },
      { freq: 1046, durationMs: 150, gain: 0.14, delayMs: 340 },
    ],
    "finale-fail": [
      { freq: 330, durationMs: 110, gain: 0.18, delayMs: 0 },
      { freq: 277, durationMs: 120, gain: 0.16, delayMs: 120 },
      { freq: 220, durationMs: 170, gain: 0.15, delayMs: 250 },
    ],
    "milestone-300": [
      { freq: 587, durationMs: 90, gain: 0.18, delayMs: 0 },
      { freq: 740, durationMs: 100, gain: 0.16, delayMs: 90 },
      { freq: 988, durationMs: 120, gain: 0.14, delayMs: 190 },
    ],
    "milestone-400": [
      { freq: 659, durationMs: 90, gain: 0.19, delayMs: 0 },
      { freq: 880, durationMs: 110, gain: 0.17, delayMs: 95 },
      { freq: 1046, durationMs: 130, gain: 0.16, delayMs: 205 },
      { freq: 1318, durationMs: 160, gain: 0.14, delayMs: 340 },
    ],
  };
  const spec = clipMap[kind];
  if (!spec) return "";
  const uri = synthesizeClip(spec);
  gameFx.soundClips[kind] = uri;
  return uri;
}

function playHtmlSound(kind) {
  if (!hasDom || !gameFx.soundEnabled) return;
  const clip = getSoundClip(kind);
  if (!clip) return;
  const audio = new Audio(clip);
  audio.volume = 0.85;
  audio.play().catch(() => {});
}

function playGameSound(kind) {
  if (
    kind === "pick" ||
    kind === "finale-success" ||
    kind === "finale-fail" ||
    kind.startsWith("milestone-")
  ) {
    playHtmlSound(kind);
  }
  withReadyAudioContext((ctx) => {
    if (kind === "start") {
      playTone(ctx, 440, 70, "triangle", 0.026, 0);
      playTone(ctx, 554, 80, "triangle", 0.024, 80);
      playTone(ctx, 659, 90, "triangle", 0.022, 170);
    } else if (kind === "pick") {
      playTone(ctx, 520, 65, "triangle", 0.02, 0);
      playTone(ctx, 700, 65, "triangle", 0.018, 70);
    } else if (kind === "reset") {
      playTone(ctx, 420, 70, "sine", 0.02, 0);
      playTone(ctx, 300, 90, "sine", 0.018, 80);
    } else if (kind === "success") {
      playTone(ctx, 523, 85, "triangle", 0.028, 0);
      playTone(ctx, 659, 85, "triangle", 0.026, 90);
      playTone(ctx, 784, 110, "triangle", 0.024, 180);
    } else if (kind === "fail") {
      playTone(ctx, 280, 110, "sawtooth", 0.02, 0);
      playTone(ctx, 220, 140, "sawtooth", 0.018, 110);
    } else if (kind === "finale-success") {
      playTone(ctx, 523, 90, "triangle", 0.03, 0);
      playTone(ctx, 659, 90, "triangle", 0.028, 110);
      playTone(ctx, 784, 100, "triangle", 0.026, 220);
      playTone(ctx, 1046, 150, "triangle", 0.024, 340);
    } else if (kind === "finale-fail") {
      playTone(ctx, 330, 110, "sawtooth", 0.02, 0);
      playTone(ctx, 277, 120, "sawtooth", 0.018, 120);
      playTone(ctx, 220, 170, "sawtooth", 0.017, 250);
    } else if (kind === "milestone-200") {
      playTone(ctx, 523, 85, "triangle", 0.024, 0);
      playTone(ctx, 659, 95, "triangle", 0.022, 90);
      playTone(ctx, 784, 110, "triangle", 0.02, 185);
    } else if (kind === "milestone-300") {
      playTone(ctx, 587, 90, "triangle", 0.028, 0);
      playTone(ctx, 740, 105, "triangle", 0.026, 95);
      playTone(ctx, 988, 125, "triangle", 0.024, 195);
    } else if (kind === "milestone-400") {
      playTone(ctx, 659, 95, "triangle", 0.03, 0);
      playTone(ctx, 880, 115, "triangle", 0.028, 100);
      playTone(ctx, 1046, 135, "triangle", 0.026, 220);
      playTone(ctx, 1318, 165, "triangle", 0.024, 350);
    } else if (kind === "milestone-500" || kind === "milestone-600" || kind === "milestone-700") {
      playTone(ctx, 784, 95, "triangle", 0.03, 0);
      playTone(ctx, 988, 115, "triangle", 0.028, 90);
      playTone(ctx, 1174, 130, "triangle", 0.026, 200);
      playTone(ctx, 1568, 170, "triangle", 0.024, 330);
    }
  });
}

function animateClass(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function animateRunner() {
  const gaugeFill = qs("gameGaugeFill");
  if (!gaugeFill) return;
  gaugeFill.classList.remove("gauge-running");
  void gaugeFill.offsetWidth;
  gaugeFill.classList.add("gauge-running");
  setTimeout(() => gaugeFill.classList.remove("gauge-running"), 980);
}

function triggerGamePickAnimations() {
  animateClass(qs("gameCurrentSftr"), "game-bump");
  animateClass(qs("gameGaugeFill"), "game-bump");
  animateClass(qs("gameScore"), "game-bump");
  animateRunner();
  const loadBars = qs("gameLoadBars");
  if (loadBars) {
    const chart = loadBars.querySelector(".viz-card");
    animateClass(chart, "game-waterfall");
  }
  animateClass(document.querySelector(".game-card"), "game-card-hit");
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function weightedSolarIrr(exposures, city) {
  if (!exposures || !exposures.length) {
    return estimateSolarIrrForGame({
      solarOri: "S",
      solarMonth: city.month,
      solarHour: city.hour,
      tOutCool: city.tOutCool,
    });
  }
  const totalArea = exposures.reduce((sum, item) => sum + item.area, 0) || 1;
  const weighted = exposures.reduce((sum, item) => sum + item.area * estimateSolarIrrForGame({
    solarOri: item.ori,
    solarMonth: city.month,
    solarHour: city.hour,
    tOutCool: city.tOutCool,
  }), 0);
  return Math.round(weighted / totalArea);
}

function buildExcelStartingScenarioLibrary() {
  const library = [];
  EXCEL_STARTING_SPACES.forEach((space, spaceIdx) => {
    for (let variantIdx = 0; variantIdx < space.variants; variantIdx += 1) {
      const city = STARTING_CITY_VARIANTS[variantIdx % STARTING_CITY_VARIANTS.length];
      const assumptions = STARTING_ASSUMPTION_VARIANTS[(spaceIdx + variantIdx) % STARTING_ASSUMPTION_VARIANTS.length];
      const defaults = OCCUPANCY_62_1_2022[space.template.occupancy] || OCCUPANCY_62_1_2022.office;
      const people = Math.max(0, space.values.people);
      const areaPerPerson = people > 0 ? round1(space.values.floorArea / people) : round1(space.values.floorArea * 1000);
      const cardPower = (space.floorLabel === "Ground Floor" && space.template.occupancy === "classroom" && city.label === "Jaipur, RJ")
        ? 1.1
        : 1;
      const preset = {
        template: {
          label: `${space.template.label} | ${space.floorLabel}`,
          occupancy: space.template.occupancy,
        },
        cityLabel: city.label,
        orientation: space.orientation,
        month: city.month,
        hour: city.hour,
        cardPower,
        values: {
          floorArea: space.values.floorArea,
          wallArea: space.values.wallArea,
          grossWallArea: space.values.wallArea + space.values.windowArea,
          roofArea: space.values.roofArea,
          windowArea: space.values.windowArea,
          wwr: (space.values.wallArea + space.values.windowArea) > 0
            ? round2(space.values.windowArea / (space.values.wallArea + space.values.windowArea))
            : 0,
          areaPerPerson,
          people,
          uWall: assumptions.uWall,
          uWindow: assumptions.uWindow,
          uRoof: assumptions.uRoof,
          shgc: assumptions.shgc,
          solarIrr: weightedSolarIrr(space.exposures, city),
          clf: 1.0,
          peopleSens: 75,
          peopleLat: 55,
          lpd: space.values.lpd,
          lightingUF: assumptions.lightingUF,
          epd: space.values.epd,
          equipUF: assumptions.equipUF,
          oaPerPerson: round2(defaults.rp * assumptions.oaPersonFactor),
          oaPerArea: round2(defaults.ra * assumptions.oaAreaFactor),
          height: assumptions.height,
          ach: assumptions.ach,
          tOutCool: city.tOutCool,
          tInCool: 24,
          wOut: city.wOut,
          rhIn: 60,
          wIn: humidityRatioGkgFromDbRh(24, 60),
          safety: 10,
        },
      };
      library.push(preset);
    }
  });
  return library;
}

function estimateSolarIrrForGame({ solarOri, solarMonth, solarHour, tOutCool }) {
  const oriPeak = {
    N: { peak: 230, peakHour: 12 },
    NE: { peak: 430, peakHour: 10 },
    E: { peak: 560, peakHour: 9 },
    SE: { peak: 620, peakHour: 10 },
    S: { peak: 700, peakHour: 12 },
    SW: { peak: 760, peakHour: 14 },
    W: { peak: 800, peakHour: 15 },
    NW: { peak: 520, peakHour: 14 },
  };
  const monthFactor = {
    1: 0.66, 2: 0.76, 3: 0.9, 4: 1.0, 5: 1.08, 6: 1.1,
    7: 1.08, 8: 1.03, 9: 0.92, 10: 0.82, 11: 0.72, 12: 0.64,
  };
  const { peak, peakHour } = oriPeak[solarOri] || oriPeak.S;
  const sigma = 2.4;
  const hourFactor = 0.45 + 0.55 * Math.exp(-((solarHour - peakHour) ** 2) / (2 * sigma * sigma));
  const seasonal = monthFactor[solarMonth] || 1.0;
  const climateAdj = Math.min(1.15, Math.max(0.85, tOutCool / 35));
  return Math.round(Math.max(80, Math.min(950, peak * seasonal * hourFactor * climateAdj)));
}

function makeFaultScenario() {
  const templates = [
    { label: "Office Floor", occupancy: "office", floorArea: [280, 620], wallAreaFactor: [0.8, 1.15] },
    { label: "Retail Hall", occupancy: "retail", floorArea: [240, 520], wallAreaFactor: [0.9, 1.25] },
    { label: "Classroom Wing", occupancy: "classroom", floorArea: [220, 450], wallAreaFactor: [0.85, 1.2] },
    { label: "Restaurant Zone", occupancy: "restaurant", floorArea: [240, 480], wallAreaFactor: [0.85, 1.1] },
  ];
  const template = pickRandom(templates);
  const city = indiaProfiles.length ? pickRandom(indiaProfiles) : null;
  const floorArea = round1(rand(template.floorArea[0], template.floorArea[1]));
  const grossWallArea = round1(floorArea * rand(template.wallAreaFactor[0], template.wallAreaFactor[1]));
  const roofArea = round1(floorArea * rand(0.96, 1.12));
  const occupancyDefaults = OCCUPANCY_62_1_2022[template.occupancy] || OCCUPANCY_62_1_2022.office;
  const wwrPct = round1(rand(34, 58));
  const areaPerPerson = round1(rand(11, 18));
  const tOutCool = city ? city.tOutCool : round1(rand(33, 41));
  const wOut = city ? city.wOut : round1(rand(14, 20));
  const month = city?.designMonth || 5;
  const hour = city?.designHour || 15;
  const orientation = pickRandom(["W", "SW", "S", "SE"]);

  const values = {
    floorArea,
    grossWallArea,
    wwr: wwrPct / 100,
    areaPerPerson,
    wallArea: grossWallArea * (1 - (wwrPct / 100)),
    windowArea: grossWallArea * (wwrPct / 100),
    roofArea,
    uWall: round2(rand(1.1, 2.1)),
    uWindow: round2(rand(3.2, 5.0)),
    uRoof: round2(rand(0.9, 1.7)),
    shgc: round2(rand(0.35, 0.62)),
    solarIrr: estimateSolarIrrForGame({ solarOri: orientation, solarMonth: month, solarHour: hour, tOutCool }),
    clf: 1.0,
    people: floorArea / areaPerPerson,
    peopleSens: Math.round(rand(70, 78)),
    peopleLat: Math.round(rand(52, 62)),
    lpd: round1(rand(7.5, 12.5)),
    lightingUF: round2(rand(0.78, 0.92)),
    epd: round1(rand(7.5, 12.5)),
    equipUF: round2(rand(0.72, 0.9)),
    oaPerPerson: round2(occupancyDefaults.rp * rand(1.0, 1.25)),
    oaPerArea: round2(occupancyDefaults.ra * rand(1.0, 1.25)),
    height: round1(rand(2.9, 3.5)),
    ach: round2(rand(0.22, 0.5)),
    tOutCool,
    tInCool: 24,
    wOut,
    rhIn: 60,
    wIn: humidityRatioGkgFromDbRh(24, 60),
    safety: Math.round(rand(8, 12)),
  };

  return {
    template,
    city,
    orientation,
    month,
    hour,
    baseValues: values,
    currentValues: { ...values },
    pickedCards: new Set(),
    playedCards: [],
    milestonesSeen: new Set(),
  };
}

function scenarioFromPreset(preset) {
  const values = {
    ...preset.values,
    clf: 1.0,
  };
  normalizeGameValues(values);
  return {
    template: { ...preset.template },
    city: { label: preset.cityLabel || "Hot Weather Design Day" },
    orientation: preset.orientation,
    month: preset.month,
    hour: preset.hour,
    baseValues: values,
    currentValues: cloneGameValues(values),
    pickedCards: new Set(),
    playedCards: [],
    milestonesSeen: new Set(),
    cardPower: preset.cardPower ?? 1,
  };
}

function getSfPerTr(values) {
  const metrics = computeLoads(values);
  const designTr = wattsToTr(metrics.designCooling);
  return designTr > 0 ? (values.floorArea * M2_TO_FT2) / designTr : 0;
}

function clampWwr(wwr, wallArea = 0) {
  if (!(wallArea > 0)) return 0;
  return Math.max(0.10, Math.min(0.95, wwr));
}

function normalizeGameValues(values) {
  const grossWallArea = values.grossWallArea ?? (values.wallArea + values.windowArea);
  values.grossWallArea = Math.max(0, grossWallArea);
  values.wwr = clampWwr(values.wwr, values.grossWallArea);
  values.windowArea = values.grossWallArea * values.wwr;
  values.wallArea = values.grossWallArea - values.windowArea;
  values.people = values.floorArea / values.areaPerPerson;
  values.wIn = humidityRatioGkgFromDbRh(values.tInCool, values.rhIn);
}

function cloneGameValues(values) {
  return { ...values };
}

function buildFiveCardCombinations(total = 12, pick = 5) {
  const out = [];
  const cur = [];
  function walk(start, left) {
    if (left === 0) {
      out.push([...cur]);
      return;
    }
    for (let i = start; i <= total - left; i += 1) {
      cur.push(i);
      walk(i + 1, left - 1);
      cur.pop();
    }
  }
  walk(0, pick);
  return out;
}

const FIVE_CARD_COMBINATIONS = buildFiveCardCombinations(12, 5);

function getFaultActions(scenario) {
  const power = scenario?.cardPower || 1;
  const powerMin = (base, min) => Math.max(min, round2(base));
  const multPow = (value, mult, min) => Math.max(min, value * (mult ** power));
  return [
    {
      id: "glass",
      title: "Glass Retrofit",
      preview(values) {
        const shgcNext = powerMin(multPow(values.shgc, 0.35, 0.04), 0.04);
        const uWindowNext = powerMin(multPow(values.uWindow, 0.35, 0.6), 0.6);
        return `Change SHGC from ${values.shgc.toFixed(2)} to ${shgcNext.toFixed(2)}; window U from ${values.uWindow.toFixed(2)} to ${uWindowNext.toFixed(2)}.`;
      },
      apply(values) {
        values.shgc = powerMin(multPow(values.shgc, 0.35, 0.04), 0.04);
        values.uWindow = powerMin(multPow(values.uWindow, 0.35, 0.6), 0.6);
      },
    },
    {
      id: "shade",
      title: "Exterior Shading",
      preview(values) {
        const irrNext = Math.max(20, Math.round(values.solarIrr * (0.35 ** power)));
        return `Change solar irradiance from ${values.solarIrr.toFixed(0)} to ${irrNext.toFixed(0)} W/m2.`;
      },
      apply(values) {
        values.solarIrr = Math.max(20, Math.round(values.solarIrr * (0.35 ** power)));
      },
    },
    {
      id: "tight",
      title: "Air Sealing",
      preview(values) {
        const achNext = Math.max(0.02, round2(values.ach * (0.2 ** power)));
        return `Change ACH from ${values.ach.toFixed(2)} to ${achNext.toFixed(2)}.`;
      },
      apply(values) {
        values.ach = Math.max(0.02, round2(values.ach * (0.2 ** power)));
      },
    },
    {
      id: "rh-reset",
      title: "RH Setpoint Reset",
      preview(values) {
        const rhNext = 70;
        return `Change max RH from ${values.rhIn.toFixed(0)}% to ${rhNext}%.`;
      },
      apply(values) {
        values.rhIn = 70;
        values.wIn = humidityRatioGkgFromDbRh(values.tInCool, values.rhIn);
      },
    },
    {
      id: "diversity",
      title: "Occupancy Diversity",
      preview(values) {
        const peopleNow = Math.max(1, Math.round(values.people));
        const peopleNext = Math.max(1, Math.round(values.people * (0.38 ** power)));
        const areaNext = round1(values.floorArea / peopleNext);
        return `Change effective occupants from ${peopleNow} to ${peopleNext} and area/person from ${values.areaPerPerson.toFixed(1)} to ${areaNext.toFixed(1)} m2/person.`;
      },
      apply(values) {
        const peopleNext = Math.max(1, Math.round(values.people * (0.38 ** power)));
        values.areaPerPerson = round1(values.floorArea / peopleNext);
        values.people = peopleNext;
      },
    },
    {
      id: "dcv",
      title: "Demand Control Ventilation",
      preview(values) {
        const rpNext = Math.max(0.08, round2(values.oaPerPerson * (0.18 ** power)));
        const raNext = Math.max(0.02, round2(values.oaPerArea * (0.75 ** power)));
        return "Outside air requirements adjusted to match occupant diversity.";
      },
      apply(values) {
        values.oaPerPerson = Math.max(0.08, round2(values.oaPerPerson * (0.18 ** power)));
        values.oaPerArea = Math.max(0.02, round2(values.oaPerArea * (0.75 ** power)));
      },
    },
    {
      id: "lights",
      title: "Lighting Upgrade",
      preview(values) {
        const lpdNext = round1(Math.max(0.6, values.lpd * (0.3 ** power)));
        const ufNext = Math.max(0.3, round2(values.lightingUF * (0.7 ** power)));
        return `Change LPD from ${values.lpd.toFixed(1)} to ${lpdNext.toFixed(1)} and lighting UF from ${values.lightingUF.toFixed(2)} to ${ufNext.toFixed(2)}.`;
      },
      apply(values) {
        values.lpd = round1(Math.max(0.6, values.lpd * (0.3 ** power)));
        values.lightingUF = Math.max(0.3, round2(values.lightingUF * (0.7 ** power)));
      },
    },
    {
      id: "plug",
      title: "Plug Load Cleanup",
      preview(values) {
        const epdNext = round1(Math.max(0.6, values.epd * (0.3 ** power)));
        const ufNext = Math.max(0.3, round2(values.equipUF * (0.7 ** power)));
        return `Change EPD from ${values.epd.toFixed(1)} to ${epdNext.toFixed(1)} and equipment UF from ${values.equipUF.toFixed(2)} to ${ufNext.toFixed(2)}.`;
      },
      apply(values) {
        values.epd = round1(Math.max(0.6, values.epd * (0.3 ** power)));
        values.equipUF = Math.max(0.3, round2(values.equipUF * (0.7 ** power)));
      },
    },
    {
      id: "window",
      title: "WWR Reduction",
      preview(values) {
        const nextWwr = Math.max(0.10, Math.min(0.95, values.wwr - 0.3 * power));
        return `Change WWR from ${(values.wwr * 100).toFixed(0)}% to ${(nextWwr * 100).toFixed(0)}%.`;
      },
      apply(values) {
        const nextWwr = Math.max(0.10, Math.min(0.95, values.wwr - 0.3 * power));
        values.wwr = round2(nextWwr);
      },
    },
    {
      id: "roof",
      title: "Roof Insulation",
      preview(values) {
        const uRoofNext = Math.max(0.08, round2(values.uRoof * (0.25 ** power)));
        return `Change roof U from ${values.uRoof.toFixed(2)} to ${uRoofNext.toFixed(2)} W/m2-K.`;
      },
      apply(values) {
        values.uRoof = Math.max(0.08, round2(values.uRoof * (0.25 ** power)));
      },
    },
    {
      id: "wall",
      title: "Wall Insulation",
      preview(values) {
        const uWallNext = Math.max(0.08, round2(values.uWall * (0.25 ** power)));
        return `Change wall U from ${values.uWall.toFixed(2)} to ${uWallNext.toFixed(2)} W/m2-K.`;
      },
      apply(values) {
        values.uWall = Math.max(0.08, round2(values.uWall * (0.25 ** power)));
      },
    },
    {
      id: "setpoint",
      title: "Temperature Setpoint Reset",
      preview(values) {
        const tInNext = Math.min(values.tOutCool - 0.1, round1(values.tInCool + 4.0 * power));
        return `Change indoor DB from ${values.tInCool.toFixed(1)} C to ${tInNext.toFixed(1)} C.`;
      },
      apply(values) {
        values.tInCool = Math.min(values.tOutCool - 0.1, round1(values.tInCool + 4.0 * power));
        values.wIn = humidityRatioGkgFromDbRh(values.tInCool, values.rhIn);
      },
    },
  ];
}

function evaluateBestFiveCardSftr(scenario) {
  const actions = getFaultActions(scenario);
  let best = -Infinity;
  for (const combo of FIVE_CARD_COMBINATIONS) {
    const values = cloneGameValues(scenario.baseValues);
    for (const idx of combo) {
      actions[idx].apply(values, scenario);
      normalizeGameValues(values);
    }
    best = Math.max(best, getSfPerTr(values));
  }
  return best;
}

function makeReachableFaultScenario() {
  const powerLevels = [1, 1.2, 1.4, 1.7, 2.1, 2.6];
  const baseMin = TARGET_BASE_SFTR - BASE_SFTR_TOLERANCE;
  const baseMax = TARGET_BASE_SFTR + BASE_SFTR_TOLERANCE;
  let bestFallback = null;
  let bestFallbackDelta = Infinity;

  for (const power of powerLevels) {
    for (let i = 0; i < 240; i += 1) {
      const scenario = makeFaultScenario();
      scenario.cardPower = power;
      const baseSftr = getSfPerTr(scenario.baseValues);
      const bestSftr = evaluateBestFiveCardSftr(scenario);
      const baseDelta = Math.abs(baseSftr - TARGET_BASE_SFTR);
      if (bestSftr >= TARGET_SFTR && baseSftr >= baseMin && baseSftr <= baseMax) {
        scenario.baseSftr = baseSftr;
        scenario.bestPossibleSftr = bestSftr;
        return scenario;
      }
      if (bestSftr >= TARGET_SFTR && baseDelta < bestFallbackDelta) {
        bestFallback = scenario;
        bestFallback.baseSftr = baseSftr;
        bestFallback.bestPossibleSftr = bestSftr;
        bestFallbackDelta = baseDelta;
      }
    }
  }
  if (bestFallback) return bestFallback;
  const fallback = makeFaultScenario();
  fallback.cardPower = 3.2;
  fallback.baseSftr = getSfPerTr(fallback.baseValues);
  fallback.bestPossibleSftr = evaluateBestFiveCardSftr(fallback);
  return fallback;
}

function renderFaultPrompt(scenario) {
  const cityLabel = scenario.city ? scenario.city.label : "Hot Weather Design Day";
  return `
    <span class="prompt-title">${scenario.template.label}</span>
    <span class="prompt-meta">City: ${cityLabel} | Orientation: ${scenario.orientation} | ${monthName(scenario.month)} ${String(scenario.hour).padStart(2, "0")}:00</span>
  `;
}

function setGameMessage(message, isError = false) {
  const el = qs("gameFeedback");
  if (!el) return;
  el.textContent = message;
  el.className = isError ? "game-feedback error" : "game-feedback muted";
}

function setGameOutcome(content = "", tone = "") {
  const el = qs("gameOutcome");
  if (!el) return;
  if (!content) {
    el.innerHTML = "";
    el.className = "game-outcome";
    return;
  }
  el.innerHTML = content;
  el.className = `game-outcome show ${tone}`;
}

function renderOutcomeBanner({ success, sftr, points, target }) {
  const icon = success ? "✓" : "!";
  const eyebrow = success ? "Run Complete" : "Run Closed";
  const title = success ? "Success!" : "Fail!";
  const subcopy = `You reached ${sftr.toFixed(0)} SF/TR. The goal was ${target}.`;
  const pointsLabel = `Score: ${points}`;
  return `
    <div class="outcome-shell">
      <div class="outcome-mark">${icon}</div>
      <div class="outcome-copy">
        <span class="outcome-eyebrow">${eyebrow}</span>
        <h3 class="outcome-title">${title}</h3>
        <p class="outcome-text">${subcopy}</p>
      </div>
      <div class="outcome-metrics">
        <span class="outcome-chip primary">${pointsLabel}</span>
      </div>
    </div>`;
}

function formatOaPerPerson(value) {
  return `${value.toFixed(2)} L/s-person`;
}

function formatOaPerArea(value) {
  return `${value.toFixed(2)} L/s-m2`;
}

function getPlayZoneText(override = "") {
  if (override) return override;
  return `Drag cards here. ${gameState.picksUsed} of ${gameState.picksMax} cards picked.`;
}

function setPlayZoneState(text = "", tone = "") {
  const zone = qs("gamePlayZone");
  const label = qs("gamePlayZoneText");
  if (!zone || !label) return;
  label.textContent = getPlayZoneText(text);
  zone.classList.remove("active", "over");
  if (tone) zone.classList.add(tone);
}

function clearMilestone() {
  const el = qs("gameMilestone");
  if (milestoneTimer) {
    clearTimeout(milestoneTimer);
    milestoneTimer = null;
  }
  if (milestoneQueueTimer) {
    clearTimeout(milestoneQueueTimer);
    milestoneQueueTimer = null;
  }
  if (!el) return;
  el.innerHTML = "";
  el.className = "game-milestone";
}

function clearWaterfallAutoOpenTimer() {
  if (waterfallAutoOpenTimer) {
    clearTimeout(waterfallAutoOpenTimer);
    waterfallAutoOpenTimer = null;
  }
}

function scheduleEndStateWaterfallAutoOpen() {
  clearWaterfallAutoOpenTimer();
  waterfallAutoOpenTimer = setTimeout(() => {
    const keys = ["start-waterfall", "final-waterfall"];
    let changed = false;
    keys.forEach((key) => {
      if (!gameState.waterfallTouched[key]) {
        gameState.waterfallOpen[key] = true;
        changed = true;
      }
    });
    waterfallAutoOpenTimer = null;
    if (changed) updateFaultDashboard();
  }, 2000);
}

function showMilestone(threshold) {
  const el = qs("gameMilestone");
  if (!el) return;
  const tone = threshold >= 500 ? "m500" : threshold >= 400 ? "m400" : threshold >= 300 ? "m300" : "m200";
  const copy =
    threshold >= 600 ? "Elite pace. Keep climbing." :
    threshold >= 500 ? "Target line cleared. Push higher." :
    threshold >= 400 ? "Gold push. One more clean move can decide the run." :
    threshold >= 300 ? "Momentum up. Keep trimming the biggest driver." :
    "Good start. Keep the pressure on.";
  el.innerHTML = `<span class="milestone-title">Milestone: ${threshold} SF/TR</span><span class="milestone-copy">${copy}</span>`;
  el.className = `game-milestone show ${tone}`;
  animateClass(el, "game-bump");
  playGameSound(`milestone-${threshold}`);
  milestoneTimer = setTimeout(() => {
    if (!el) return;
    el.className = "game-milestone";
    milestoneTimer = null;
  }, MILESTONE_DISPLAY_MS);
}

function handleMilestones(previousSftr, currentSftr) {
  if (!gameState.current) return;
  const maxThreshold = Math.floor(currentSftr / 100) * 100;
  const candidates = [];
  for (let value = 200; value <= Math.max(200, maxThreshold); value += 100) candidates.push(value);
  const thresholds = candidates.filter((value) =>
    previousSftr < value &&
    currentSftr >= value &&
    !gameState.current.milestonesSeen.has(value)
  );
  if (!thresholds.length) return;
  thresholds.forEach((value) => gameState.current.milestonesSeen.add(value));
  clearMilestone();
  thresholds.forEach((value, idx) => {
    const delay = idx * MILESTONE_QUEUE_GAP_MS;
    if (delay === 0) {
      showMilestone(value);
    } else {
      milestoneQueueTimer = setTimeout(() => showMilestone(value), delay);
    }
  });
}

function getCardToneClass(actionId) {
  const toneMap = {
    glass: "tone-blue",
    shade: "tone-orange",
    tight: "tone-green",
    "rh-reset": "tone-purple",
    diversity: "tone-gold",
    dcv: "tone-blue",
    lights: "tone-orange",
    plugs: "tone-green",
    window: "tone-purple",
    roof: "tone-gold",
    wall: "tone-blue",
    setpoint: "tone-orange",
  };
  return toneMap[actionId] || "tone-blue";
}

function renderPlayedCards() {
  const container = qs("gamePlayedCards");
  if (!container || !gameState.current) return;
  container.innerHTML = gameState.current.playedCards
    .map((action) => {
      return `
        <div class="played-card ${getCardToneClass(action.id)}">
          <strong>${action.title}</strong>
          <small>${action.desc}</small>
        </div>`;
    })
    .join("");
}

function updateGameMeta() {
  const scoreEl = qs("gameScore");
  const statusEl = qs("gameStatus");
  if (statusEl) statusEl.textContent = "";
}

function renderGameLoadBars(values) {
  const metrics = computeLoads(values);
  const waterfallComponents = [
    { label: "Windows", sensible: wattsToKw(metrics.windowTotalSens), latent: 0 },
    { label: "Walls", sensible: wattsToKw(metrics.wallSens), latent: 0 },
    { label: "Roof", sensible: wattsToKw(metrics.roofSens), latent: 0 },
    { label: "People", sensible: wattsToKw(metrics.peopleSensible), latent: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", sensible: wattsToKw(metrics.lightingSensible), latent: 0 },
    { label: "Equipment", sensible: wattsToKw(metrics.equipmentSensible), latent: 0 },
    { label: "Ventilation", sensible: wattsToKw(metrics.ventSensible), latent: wattsToKw(metrics.ventLatent) },
  ];
  return renderWaterfallChart(waterfallComponents, {
    chartKey: "live-waterfall",
    cardClass: "game-waterfall",
  });
}

function renderEndStateWaterfalls(scenario) {
  const startComponents = getWaterfallComponentsFromValues(scenario.baseValues);
  const finalComponents = getWaterfallComponentsFromValues(scenario.currentValues);
  const startBuilt = buildWaterfallRows(startComponents);
  const finalBuilt = buildWaterfallRows(finalComponents);
  const minCum = Math.min(startBuilt.minCum, finalBuilt.minCum);
  const maxCum = Math.max(startBuilt.maxCum, finalBuilt.maxCum);
  return `
    <div class="summary-grid">
      <div class="summary-compare-grid">
        <section class="summary-card">${renderWaterfallChart(startComponents, { title: "Starting Case Waterfall", minCum, maxCum, chartKey: "start-waterfall" })}</section>
        <section class="summary-card">${renderWaterfallChart(finalComponents, { title: "Final Case Waterfall", minCum, maxCum, chartKey: "final-waterfall" })}</section>
      </div>
    </div>`;
}

function updateFaultDashboard() {
  const scenario = gameState.current;
  if (!scenario) return;
  const baseSftr = getSfPerTr(scenario.baseValues);
  const currentSftr = getSfPerTr(scenario.currentValues);
  const ratio = Math.max(0, Math.min(1, currentSftr / 700));

  const baseEl = qs("gameBaseSftr");
  const currentEl = qs("gameCurrentSftr");
  const prompt = qs("gamePrompt");
  const loadBars = qs("gameLoadBars");
  const gaugeFill = qs("gameGaugeFill");
  if (baseEl) baseEl.textContent = baseSftr.toFixed(0);
  if (currentEl) currentEl.textContent = currentSftr.toFixed(0);
  if (prompt) prompt.innerHTML = renderFaultPrompt(scenario);
  if (loadBars) {
    loadBars.innerHTML = gameState.revealed ? renderEndStateWaterfalls(scenario) : renderGameLoadBars(scenario.currentValues);
    bindWaterfallState(loadBars);
  }
  if (gaugeFill) gaugeFill.style.width = `${(ratio * 100).toFixed(1)}%`;
  setPlayZoneState();
}

function renderFaultActions() {
  const container = qs("gameActions");
  if (!container || !gameState.current) return;
  const actions = getFaultActions(gameState.current);
  container.innerHTML = actions
    .filter((a) => !gameState.current.pickedCards.has(a.id))
    .map((a) => {
      const desc = a.preview ? a.preview(gameState.current.currentValues, gameState.current) : "";
      const enabled = !(gameState.revealed || gameState.picksUsed >= gameState.picksMax);
      return `
        <button type="button" class="action-chip ${getCardToneClass(a.id)}" data-action-id="${a.id}" ${enabled ? 'draggable="true"' : ""} ${enabled ? "" : "disabled"}>
          <strong>${a.title}</strong>
          <small>${desc}</small>
        </button>`;
    })
    .join("");

  container.querySelectorAll("[data-action-id]").forEach((btn) => {
    const actionId = btn.getAttribute("data-action-id");
    btn.addEventListener("dragstart", (event) => {
      if (btn.disabled) return;
      unlockAudioContext();
      gameState.dragActionId = actionId || "";
      btn.classList.add("action-dragging");
      if (event.dataTransfer) {
        event.dataTransfer.setData("text/plain", gameState.dragActionId);
        event.dataTransfer.effectAllowed = "move";
      }
      setPlayZoneState(`Drop to play this card. ${gameState.picksUsed} of ${gameState.picksMax} cards picked.`, "active");
    });
    btn.addEventListener("dragend", () => {
      btn.classList.remove("action-dragging");
      gameState.dragActionId = "";
      setPlayZoneState();
    });
  });
  renderPlayedCards();
}

function initDragToPlay() {
  const zone = qs("gamePlayZone");
  if (!zone) return;
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("active", "over");
  });
  zone.addEventListener("dragleave", () => {
    zone.classList.remove("over");
  });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    unlockAudioContext();
    const dropped = event.dataTransfer?.getData("text/plain") || gameState.dragActionId;
    zone.classList.remove("over");
    setPlayZoneState();
    if (dropped) applyFaultAction(dropped);
    gameState.dragActionId = "";
  });
}

function renderStartingCaseTable(scenario) {
  const v = scenario.baseValues;
  const cityLabel = scenario.city ? scenario.city.label : "Hot Weather Design Day";
  const rows = [
    ["Type", scenario.template.label],
    ["City", cityLabel],
    ["Orientation", scenario.orientation],
    ["Floor Area", `${v.floorArea.toFixed(1)} m2`],
    ["Wall Area", `${v.wallArea.toFixed(1)} m2`],
    ["Roof Area", `${v.roofArea.toFixed(1)} m2`],
    ["WWR", `${(v.wwr * 100).toFixed(1)} %`],
    ["Wall U", `${v.uWall.toFixed(2)} W/m2-K`],
    ["Window U", `${v.uWindow.toFixed(2)} W/m2-K`],
    ["Roof U", `${v.uRoof.toFixed(2)} W/m2-K`],
    ["SHGC", `${v.shgc.toFixed(2)}`],
    ["Solar Irradiance", `${v.solarIrr.toFixed(0)} W/m2`],
    ["Area per Person", `${v.areaPerPerson.toFixed(1)} m2/person`],
    ["LPD / EPD", `${v.lpd.toFixed(1)} / ${v.epd.toFixed(1)} W/m2`],
    ["OA Rates", `${v.oaPerPerson.toFixed(1)} L/s-person + ${v.oaPerArea.toFixed(2)} L/s-m2`],
    ["ACH", `${v.ach.toFixed(2)}`],
    ["Outdoor DB / Indoor DB", `${v.tOutCool.toFixed(1)} C / ${v.tInCool.toFixed(1)} C`],
    ["Safety", `${v.safety.toFixed(0)} %`],
  ];
  return `<table class="results-table"><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table>`;
}

function renderStartingCaseResults(scenario) {
  const values = scenario.baseValues;
  const metrics = computeLoads(values);
  const designKw = wattsToKw(metrics.designCooling);
  const designTr = wattsToTr(metrics.designCooling);
  const sftr = getSfPerTr(values);
  const cityLabel = scenario.city?.label || "Selected City";
  const month = scenario.month;
  const hour = scenario.hour;
  const irr = values.solarIrr;

  const envelopeWm2 = metrics.envelopeTotalSens / Math.max(values.floorArea, 0.001);
  const internalWm2 =
    (metrics.peopleSensible +
      metrics.peopleLatent +
      metrics.lightingSensible +
      metrics.equipmentSensible +
      metrics.ventSensible +
      metrics.ventLatent) /
    Math.max(values.floorArea, 0.001);

  const waterfallComponents = [
    { label: "Windows", sensible: wattsToKw(metrics.windowTotalSens), latent: 0 },
    { label: "Walls", sensible: wattsToKw(metrics.wallSens), latent: 0 },
    { label: "Roof", sensible: wattsToKw(metrics.roofSens), latent: 0 },
    { label: "People", sensible: wattsToKw(metrics.peopleSensible), latent: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", sensible: wattsToKw(metrics.lightingSensible), latent: 0 },
    { label: "Equipment", sensible: wattsToKw(metrics.equipmentSensible), latent: 0 },
    { label: "Ventilation", sensible: wattsToKw(metrics.ventSensible), latent: wattsToKw(metrics.ventLatent) },
  ];

  const envelopeRows = [
    { label: "Windows", value: wattsToKw(metrics.windowTotalSens) },
    { label: "Walls", value: wattsToKw(metrics.wallSens) },
    { label: "Roof", value: wattsToKw(metrics.roofSens) },
    { label: "Envelope Total", value: wattsToKw(metrics.envelopeTotalSens) },
  ];

  const internalRows = [
    { label: "People Sensible", value: wattsToKw(metrics.peopleSensible) },
    { label: "People Latent", value: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", value: wattsToKw(metrics.lightingSensible) },
    { label: "Equipment", value: wattsToKw(metrics.equipmentSensible) },
    { label: "Ventilation Sensible", value: wattsToKw(metrics.ventSensible) },
    { label: "Ventilation Latent", value: wattsToKw(metrics.ventLatent) },
  ];

  return `
    <div class="results-top-grid">
      <section class="kpi kpi-single">
        <p class="muted">Cooling Capacity</p>
        <p class="kpi-value">${designKw.toFixed(2)} kW <span class="sep">|</span> ${designTr.toFixed(2)} TR</p>
        <p class="muted">SF/TR: ${sftr.toFixed(1)}</p>
        <p class="meta-note">City weather applied: ${cityLabel} (Cooling DB ${values.tOutCool.toFixed(1)} C, w ${values.wOut.toFixed(1)} g/kg, design ${month}/${String(hour).padStart(2, "0")}:00).</p>
        <p class="meta-note">Derived from city design day: ${monthName(month)} ${String(hour).padStart(2, "0")}:00, Irradiance Glass ${irr.toFixed(0)} W/m2.</p>
      </section>
      ${renderDonutChart(wattsToKw(metrics.totalSensible), wattsToKw(metrics.totalLatent))}
    </div>
    <div class="waterfall-full">${renderWaterfallChart(waterfallComponents)}</div>
    <h3>Component Breakdown</h3>
    <div class="break-grid">
      ${renderBreakdownCard("Envelope Loads", envelopeWm2, envelopeRows)}
      ${renderBreakdownCard("Internal Loads", internalWm2, internalRows)}
    </div>
  `;
}

function startFaultGame() {
  const preset = pickRandom(STARTING_SCENARIO_LIBRARY);
  gameState.current = preset ? scenarioFromPreset(preset) : makeReachableFaultScenario();
  setSplashBrief(gameState.current);
  gameState.current.baseSftr = getSfPerTr(gameState.current.baseValues);
  gameState.current.bestPossibleSftr = evaluateBestFiveCardSftr(gameState.current);
  gameState.picksUsed = 0;
  gameState.revealed = false;
  gameState.active = true;
  gameState.waterfallOpen = {};
  gameState.waterfallTouched = {};
  clearWaterfallAutoOpenTimer();
  const table = qs("gameStartingCaseTable");
  const baseResults = qs("gameStartingCaseResults");
  if (table) table.innerHTML = renderStartingCaseTable(gameState.current);
  if (baseResults) baseResults.innerHTML = renderStartingCaseResults(gameState.current);
  setGameMessage("Pick 5 cards. Results update after each pick.");
  setGameOutcome();
  clearMilestone();
  setPlayZoneState();
  playGameSound("start");
  renderFaultActions();
  updateFaultDashboard();
  updateGameMeta();
}

function startCoolingLoadGame() {
  gameState.score = 0;
  startFaultGame();
}

function applyFaultAction(actionId) {
  if (!gameState.active || !gameState.current || gameState.revealed) return;
  if (gameState.current.pickedCards.has(actionId) || gameState.picksUsed >= gameState.picksMax) return;
  const action = getFaultActions(gameState.current).find((a) => a.id === actionId);
  if (!action) return;

  const actionDesc = action.preview ? action.preview(gameState.current.currentValues, gameState.current) : "";
  const beforeSftr = getSfPerTr(gameState.current.currentValues);
  action.apply(gameState.current.currentValues, gameState.current);
  normalizeGameValues(gameState.current.currentValues);
  gameState.current.pickedCards.add(actionId);
  gameState.current.playedCards.push({ id: action.id, title: action.title, desc: actionDesc });
  gameState.picksUsed += 1;
  playGameSound("pick");
  renderFaultActions();
  setPlayZoneState();
  updateFaultDashboard();
  triggerGamePickAnimations();

  const currentSftr = getSfPerTr(gameState.current.currentValues);
  handleMilestones(beforeSftr, currentSftr);
  if (gameState.picksUsed >= gameState.picksMax) {
    finalizeGameScore();
  } else {
    setGameMessage(`Applied ${action.title}. Current SF/TR: ${currentSftr.toFixed(0)}.`);
  }
}

function finalizeGameScore() {
  if (!gameState.active || !gameState.current || gameState.revealed || gameState.picksUsed < gameState.picksMax) return;
  gameState.revealed = true;
  const startSftr = getSfPerTr(gameState.current.baseValues);
  const sftr = getSfPerTr(gameState.current.currentValues);
  const success = sftr >= TARGET_SFTR;
  let points = 0;
  if (success) {
    points = Math.max(0, Math.round(sftr - startSftr));
    gameState.score += points;
    setGameMessage(`Congratulations! You made it. Final SF/TR: ${sftr.toFixed(0)}. +${points} points.`);
    setGameOutcome(renderOutcomeBanner({ success, sftr, points, target: TARGET_SFTR }), "success");
    playGameSound("finale-success");
  } else {
    setGameMessage(`Sorry, you didn't make it. Final SF/TR: ${sftr.toFixed(0)}. Target is ${TARGET_SFTR}+.`, true);
    setGameOutcome(renderOutcomeBanner({ success, sftr, points, target: TARGET_SFTR }), "fail");
    playGameSound("finale-fail");
  }
  renderFaultActions();
  updateFaultDashboard();
  scheduleEndStateWaterfallAutoOpen();
  updateGameMeta();
}

function initCoolingLoadGame() {
  const sound = qs("gameSound");
  const soundIcon = qs("gameSoundIcon");
  if (!sound || !soundIcon) return;

  document.addEventListener("pointerdown", unlockAudioContext, { once: true, passive: true });
  document.addEventListener("touchstart", unlockAudioContext, { once: true, passive: true });
  document.addEventListener("keydown", unlockAudioContext, { once: true });

  sound.addEventListener("click", () => {
    unlockAudioContext();
    gameFx.soundEnabled = !gameFx.soundEnabled;
    soundIcon.textContent = gameFx.soundEnabled ? "🔊" : "🔈";
    sound.setAttribute("title", gameFx.soundEnabled ? "Sound On" : "Sound Off");
    if (gameFx.soundEnabled) playGameSound("pick");
  });
  initDragToPlay();
  startCoolingLoadGame();
}

function renderDonutChart(sensibleKw, latentKw) {
  const sensMag = Math.abs(sensibleKw);
  const latMag = Math.abs(latentKw);
  const totalMag = Math.max(0.001, sensMag + latMag);
  const sensPct = sensMag / totalMag;
  const latPct = latMag / totalMag;
  const circumference = 2 * Math.PI * 44;
  const sensLen = sensPct * circumference;
  const latLen = latPct * circumference;
  return `
    <div class="viz-card">
      <h4>Donut: Sensible vs Latent</h4>
      <div class="viz-row">
        <svg viewBox="0 0 120 120" class="donut-svg" aria-label="Sensible latent donut">
          <circle cx="60" cy="60" r="44" class="donut-track"></circle>
          <circle cx="60" cy="60" r="44" class="donut-sens" stroke-dasharray="${sensLen} ${circumference}"></circle>
          <circle cx="60" cy="60" r="44" class="donut-lat" stroke-dasharray="${latLen} ${circumference}" stroke-dashoffset="-${sensLen}"></circle>
        </svg>
        <div class="legend">
          <p><span class="dot sens"></span>Sensible: ${sensibleKw.toFixed(2)} kW (${(sensPct * 100).toFixed(1)}%)</p>
          <p><span class="dot lat"></span>Latent: ${latentKw.toFixed(2)} kW (${(latPct * 100).toFixed(1)}%)</p>
        </div>
      </div>
    </div>
  `;
}

function buildWaterfallRows(components) {
  let running = 0;
  const rows = components.map((c) => {
    const start = running;
    const value = c.sensible + c.latent;
    running += value;
    return { label: c.label, sensible: c.sensible, latent: c.latent, value, start, end: running };
  });
  const minCum = Math.min(0, ...rows.map((r) => r.start), ...rows.map((r) => r.end));
  const maxCum = Math.max(0, ...rows.map((r) => r.start), ...rows.map((r) => r.end));
  return { rows, minCum, maxCum };
}

function renderWaterfallChart(components, options = {}) {
  const built = buildWaterfallRows(components);
  const minCum = options.minCum ?? built.minCum;
  const maxCum = options.maxCum ?? built.maxCum;
  const rows = built.rows;
  const range = Math.max(0.001, maxCum - minCum);
  const title = options.title || "Waterfall: Cumulative Contributions";
  const chartKey = options.chartKey || "";
  const isOpen = chartKey ? Boolean(gameState.waterfallOpen[chartKey]) : false;
  const cardClass = options.cardClass ? ` ${options.cardClass}` : "";

  const bars = rows
    .map((r) => {
      const leftVal = Math.min(r.start, r.end);
      const rightVal = Math.max(r.start, r.end);
      const left = ((leftVal - minCum) / range) * 100;
      const width = ((rightVal - leftVal) / range) * 100;
      const totalMag = Math.max(0.001, Math.abs(r.sensible) + Math.abs(r.latent));
      const sensPct = (Math.abs(r.sensible) / totalMag) * 100;
      const latPct = (Math.abs(r.latent) / totalMag) * 100;
      return `
        <div class="wf-row">
          <span class="wf-label">${r.label}</span>
          <div class="wf-track">
            <div class="wf-bar" style="left:${left}%; width:${Math.max(width, 2)}%;">
              <span class="wf-seg-sens" style="width:${sensPct}%;"></span>
              <span class="wf-seg-lat" style="width:${latPct}%;"></span>
            </div>
          </div>
          <span class="wf-val">${r.end.toFixed(2)} kW</span>
        </div>`;
    })
    .join("");

  return `
    <details class="viz-card viz-card-collapsible${cardClass}" ${isOpen ? "open" : ""} ${chartKey ? `data-waterfall-key="${chartKey}"` : ""}>
      <summary class="viz-summary">
        <h4>${title}</h4>
        <span class="viz-chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="viz-body">
        ${bars}
      </div>
    </details>
  `;
}

function bindWaterfallState(container) {
  if (!container) return;
  container.querySelectorAll("details[data-waterfall-key]").forEach((details) => {
    details.addEventListener("toggle", () => {
      const key = details.getAttribute("data-waterfall-key");
      if (!key) return;
      gameState.waterfallTouched[key] = true;
      gameState.waterfallOpen[key] = details.open;
    });
  });
}

function getWaterfallComponentsFromValues(values) {
  const metrics = computeLoads(values);
  return [
    { label: "Windows", sensible: wattsToKw(metrics.windowTotalSens), latent: 0 },
    { label: "Walls", sensible: wattsToKw(metrics.wallSens), latent: 0 },
    { label: "Roof", sensible: wattsToKw(metrics.roofSens), latent: 0 },
    { label: "People", sensible: wattsToKw(metrics.peopleSensible), latent: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", sensible: wattsToKw(metrics.lightingSensible), latent: 0 },
    { label: "Equipment", sensible: wattsToKw(metrics.equipmentSensible), latent: 0 },
    { label: "Ventilation", sensible: wattsToKw(metrics.ventSensible), latent: wattsToKw(metrics.ventLatent) },
  ];
}

function renderBreakdownCard(title, wm2, rows) {
  const body = rows
    .map((r) => `<tr><td>${r.label}</td><td>${r.value.toFixed(2)} kW</td></tr>`)
    .join("");
  return `
    <section class="break-card">
      <h4>${title}</h4>
      <p class="break-summary">Total ${wm2.toFixed(1)} W/m2</p>
      <table class="results-table break-table"><tbody>${body}</tbody></table>
    </section>
  `;
}

function computeLoads(values) {
  const dTCool = values.tOutCool - values.tInCool;
  const dW = values.wOut - values.wIn;

  const wallSens = values.uWall * values.wallArea * dTCool;
  const windowCondSens = values.uWindow * values.windowArea * dTCool;
  const roofSens = values.uRoof * values.roofArea * dTCool;
  const envelopeSens = wallSens + windowCondSens + roofSens;

  const solarSens = values.windowArea * values.shgc * values.solarIrr * values.clf;
  const windowTotalSens = windowCondSens + solarSens;
  const envelopeTotalSens = wallSens + windowTotalSens + roofSens;

  const peopleSensible = values.people * values.peopleSens;
  const peopleLatent = values.people * values.peopleLat;
  const lightingSensible = values.floorArea * values.lpd * values.lightingUF;
  const equipmentSensible = values.floorArea * values.epd * values.equipUF;

  const oaLs = values.people * values.oaPerPerson + values.floorArea * values.oaPerArea;
  const infilLs = (values.floorArea * values.height * values.ach) / 3.6;
  const totalOutdoorLs = oaLs + infilLs;
  const totalOutdoorM3s = totalOutdoorLs / 1000;

  const ventSensible = AIR_DENSITY * AIR_CP * totalOutdoorM3s * dTCool;
  const ventLatent = AIR_DENSITY * HFG * totalOutdoorM3s * (dW / 1000);

  const totalSensible =
    envelopeSens +
    solarSens +
    peopleSensible +
    lightingSensible +
    equipmentSensible +
    ventSensible;

  const totalLatent = peopleLatent + ventLatent;
  const totalCooling = totalSensible + totalLatent;
  const designCooling = totalCooling * (1 + values.safety / 100);

  return {
    wallSens,
    roofSens,
    envelopeSens,
    solarSens,
    windowTotalSens,
    envelopeTotalSens,
    peopleSensible,
    peopleLatent,
    lightingSensible,
    equipmentSensible,
    totalOutdoorLs,
    ventSensible,
    ventLatent,
    totalSensible,
    totalLatent,
    totalCooling,
    designCooling,
  };
}

function validateInputs(values) {
  const nonNegativeFields = [
    "floorArea",
    "wallArea",
    "wwr",
    "areaPerPerson",
    "roofArea",
    "uWall",
    "uWindow",
    "uRoof",
    "solarIrr",
    "peopleSens",
    "peopleLat",
    "lpd",
    "epd",
    "oaPerPerson",
    "oaPerArea",
    "height",
    "ach",
    "safety",
  ];

  for (const field of nonNegativeFields) {
    if (values[field] < 0) {
      return `${field} cannot be negative.`;
    }
  }

  if (Number.isFinite(values.rhIn) && (values.rhIn < 0 || values.rhIn > 100)) {
    return "Relative Humidity (%) must be between 0 and 100.";
  }

  const zeroToOne = ["shgc", "clf", "lightingUF", "equipUF"];
  for (const field of zeroToOne) {
    if (values[field] < 0 || values[field] > 1) {
      return `${field} must be between 0 and 1.`;
    }
  }

  if (values.wwr < 0.10 || values.wwr > 0.95) {
    return "Window-to-Wall Ratio must be between 10% and 95%.";
  }

  if (values.areaPerPerson <= 0) {
    return "Area per Person must be greater than 0.";
  }

  if (values.tOutCool <= values.tInCool) {
    return "Outdoor cooling DB should be greater than indoor cooling DB.";
  }

  return "";
}

function collectValues(caseId) {
  const tInCool = getNum("tInCool", caseId);
  const rhIn = getNum("rhIn", caseId);
  const wInDerived = humidityRatioGkgFromDbRh(tInCool, rhIn);
  const floorArea = getNum("floorArea", caseId);
  const grossWallArea = getNum("wallArea", caseId);
  const wwrPct = getNum("wwr", caseId);
  const wwr = clampWwr(wwrPct / 100, grossWallArea);
  const areaPerPerson = getNum("areaPerPerson", caseId);
  const windowArea = grossWallArea * wwr;
  const wallArea = grossWallArea - windowArea;
  const people = areaPerPerson > 0 ? floorArea / areaPerPerson : 0;
  return {
    floorArea,
    grossWallArea,
    wallArea,
    wwr,
    areaPerPerson,
    windowArea,
    roofArea: getNum("roofArea", caseId),
    uWall: getNum("uWall", caseId),
    uWindow: getNum("uWindow", caseId),
    uRoof: getNum("uRoof", caseId),
    shgc: getNum("shgc", caseId),
    solarIrr: getNum("solarIrr", caseId),
    clf: 1.0,
    people,
    peopleSens: getNum("peopleSens", caseId),
    peopleLat: getNum("peopleLat", caseId),
    lpd: getNum("lpd", caseId),
    lightingUF: getNum("lightingUF", caseId),
    epd: getNum("epd", caseId),
    equipUF: getNum("equipUF", caseId),
    oaPerPerson: getNum("oaPerPerson", caseId),
    oaPerArea: getNum("oaPerArea", caseId),
    height: getNum("height", caseId),
    ach: getNum("ach", caseId),
    tOutCool: getNum("tOutCool", caseId),
    tInCool,
    wOut: getNum("wOut", caseId),
    rhIn,
    wIn: wInDerived,
    safety: getNum("safety", caseId),
  };
}

function renderError(caseId, message) {
  const target = qs(id("results", caseId));
  if (!target) return;
  setGlobalSummary(caseId, "-- kW | -- TR", "SF/TR: --");
  target.innerHTML = `
    <h2>Case ${caseId} Results</h2>
    <p class="error">${message}</p>
    <p class="muted">Fix inputs to continue.</p>
  `;
}

function renderCase(caseId) {
  const target = qs(id("results", caseId));
  if (!target) return;

  const values = collectValues(caseId);
  const validationError = validateInputs(values);
  if (validationError) {
    renderError(caseId, validationError);
    return;
  }

  const metrics = computeLoads(values);
  const select = qs(id("citySelect", caseId));
  const cityLabel = select?.selectedOptions?.[0]?.textContent || "Selected City";
  const month = Number(qs(id("solarMonth", caseId))?.value || 5);
  const hour = Number(qs(id("solarHour", caseId))?.value || 14);
  const irr = Number(qs(id("solarIrr", caseId))?.value || 0);
  const designKw = wattsToKw(metrics.designCooling);
  const designTr = wattsToTr(metrics.designCooling);
  const sfPerTr = designTr > 0 ? (values.floorArea * M2_TO_FT2) / designTr : 0;
  setGlobalSummary(caseId, `${designKw.toFixed(2)} kW | ${designTr.toFixed(2)} TR`, `SF/TR: ${sfPerTr.toFixed(1)}`);

  const envelopeWm2 = metrics.envelopeTotalSens / Math.max(values.floorArea, 0.001);
  const internalWm2 =
    (metrics.peopleSensible +
      metrics.peopleLatent +
      metrics.lightingSensible +
      metrics.equipmentSensible +
      metrics.ventSensible +
      metrics.ventLatent) /
    Math.max(values.floorArea, 0.001);

  const waterfallComponents = [
    { label: "Windows", sensible: wattsToKw(metrics.windowTotalSens), latent: 0 },
    { label: "Walls", sensible: wattsToKw(metrics.wallSens), latent: 0 },
    { label: "Roof", sensible: wattsToKw(metrics.roofSens), latent: 0 },
    { label: "People", sensible: wattsToKw(metrics.peopleSensible), latent: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", sensible: wattsToKw(metrics.lightingSensible), latent: 0 },
    { label: "Equipment", sensible: wattsToKw(metrics.equipmentSensible), latent: 0 },
    { label: "Ventilation", sensible: wattsToKw(metrics.ventSensible), latent: wattsToKw(metrics.ventLatent) },
  ];

  const envelopeRows = [
    { label: "Windows", value: wattsToKw(metrics.windowTotalSens) },
    { label: "Walls", value: wattsToKw(metrics.wallSens) },
    { label: "Roof", value: wattsToKw(metrics.roofSens) },
    { label: "Envelope Total", value: wattsToKw(metrics.envelopeTotalSens) },
  ];

  const internalRows = [
    { label: "People Sensible", value: wattsToKw(metrics.peopleSensible) },
    { label: "People Latent", value: wattsToKw(metrics.peopleLatent) },
    { label: "Lighting", value: wattsToKw(metrics.lightingSensible) },
    { label: "Equipment", value: wattsToKw(metrics.equipmentSensible) },
    { label: "Ventilation Sensible", value: wattsToKw(metrics.ventSensible) },
    { label: "Ventilation Latent", value: wattsToKw(metrics.ventLatent) },
  ];

  target.innerHTML = `
    <h2>Case ${caseId} Results</h2>
    <div class="results-top-grid">
      <section class="kpi kpi-single">
        <p class="muted">Cooling Capacity</p>
        <p class="kpi-value">${designKw.toFixed(2)} kW <span class="sep">|</span> ${designTr.toFixed(2)} TR</p>
        <p class="muted">SF/TR: ${sfPerTr.toFixed(1)}</p>
        <p class="meta-note">City weather applied: ${cityLabel} (Cooling DB ${values.tOutCool.toFixed(1)} C, w ${values.wOut.toFixed(1)} g/kg, design ${month}/${String(hour).padStart(2, "0")}:00).</p>
        <p class="meta-note">Derived from city design day: ${monthName(month)} ${String(hour).padStart(2, "0")}:00, Irradiance Glass ${irr.toFixed(0)} W/m2.</p>
      </section>
      ${renderDonutChart(wattsToKw(metrics.totalSensible), wattsToKw(metrics.totalLatent))}
    </div>
    <div class="waterfall-full">${renderWaterfallChart(waterfallComponents)}</div>

    <h3>Component Breakdown</h3>
    <div class="break-grid">
      ${renderBreakdownCard("Envelope Loads", envelopeWm2, envelopeRows)}
      ${renderBreakdownCard("Internal Loads", internalWm2, internalRows)}
    </div>
  `;
}

function renderBoth() {
  renderCase("1");
  renderCase("2");
}

function copyCaseValues(fromCaseId, toCaseId) {
  const fromForm = qs(id("calcForm", fromCaseId));
  const toForm = qs(id("calcForm", toCaseId));
  if (!fromForm || !toForm) return;

  let sourceCityKey = "";
  let sourceSearch = "";

  const fields = fromForm.querySelectorAll("input, select");
  fields.forEach((field) => {
    const m = field.id && field.id.match(/^(.*)_([12])$/);
    if (!m || m[2] !== fromCaseId) return;
    const base = m[1];
    if (base === "citySelect") {
      sourceCityKey = field.value;
      return;
    }
    if (base === "citySearch") {
      sourceSearch = field.value;
      return;
    }
    const target = qs(id(base, toCaseId));
    if (target) target.value = field.value;
  });

  const targetSearch = qs(id("citySearch", toCaseId));
  if (targetSearch) targetSearch.value = sourceSearch;

  renderCityOptions(toCaseId);

  const targetCity = qs(id("citySelect", toCaseId));
  if (targetCity && sourceCityKey) {
    const hasOption = Array.from(targetCity.options).some((opt) => opt.value === sourceCityKey);
    if (hasOption) {
      targetCity.value = sourceCityKey;
      applyWeatherProfile(toCaseId, sourceCityKey);
      return;
    }
  }

  updateSolarIrr(toCaseId);
  renderCase(toCaseId);
}

function applyWeatherProfile(caseId, key) {
  const profile = indiaProfiles.find((p) => p.key === key);
  if (!profile) return;
  setNum("tOutCool", caseId, profile.tOutCool);
  setNum("wOut", caseId, profile.wOut);
  if (profile.designMonth) setNum("solarMonth", caseId, profile.designMonth);
  if (profile.designHour) setNum("solarHour", caseId, profile.designHour);
  updateSolarIrr(caseId);
  renderCase(caseId);
}

function renderCityOptions(caseId) {
  const searchInput = qs(id("citySearch", caseId));
  const select = qs(id("citySelect", caseId));
  if (!select) return;

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const previous = select.value;
  const filtered = indiaProfiles.filter((p) => !searchTerm || p.searchText.includes(searchTerm));

  select.innerHTML = "";
  if (!filtered.length) {
    select.innerHTML = '<option value="">No matching cities</option>';
    select.disabled = true;
    renderError(caseId, "No city matches current search.");
    return;
  }

  for (const profile of filtered) {
    const option = document.createElement("option");
    option.value = profile.key;
    option.textContent = profile.label;
    select.appendChild(option);
  }

  select.disabled = false;
  const keep = filtered.some((p) => p.key === previous);
  select.value = keep ? previous : filtered[0].key;
  applyWeatherProfile(caseId, select.value);
}

async function loadIndiaDesignConditions() {
  try {
    const response = await fetch(INDIA_DESIGN_CSV, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter((ln) => ln.trim().length > 0);
    if (lines.length < 2) throw new Error("CSV has no data rows");

    const header = parseCsvLine(lines[0]);
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    const byKey = new Map();

    for (let i = 1; i < lines.length; i += 1) {
      const cols = parseCsvLine(lines[i]);
      const city = cols[idx.city] || "";
      const region = cols[idx.region] || "";
      const station = cols[idx.station_id] || "";
      const key = `${city}|${region}|${station}`.trim();
      if (!key) continue;

      const row = {
        key,
        label: [city, region].filter(Boolean).join(", ") + (station ? ` (${station})` : ""),
        searchText: `${city} ${region} ${station}`.toLowerCase(),
        stationId: station,
        tOutCool: Number(cols[idx.t_out_cool_c]),
        wOut: Number(cols[idx.w_out_g_per_kg]),
        designMonth: Number(cols[idx.design_month] || 5),
        designHour: Number(cols[idx.design_hour] || 14),
        zipUrl: cols[idx.zip_url] || "",
      };

      const prev = byKey.get(key);
      if (!prev || row.zipUrl.includes("2009-2023")) {
        byKey.set(key, row);
      }
    }

    indiaProfiles.splice(0, indiaProfiles.length, ...Array.from(byKey.values()).sort((a, b) => a.label.localeCompare(b.label)));
    ["1", "2"].forEach((caseId) => {
      renderCityOptions(caseId);
      const select = qs(id("citySelect", caseId));
      const defaultProfile = indiaProfiles.find((p) => p.stationId === DEFAULT_CITY_STATION_ID);
      if (select && defaultProfile) {
        select.value = defaultProfile.key;
        applyWeatherProfile(caseId, defaultProfile.key);
      }
    });
  } catch (err) {
    ["1", "2"].forEach((caseId) => {
      const select = qs(id("citySelect", caseId));
      if (select) {
        select.innerHTML = '<option value="">No city data available</option>';
        select.disabled = true;
      }
      renderError(caseId, `Could not load local India design-condition CSV: ${err.message}`);
    });
  }
}

if (hasDom) {
  runSplashScreen();

  const hasCalculatorCases = Boolean(qs("calcForm_1")) && Boolean(qs("calcForm_2"));
  if (hasCalculatorCases) {
    ["1", "2"].forEach((caseId) => {
      const form = qs(id("calcForm", caseId));
      const searchInput = qs(id("citySearch", caseId));
      const select = qs(id("citySelect", caseId));
      const occupancy = qs(id("occupancy", caseId));

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          renderCase(caseId);
        });
        form.addEventListener("input", () => renderCase(caseId));
      }

      if (searchInput) {
        searchInput.addEventListener("input", () => renderCityOptions(caseId));
      }

      if (select) {
        select.addEventListener("change", (e) => applyWeatherProfile(caseId, e.target.value));
      }

      if (occupancy) {
        occupancy.addEventListener("change", () => applyOccupancyDefaults(caseId));
        applyOccupancyDefaults(caseId);
      }

      const solarOri = qs(id("solarOri", caseId));
      [solarOri].forEach((el) => {
        if (el) {
          el.addEventListener("change", () => {
            updateSolarIrr(caseId);
            renderCase(caseId);
          });
        }
      });
    });

    loadIndiaDesignConditions();
    updateSolarIrr("1");
    updateSolarIrr("2");
    renderBoth();

    const copy12 = qs("copy_1_to_2");
    const copy21 = qs("copy_2_to_1");
    if (copy12) copy12.addEventListener("click", () => copyCaseValues("1", "2"));
    if (copy21) copy21.addEventListener("click", () => copyCaseValues("2", "1"));
  }

  initCoolingLoadGame();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    computeLoads,
    validateInputs,
  };
}
