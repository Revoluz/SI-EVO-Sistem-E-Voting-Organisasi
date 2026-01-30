const { showMessage, getNumberInput, getInput, showSuccess, showError } = require('../utils/input');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const clearScreen = () => {
  console.clear();
};

/**
 * Menampilkan statistik voting
 */
const showStatistics = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║        STATISTIK VOTING                ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');

  const candidates = readJSON('candidates.json');
  const voters = readJSON('voters.json');

  if (candidates.length === 0) {
    showMessage('Belum ada kandidat.');
  } else {
    showMessage('Hasil Voting:');
    showMessage('─'.repeat(40));
    candidates.forEach((candidate, index) => {
      showMessage(`${index + 1}. ${candidate.name} - ${candidate.votes} suara`);
      showMessage(`   ${candidate.description}`);
    });
  }

  showMessage('');
  showMessage(`Total Voters: ${voters.length}`);
  showMessage(`Total Candidates: ${candidates.length}`);
  showMessage('');

  getInput('Tekan Enter untuk kembali...');
};

/**
 * Mengelola kandidat
 */
const manageCandidate = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║      KELOLA KANDIDAT                   ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');
  showMessage('  1. Tambah Kandidat');
  showMessage('  2. Lihat Semua Kandidat');
  showMessage('  3. Hapus Kandidat');
  showMessage('  4. Kembali');
  showMessage('');

  const choice = getNumberInput('Masukkan pilihan: ');
  showMessage('');

  const candidates = readJSON('candidates.json');

  switch (choice) {
    case 1: // Tambah Kandidat
      showMessage('─── Tambah Kandidat ───');
      const name = getInput('Nama kandidat: ');
      const description = getInput('Deskripsi: ');

      const newCandidate = {
        id: candidates.length + 1,
        name,
        description,
        votes: 0
      };

      candidates.push(newCandidate);
      if (writeJSON('candidates.json', candidates)) {
        showSuccess(`Kandidat "${name}" berhasil ditambahkan!`);
      } else {
        showError('Gagal menambahkan kandidat');
      }
      getInput('Tekan Enter untuk lanjut...');
      manageCandidate();
      break;

    case 2: // Lihat Semua Kandidat
      showMessage('─── Daftar Kandidat ───');
      if (candidates.length === 0) {
        showMessage('Belum ada kandidat.');
      } else {
        candidates.forEach((candidate, index) => {
          showMessage(`${index + 1}. ${candidate.name}`);
          showMessage(`   ${candidate.description}`);
        });
      }
      showMessage('');
      getInput('Tekan Enter untuk lanjut...');
      manageCandidate();
      break;

    case 3: // Hapus Kandidat
      showMessage('─── Hapus Kandidat ───');
      if (candidates.length === 0) {
        showMessage('Belum ada kandidat.');
      } else {
        candidates.forEach((candidate, index) => {
          showMessage(`${index + 1}. ${candidate.name}`);
        });
        const id = getNumberInput('Masukkan nomor kandidat yang akan dihapus: ');
        const index = id - 1;

        if (index >= 0 && index < candidates.length) {
          const deleted = candidates.splice(index, 1);
          if (writeJSON('candidates.json', candidates)) {
            showSuccess(`Kandidat "${deleted[0].name}" berhasil dihapus!`);
          } else {
            showError('Gagal menghapus kandidat');
          }
        } else {
          showError('Nomor kandidat tidak valid');
        }
      }
      showMessage('');
      getInput('Tekan Enter untuk lanjut...');
      manageCandidate();
      break;

    case 4: // Kembali
      return;

    default:
      showError('Pilihan tidak valid');
      getInput('Tekan Enter untuk lanjut...');
      manageCandidate();
  }
};

/**
 * Mengelola voter
 */
