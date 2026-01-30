const { showMessage, getNumberInput, getInput, showSuccess, showError } = require('../utils/input');
const { readJSON, writeJSON } = require('../utils/fileHandler');

const clearScreen = () => {
  console.clear();
};

/**
 * Menampilkan daftar kandidat untuk voting
 */
const showCandidates = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║      DAFTAR KANDIDAT                   ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');

  const candidates = readJSON('candidates.json');

  if (candidates.length === 0) {
    showMessage('Belum ada kandidat.');
  } else {
    candidates.forEach((candidate, index) => {
      showMessage(`${index + 1}. ${candidate.name}`);
      showMessage(`   ${candidate.description}`);
      showMessage('');
    });
  }

  getInput('Tekan Enter untuk kembali...');
};

/**
 * Voting process
 */
const voting = () => {
  clearScreen();
  showMessage('╔════════════════════════════════════════╗');
  showMessage('║      VOTING                            ║');
  showMessage('╚════════════════════════════════════════╝');
  showMessage('');

  // Autentikasi voter
  showMessage('─── Autentikasi Voter ───');
  const voterId = getInput('Masukkan ID/NIM Anda: ');
  const voterName = getInput('Masukkan Nama Anda: ');
  showMessage('');

  const voters = readJSON('voters.json');
  const voter = voters.find(v => v.voterId === voterId && v.name === voterName);

  if (!voter) {
    showError('ID/NIM atau Nama tidak ditemukan!');
    getInput('Tekan Enter untuk lanjut...');
    return;
  }

  if (voter.voted) {
    showError('Anda sudah melakukan voting sebelumnya!');
    getInput('Tekan Enter untuk lanjut...');
    return;
  }

  // Tampilkan kandidat
  const candidates = readJSON('candidates.json');

  if (candidates.length === 0) {
    showMessage('Belum ada kandidat untuk dipilih.');
    getInput('Tekan Enter untuk lanjut...');
    return;
  }

  showMessage('─── Pilih Kandidat ───');
  showMessage('');
  candidates.forEach((candidate, index) => {
    showMessage(`${index + 1}. ${candidate.name}`);
    showMessage(`   ${candidate.description}`);
    showMessage('');
  });

  const choice = getNumberInput('Pilih nomor kandidat: ');
  const candidateIndex = choice - 1;

  if (candidateIndex < 0 || candidateIndex >= candidates.length) {
    showError('Pilihan tidak valid!');
    getInput('Tekan Enter untuk lanjut...');
    return;
  }

  // Konfirmasi
  showMessage('');
  showMessage(`Anda memilih: ${candidates[candidateIndex].name}`);
  const confirm = getInput('Apakah Anda yakin? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    showMessage('Voting dibatalkan.');
    getInput('Tekan Enter untuk lanjut...');
    return;
  }

  // Update vote
  candidates[candidateIndex].votes += 1;
  voter.voted = true;

  // Simpan data
  writeJSON('candidates.json', candidates);
  writeJSON('voters.json', voters);

  // Catat voting
  const votes = readJSON('votes.json');
  votes.push({
    timestamp: new Date().toISOString(),
    voterId: voter.voterId,
    voterName: voter.name,
    candidateId: candidates[candidateIndex].id,
    candidateName: candidates[candidateIndex].name
  });
  writeJSON('votes.json', votes);

  showSuccess(`Terima kasih! Suara Anda untuk "${candidates[candidateIndex].name}" telah dicatat.`);
  getInput('Tekan Enter untuk lanjut...');
};

/**
 * Menu Voter
 */
const voterMenu = () => {
  while (true) {
    clearScreen();
    showMessage('╔════════════════════════════════════════╗');
    showMessage('║      MENU VOTER                       ║');
    showMessage('╚════════════════════════════════════════╝');
    showMessage('');
    showMessage('  1. Voting');
    showMessage('  2. Lihat Daftar Kandidat');
    showMessage('  3. Kembali ke Menu Utama');
    showMessage('');

    const choice = getNumberInput('Masukkan pilihan: ');
    showMessage('');

    switch (choice) {
      case 1:
        voting();
        break;
      case 2:
        showCandidates();
        break;
      case 3:
        return;
      default:
        showError('Pilihan tidak valid');
        getInput('Tekan Enter untuk lanjut...');
    }
  }
};

module.exports = voterMenu;
