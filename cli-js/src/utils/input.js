const prompt = require('prompt-sync')();

/**
 * Mendapatkan input dari user
 * @param {string} message - Pesan yang akan ditampilkan
 * @returns {string} Input dari user
 */
const getInput = (message) => {
  return prompt(message);
};

/**
 * Mendapatkan pilihan numerik dari user
 * @param {string} message - Pesan yang akan ditampilkan
 * @returns {number} Pilihan dari user
 */
const getNumberInput = (message) => {
  const input = prompt(message);
  return parseInt(input, 10);
};

/**
 * Menampilkan pesan
 * @param {string} message - Pesan yang akan ditampilkan
 */
const showMessage = (message) => {
  console.log(message);
};

/**
 * Menampilkan error
 * @param {string} error - Error message
 */
const showError = (error) => {
  console.error(`\n❌ Error: ${error}\n`);
};

/**
 * Menampilkan success message
 * @param {string} message - Success message
 */
const showSuccess = (message) => {
  console.log(`\n✅ ${message}\n`);
};

module.exports = {
  getInput,
  getNumberInput,
  showMessage,
  showError,
  showSuccess
};
