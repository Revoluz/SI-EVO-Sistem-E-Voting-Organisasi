const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

/**
 * Membaca file JSON
 * @param {string} filename - Nama file
 * @returns {object|array} Data dari file
 */
const readJSON = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

/**
 * Menulis ke file JSON
 * @param {string} filename - Nama file
 * @param {object|array} data - Data yang akan ditulis
 */
const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
    return false;
  }
};

module.exports = {
  readJSON,
  writeJSON
};
