const ADMIN_EMAIL = 'jsotopezoa@gmail.com';
const ADMIN_PASSWORD = 'c081208cC$';
const TARGET_DATE_KEY = 'TARGET_DATE';
const RESULTS_KEY = 'RESULTS';
const PARTICIPANT_SHEET_NAME = 'amigo_secreto';
const IMAGE_FOLDER_PROPERTY = 'IMAGES_FOLDER_ID';
const PARTICIPANT_HEADERS = [
  'Email',
  'Nombre',
  'Gift1Title',
  'Gift1Url',
  'Gift1ImageUrl',
  'Gift1ImageId',
  'Gift2Title',
  'Gift2Url',
  'Gift2ImageUrl',
  'Gift2ImageId',
  'Gift3Title',
  'Gift3Url',
  'Gift3ImageUrl',
  'Gift3ImageId',
  'UpdatedAt'
];

function doGet() {
  const template = HtmlService.createTemplateFromFile('Index');
  template.adminEmail = ADMIN_EMAIL;
  return template
    .evaluate()
    .setTitle('Amigo Secreto');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function registerParticipant(payload) {
  if (!payload || !payload.email) {
    throw new Error('El correo es obligatorio.');
  }

  const email = payload.email.trim().toLowerCase();
  const name = (payload.name || '').trim();
  const giftOptions = (payload.gifts || [])
    .filter(function (gift) {
      return gift && gift.title;
    })
    .map(function (gift) {
      return {
        title: gift.title.trim(),
        url: (gift.url || '').trim(),
        image: gift.image || null
      };
    });

  if (giftOptions.length === 0) {
    throw new Error('Debe ingresar al menos una opción de regalo.');
  }

  const sheet = ensureParticipantSheet_();
  const existingRowInfo = findParticipantRow_(sheet, email);
  const existingRowValues = existingRowInfo
    ? getRowValues_(sheet, existingRowInfo)
    : new Array(PARTICIPANT_HEADERS.length).fill('');

  const updatedRow = buildParticipantRow_(email, name, giftOptions, existingRowValues);

  if (existingRowInfo) {
    sheet
      .getRange(existingRowInfo, 1, 1, updatedRow.length)
      .setValues([updatedRow]);
  } else {
    sheet.appendRow(updatedRow);
  }

  PropertiesService.getScriptProperties().deleteProperty(RESULTS_KEY);
  return {
    success: true,
    message: '¡Registro guardado correctamente!'
  };
}

function getCountdownConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const raw = scriptProperties.getProperty(TARGET_DATE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function setCountdownConfig(targetIso, adminCredentials) {
  enforceAdmin_(adminCredentials);
  const scriptProperties = PropertiesService.getScriptProperties();
  let value = null;

  if (targetIso) {
    const parsed = new Date(targetIso);
    if (isNaN(parsed.getTime())) {
      throw new Error('La fecha seleccionada no es válida.');
    }
    value = {
      targetIso: parsed.toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  if (value) {
    scriptProperties.setProperty(TARGET_DATE_KEY, JSON.stringify(value));
  } else {
    scriptProperties.deleteProperty(TARGET_DATE_KEY);
  }

  return {
    success: true,
    message: value ? 'Cuenta regresiva actualizada.' : 'Cuenta regresiva eliminada.'
  };
}

function validateAdmin(credentials) {
  try {
    enforceAdmin_(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

function listParticipants(adminCredentials) {
  enforceAdmin_(adminCredentials);
  return getParticipants_();
}

function runSecretSanta(adminCredentials) {
  enforceAdmin_(adminCredentials);
  const participants = getParticipants_();

  if (participants.length < 2) {
    throw new Error('Se necesitan al menos dos participantes para realizar el sorteo.');
  }

  const assignments = buildAssignments_(participants);
  const results = assignments.map(function (assignment) {
    return {
      giver: assignment.giver.email,
      receiver: assignment.receiver.email
    };
  });

  sendNotifications_(assignments);

  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(RESULTS_KEY, JSON.stringify({
    executedAt: new Date().toISOString(),
    assignments: results
  }));

  return {
    success: true,
    message: 'Sorteo realizado y notificaciones enviadas.',
    assignments: results
  };
}

function getLastResults(adminCredentials) {
  enforceAdmin_(adminCredentials);
  const scriptProperties = PropertiesService.getScriptProperties();
  const raw = scriptProperties.getProperty(RESULTS_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function getParticipants_() {
  const sheet = ensureParticipantSheet_();
  const data = sheet.getDataRange().getValues();
  if (!data || data.length <= 1) {
    return [];
  }

  return data.slice(1).reduce(function (acc, row) {
    if (!row || !row[0]) {
      return acc;
    }

    const gifts = [0, 1, 2].map(function (index) {
      const baseIndex = 2 + index * 4;
      const imageId = row[baseIndex + 3] || '';
      return {
        title: row[baseIndex] || '',
        url: row[baseIndex + 1] || '',
        imageUrl: row[baseIndex + 2] || '',
        imageId: imageId,
        driveUrl: imageId
          ? 'https://drive.google.com/file/d/' + imageId + '/view?usp=sharing'
          : ''
      };
    }).filter(function (gift) {
      return gift.title;
    });

    acc.push({
      email: (row[0] || '').toString().trim().toLowerCase(),
      name: row[1] || '',
      gifts: gifts,
      updatedAt: row[14] || ''
    });
    return acc;
  }, []);
}

function buildAssignments_(participants) {
  var givers = participants.slice();
  var receivers = participants.slice();
  shuffle_(receivers);

  for (var i = 0; i < givers.length; i++) {
    if (givers[i].email === receivers[i].email) {
      var swapIndex = (i + 1) % receivers.length;
      var temp = receivers[i];
      receivers[i] = receivers[swapIndex];
      receivers[swapIndex] = temp;
      if (givers[i].email === receivers[i].email) {
        return buildAssignments_(participants);
      }
    }
  }

  return givers.map(function (giver, index) {
    return {
      giver: giver,
      receiver: receivers[index]
    };
  });
}

function shuffle_(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function enforceAdmin_(credentials) {
  if (isValidAdminCredentials_(credentials)) {
    return true;
  }

  throw new Error('Solo el administrador puede realizar esta acción.');
}

function isValidAdminCredentials_(credentials) {
  if (!credentials) {
    return false;
  }

  var email = credentials.email || '';
  var password = credentials.password || '';

  if (!email || !password) {
    return false;
  }

  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

function sendNotifications_(assignments) {
  var subject = '¡Tu Amigo Secreto ha sido asignado!';
  assignments.forEach(function (assignment) {
    var giver = assignment.giver;
    var receiver = assignment.receiver;
    var receiverName = receiver.name || receiver.email;
    var greetingName = giver.name || giver.email;
    var giftList = receiver.gifts.map(function (gift, index) {
      var parts = ['<strong>Opción ' + (index + 1) + ':</strong> ' + gift.title];
      if (gift.url) {
        parts.push('<br><a href="' + gift.url + '">Ver detalle</a>');
      }
      if (gift.imageUrl) {
        parts.push('<br><img src="' + gift.imageUrl + '" alt="' + gift.title + '" style="max-width:280px; height:auto;" />');
      }
      return '<p>' + parts.join('') + '</p>';
    }).join('');

    var htmlBody = '<p>Hola ' + greetingName + '!</p>' +
      '<p>Te ha tocado sorprender a <strong>' + receiverName + '</strong> en el Amigo Secreto.</p>' +
      '<p>Estas son sus sugerencias de regalo (≈ $20.000):</p>' +
      giftList +
      '<p>¡Éxito con la sorpresa!</p>' +
      '<p>— Organización Amigo Secreto</p>';

    var plainBody = 'Hola ' + greetingName + '!' +
      '\n\nTe ha tocado sorprender a ' + receiverName + ' en el Amigo Secreto.' +
      '\n\nSugerencias de regalo:' +
      receiver.gifts.map(function (gift, index) {
        var line = '\n' + (index + 1) + '. ' + gift.title;
        if (gift.url) {
          line += ' - ' + gift.url;
        }
        return line;
      }).join('') +
      '\n\n¡Éxito con la sorpresa!\n— Organización Amigo Secreto';

    MailApp.sendEmail(giver.email, subject, plainBody, {
      htmlBody: htmlBody
    });
  });

  var adminAssignmentHtml = assignments.map(function (assignment) {
    var giver = assignment.giver;
    var receiver = assignment.receiver;
    return '<li><strong>' + (giver.name || giver.email) + '</strong> → ' + (receiver.name || receiver.email) + '</li>';
  }).join('');

  var adminHtml = '<p>El sorteo se ejecutó correctamente.</p><ul>' + adminAssignmentHtml + '</ul>';
  var adminPlain = 'El sorteo se ejecutó correctamente:\n' + assignments.map(function (assignment) {
    var giver = assignment.giver;
    var receiver = assignment.receiver;
    return '- ' + (giver.name || giver.email) + ' → ' + (receiver.name || receiver.email);
  }).join('\n');

  MailApp.sendEmail(ADMIN_EMAIL, 'Resumen del sorteo Amigo Secreto', adminPlain, {
    htmlBody: adminHtml
  });
}

function ensureParticipantSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('No se encontró la hoja de cálculo activa.');
  }

  let sheet = spreadsheet.getSheetByName(PARTICIPANT_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(PARTICIPANT_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, PARTICIPANT_HEADERS.length).setValues([PARTICIPANT_HEADERS]);
  } else {
    const headerRange = sheet.getRange(1, 1, 1, PARTICIPANT_HEADERS.length);
    headerRange.setValues([PARTICIPANT_HEADERS]);
  }

  if (sheet.getFrozenRows() !== 1) {
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function findParticipantRow_(sheet, email) {
  const normalizedEmail = (email || '').toString().trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowEmail = (data[i][0] || '').toString().trim().toLowerCase();
    if (rowEmail && rowEmail === normalizedEmail) {
      return i + 1;
    }
  }

  return null;
}

function getRowValues_(sheet, row) {
  const values = sheet.getRange(row, 1, 1, PARTICIPANT_HEADERS.length).getValues()[0];
  if (values.length < PARTICIPANT_HEADERS.length) {
    return values.concat(new Array(PARTICIPANT_HEADERS.length - values.length).fill(''));
  }
  return values;
}

function buildParticipantRow_(email, name, gifts, existingRowValues) {
  const row = new Array(PARTICIPANT_HEADERS.length).fill('');
  row[0] = email;
  row[1] = name;

  [0, 1, 2].forEach(function (index) {
    const gift = gifts[index];
    const baseIndex = 2 + index * 4;
    const previousUrl = existingRowValues ? existingRowValues[baseIndex + 2] : '';
    const previousId = existingRowValues ? existingRowValues[baseIndex + 3] : '';

    if (gift) {
      row[baseIndex] = gift.title;
      row[baseIndex + 1] = gift.url;

      if (gift.image && gift.image.data) {
        const saved = saveGiftImage_(gift.image, email, index + 1, previousId);
        row[baseIndex + 2] = saved.publicUrl;
        row[baseIndex + 3] = saved.fileId;
      } else {
        row[baseIndex + 2] = previousUrl;
        row[baseIndex + 3] = previousId;
      }
    } else if (existingRowValues && existingRowValues[baseIndex]) {
      row[baseIndex] = existingRowValues[baseIndex];
      row[baseIndex + 1] = existingRowValues[baseIndex + 1];
      row[baseIndex + 2] = previousUrl;
      row[baseIndex + 3] = previousId;
    }
  });

  row[14] = new Date().toISOString();
  return row;
}

function saveGiftImage_(imagePayload, email, giftIndex, existingFileId) {
  if (!imagePayload || !imagePayload.data) {
    return {
      publicUrl: '',
      fileId: ''
    };
  }

  if (existingFileId) {
    deleteFileIfExists_(existingFileId);
  }

  const folder = getOrCreateImagesFolder_();
  const mimeType = imagePayload.type || 'image/png';
  if (mimeType && mimeType.indexOf('image/') !== 0) {
    throw new Error('Solo se permiten imágenes en formato JPG o PNG.');
  }
  const estimatedSize = Math.ceil(imagePayload.data.length * 3 / 4);
  const maxBytes = 5 * 1024 * 1024;
  if (estimatedSize > maxBytes) {
    throw new Error('La imagen supera el tamaño máximo permitido (5 MB).');
  }

  let decoded;
  try {
    decoded = Utilities.base64Decode(imagePayload.data);
  } catch (error) {
    throw new Error('No se pudo procesar la imagen subida.');
  }
  const extension = mimeType.split('/')[1] || 'png';
  const fileName = sanitizeFilename_('amigo_' + email + '_opcion' + giftIndex + '.' + extension);
  const blob = Utilities.newBlob(decoded, mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const publicUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;
  return {
    publicUrl: publicUrl,
    fileId: fileId
  };
}

function getOrCreateImagesFolder_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty(IMAGE_FOLDER_PROPERTY);
  if (existingId) {
    try {
      const folder = DriveApp.getFolderById(existingId);
      return folder;
    } catch (error) {
      // continue to create folder if not found
    }
  }

  const parent = DriveApp.getRootFolder();
  const folder = parent.createFolder('Amigo Secreto - Imágenes');
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  props.setProperty(IMAGE_FOLDER_PROPERTY, folder.getId());
  return folder;
}

function deleteFileIfExists_(fileId) {
  if (!fileId) {
    return;
  }

  try {
    const file = DriveApp.getFileById(fileId);
    file.setTrashed(true);
  } catch (error) {
    // ignore failures to delete
  }
}

function sanitizeFilename_(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