const manageVoter = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║      KELOLA VOTER                      ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');
  showMessage('  1. Tambah Voter');
  showMessage('  2. Lihat Semua Voter');
  showMessage('  3. Hapus Voter');
  showMessage('  4. Kembali');
  showMessage('');

  const choice = getNumberInput('Masukkan pilihan: ');
  showMessage('');

  const voters = readJSON('voters.json');

  switch (choice) {
    case 1: // Tambah Voter
      showMessage('─── Tambah Voter ───');
      const voterName = getInput('Nama voter: ');
      const voterId = getInput('ID/NIM: ');

      const newVoter = {
        id: voters.length + 1,
        name: voterName,
        voterId,
        voted: false
      };

      voters.push(newVoter);
      if (writeJSON('voters.json', voters)) {
        showSuccess(`Voter "${voterName}" berhasil ditambahkan!`);
      } else {
        showError('Gagal menambahkan voter');
      }
      getInput('Tekan Enter untuk lanjut...');
      manageVoter();
      break;

    case 2: // Lihat Semua Voter
      showMessage('─── Daftar Voter ───');
      if (voters.length === 0) {
        showMessage('Belum ada voter.');
      } else {
        voters.forEach((voter, index) => {
          const status = voter.voted ? '✅ Sudah voting' : '❌ Belum voting';
          showMessage(`${index + 1}. ${voter.name} (${voter.voterId}) - ${status}`);
        });
      }
      showMessage('');
      getInput('Tekan Enter untuk lanjut...');
      manageVoter();
      break;

    case 3: // Hapus Voter
      showMessage('─── Hapus Voter ───');
      if (voters.length === 0) {
        showMessage('Belum ada voter.');
      } else {
        voters.forEach((voter, index) => {
          showMessage(`${index + 1}. ${voter.name}`);
        });
        const id = getNumberInput('Masukkan nomor voter yang akan dihapus: ');
        const index = id - 1;

        if (index >= 0 && index < voters.length) {
          const deleted = voters.splice(index, 1);
          if (writeJSON('voters.json', voters)) {
            showSuccess(`Voter "${deleted[0].name}" berhasil dihapus!`);
          } else {
            showError('Gagal menghapus voter');
          }
        } else {
          showError('Nomor voter tidak valid');
        }
      }
      showMessage('');
      getInput('Tekan Enter untuk lanjut...');
      manageVoter();
      break;

    case 4: // Kembali
      return;

    default:
      showError('Pilihan tidak valid');
      getInput('Tekan Enter untuk lanjut...');
      manageVoter();
  }
};

/**
 * Reset voting
 */
const resetVoting = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║      RESET VOTING                      ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');
  showMessage('⚠️  PERINGATAN: Tindakan ini akan mereset semua voting!');
  showMessage('');

  const confirm = getInput('Apakah Anda yakin? (y/n): ');

  if (confirm.toLowerCase() === 'y') {
    const candidates = readJSON('candidates.json');
    const voters = readJSON('voters.json');

    candidates.forEach(candidate => {
      candidate.votes = 0;
    });

    voters.forEach(voter => {
      voter.voted = false;
    });

    writeJSON('candidates.json', candidates);
    writeJSON('voters.json', voters);
    writeJSON('votes.json', []);

    showSuccess('Voting berhasil direset!');
  } else {
    showMessage('Reset dibatalkan.');
  }

  showMessage('');
  getInput('Tekan Enter untuk lanjut...');
};

/**
 * Menu Admin
 */
const adminMenu = () => {
  while (true) {
    clearScreen();
    showMessage('╔════════════════════════════════════════╗');
    showMessage('║      MENU ADMIN                       ║');
    showMessage('╚════════════════════════════════════════╝');
    showMessage('');
    showMessage('  1. Kelola Kandidat');
    showMessage('  2. Kelola Voter');
    showMessage('  3. Lihat Statistik');
    showMessage('  4. Reset Voting');
    showMessage('  5. Kembali ke Menu Utama');
    showMessage('');

    const choice = getNumberInput('Masukkan pilihan: ');
    showMessage('');

    switch (choice) {
      case 1:
        manageCandidate();
        break;
      case 2:
        manageVoter();
        break;
      case 3:
        showStatistics();
        break;
      case 4:
        resetVoting();
        break;
      case 5:
        return;
      default:
        showError('Pilihan tidak valid');
        getInput('Tekan Enter untuk lanjut...');
    }
  }
};

module.exports = adminMenu;
