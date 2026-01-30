const { showMessage, getNumberInput } = require('../utils/input');
const adminMenu = require('./adminMenu');
const voterMenu = require('./voterMenu');

const clearScreen = () => {
  console.clear();
};

/**
 * Tampilan menu utama
 */
const mainMenu = () => {
  while (true) {
    clearScreen();
    showMessage('╔════════════════════════════════════════╗');
    showMessage('║   SISTEM E-VOTING ORGANISASI - CLI    ║');
    showMessage('╚════════════════════════════════════════╝');
    showMessage('');
    showMessage('Pilih role Anda:');
    showMessage('  1. Admin');
    showMessage('  2. Voter');
    showMessage('  3. Keluar');
    showMessage('');

    const choice = getNumberInput('Masukkan pilihan (1-3): ');
    showMessage('');

    switch (choice) {
      case 1:
        adminMenu();
        break;
      case 2:
        voterMenu();
        break;
      case 3:
        showMessage('Terima kasih telah menggunakan Sistem E-Voting. Sampai jumpa!');
        process.exit(0);
        break;
      default:
        showMessage('❌ Pilihan tidak valid. Silakan coba lagi.');
        setTimeout(() => {}, 1000);
    }
  }
};

module.exports = mainMenu;
