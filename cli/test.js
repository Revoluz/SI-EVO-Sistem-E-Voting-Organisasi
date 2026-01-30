#!/usr/bin/env node

/**
 * Test Script untuk Sistem Voting CLI
 * Script ini membantu mengecek struktur dan data aplikasi
 */

const { readJSON } = require('./src/utils/fileHandler');

console.log('\n╔════════════════════════════════════════╗');
console.log('║   TESTING SISTEM VOTING CLI            ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('📋 Data Kandidat:');
const candidates = readJSON('candidates.json');
console.log(`   Total: ${candidates.length}`);
candidates.forEach((c, i) => {
  console.log(`   ${i + 1}. ${c.name} (${c.votes} votes)`);
});

console.log('\n👥 Data Voter:');
const voters = readJSON('voters.json');
console.log(`   Total: ${voters.length}`);
voters.forEach((v, i) => {
  const status = v.voted ? '✅' : '❌';
  console.log(`   ${i + 1}. ${v.name} (${v.voterId}) ${status}`);
});

console.log('\n🗳️  Data Voting:');
const votes = readJSON('votes.json');
console.log(`   Total votes: ${votes.length}`);

console.log('\n✅ Semua module tersedia dan data dapat diakses!');
console.log('🚀 Jalankan aplikasi dengan: npm start\n');
