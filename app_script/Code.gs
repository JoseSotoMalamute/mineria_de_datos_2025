const SHEET_NAME = 'Reservas';
const HEADER = ['Fecha', 'Sala', 'Inicio', 'Fin', 'Uso', 'Responsable'];
const ROOMS = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
const TIMEZONE = 'America/Santiago';
const OPERATING_START = '08:30';
const OPERATING_END = '22:00';

function setupSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  const headerRange = sheet.getRange(1, 1, 1, HEADER.length);
  const currentValues = headerRange.getValues()[0];
  const needsHeader = HEADER.some((value, index) => currentValues[index] !== value);
  if (needsHeader) {
    headerRange.setValues([HEADER]);
  }
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ROOMS, true)
    .build();
  sheet.getRange(2, 2, sheet.getMaxRows() - 1).setDataValidation(rule);
}

function ensureSheetReady_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    setupSheet_();
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  ensureSheetReady_();
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('Gestor de Salas')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInitialData() {
  ensureSheetReady_();
  return {
    rooms: ROOMS,
    minHour: OPERATING_START,
    maxHour: OPERATING_END
  };
}

function parseDate_(dateString) {
  return Utilities.parseDate(dateString, TIMEZONE, 'yyyy-MM-dd');
}

function formatTime_(date) {
  return Utilities.formatDate(date, TIMEZONE, "HH:mm");
}

function getScheduleForDate(dateString) {
  ensureSheetReady_();
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const targetDate = parseDate_(dateString);
  const values = sheet.getDataRange().getValues();
  const data = [];
  for (let i = 1; i < values.length; i++) {
    const [fecha, sala, inicio, fin, uso, responsable] = values[i];
    if (!fecha) continue;
    const rowDate = new Date(fecha);
    if (rowDate.toDateString() === targetDate.toDateString()) {
      data.push({
        sala: sala.toString(),
        inicio: typeof inicio === 'string' ? inicio : formatTime_(new Date(inicio)),
        fin: typeof fin === 'string' ? fin : formatTime_(new Date(fin)),
        uso: uso || '',
        responsable: responsable || ''
      });
    }
  }
  return data;
}

function addBooking(booking) {
  ensureSheetReady_();
  const { date, room, startTime, endTime, usage, owner } = booking;
  if (!date || !room || !startTime || !endTime) {
    throw new Error('Todos los campos obligatorios deben estar completos.');
  }
  if (ROOMS.indexOf(room) === -1) {
    throw new Error('La sala indicada no es válida.');
  }
  const start = new Date(`${date}T${startTime}:00`);
  const end = new Date(`${date}T${endTime}:00`);
  if (start >= end) {
    throw new Error('La hora de inicio debe ser anterior a la hora de término.');
  }
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const targetDate = parseDate_(date);
  for (let i = 1; i < values.length; i++) {
    const [fecha, sala, inicio, fin] = values[i];
    if (!fecha || sala.toString() !== room) continue;
    const rowDate = new Date(fecha);
    if (rowDate.toDateString() !== targetDate.toDateString()) continue;
    const existingStart = new Date(`${date}T${typeof inicio === 'string' ? inicio : formatTime_(new Date(inicio))}:00`);
    const existingEnd = new Date(`${date}T${typeof fin === 'string' ? fin : formatTime_(new Date(fin))}:00`);
    const overlaps = start < existingEnd && end > existingStart;
    if (overlaps) {
      throw new Error(`Conflicto con la sala ${room} entre ${formatTime_(existingStart)} y ${formatTime_(existingEnd)}.`);
    }
  }
  sheet.appendRow([
    parseDate_(date),
    room,
    startTime,
    endTime,
    usage,
    owner
  ]);
  return getScheduleForDate(date);
}

function getFreeRooms(dateString) {
  ensureSheetReady_();
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const targetDate = parseDate_(dateString);
  const values = sheet.getDataRange().getValues();
  const bookingsByRoom = {};
  ROOMS.forEach(room => bookingsByRoom[room] = []);
  for (let i = 1; i < values.length; i++) {
    const [fecha, sala, inicio, fin] = values[i];
    if (!fecha) continue;
    const rowDate = new Date(fecha);
    if (rowDate.toDateString() !== targetDate.toDateString()) continue;
    const room = sala.toString();
    if (!bookingsByRoom[room]) bookingsByRoom[room] = [];
    bookingsByRoom[room].push({
      start: typeof inicio === 'string' ? inicio : formatTime_(new Date(inicio)),
      end: typeof fin === 'string' ? fin : formatTime_(new Date(fin))
    });
  }
  const freeSlots = ROOMS.map(room => {
    const bookings = bookingsByRoom[room].sort((a, b) => a.start.localeCompare(b.start));
    const available = [];
    let currentStart = OPERATING_START;
    bookings.forEach(({ start, end }) => {
      if (currentStart < start) {
        available.push({ start: currentStart, end: start });
      }
      if (end > currentStart) {
        currentStart = end;
      }
    });
    if (currentStart < OPERATING_END) {
      available.push({ start: currentStart, end: OPERATING_END });
    }
    return {
      room,
      available
    };
  });

  return freeSlots;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
