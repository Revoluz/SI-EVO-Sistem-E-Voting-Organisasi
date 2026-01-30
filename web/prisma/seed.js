const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clear existing data
  console.log('📋 Clearing existing data...');
  await prisma.vote.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.electionSession.deleteMany();
  await prisma.voter.deleteMany();
  await prisma.admin.deleteMany();

  // Create Admin Users
  console.log('👨‍💼 Creating admin users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admins = await Promise.all([
    prisma.admin.create({
      data: {
        username: 'admin1',
        email: 'admin1@example.com',
        password: adminPassword,
        isSuper: true,
      },
    }),
    prisma.admin.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: adminPassword,
        isSuper: true,
      },
    }),
    prisma.admin.create({
      data: {
        username: 'admin2',
        email: 'admin2@example.com',
        password: adminPassword,
        isSuper: true,
      },
    }),
  ]);
  console.log(`✓ Created ${admins.length} admin users\n`);

  // Create Voters
  console.log('🗳️ Creating test voters...');
  const voterPassword = await bcrypt.hash('voter123', 10);
  const voters = await Promise.all([
    prisma.voter.create({
      data: {
        name: 'Ahmad Suryanto',
        email: 'ahmad@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Bella Kusuma',
        email: 'bella@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Chandra Wijaya',
        email: 'chandra@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Dina Pratama',
        email: 'dina@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Endra Santoso',
        email: 'endra@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Fara Amelia',
        email: 'fara@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Gita Maharani',
        email: 'gita@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Hendra Kusuma',
        email: 'hendra@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Indra Permana',
        email: 'indra@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
    prisma.voter.create({
      data: {
        name: 'Jati Nurwanto',
        email: 'jati@example.com',
        password: voterPassword,
        hasVoted: false,
      },
    }),
  ]);
  console.log(`✓ Created ${voters.length} voters\n`);

  // Create Election Session
  console.log('📅 Creating election session...');
  const now = new Date();
  const startTime = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
  const endTime = new Date(now.getTime() + 1000 * 60 * 60 * 2); // 2 hours from now

  const electionSession = await prisma.electionSession.create({
    data: {
      title: 'Pemilihan Ketua BEM 2026',
      startTime,
      endTime,
      status: 'ACTIVE',
    },
  });
  console.log(`✓ Created election session: "${electionSession.title}"\n`);

  // Create Candidates
  console.log('🎯 Creating candidates...');
  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        name: 'Reza Gunawan',
        vision:
          'Membangun organisasi yang inklusif dan mengutamakan kesejahteraan mahasiswa',
        mission:
          'Meningkatkan partisipasi mahasiswa, memperbaiki fasilitas kampus, dan memperkuat hubungan dengan industri',
        electionSessionId: electionSession.id,
      },
    }),
    prisma.candidate.create({
      data: {
        name: 'Siti Nurdiana',
        vision: 'Menciptakan kampus yang lebih dinamis dan inovatif',
        mission:
          'Mengembangkan program kegiatan, meningkatkan transparansi, dan memberdayakan mahasiswa',
        electionSessionId: electionSession.id,
      },
    }),
    prisma.candidate.create({
      data: {
        name: 'Tri Wirawan',
        vision: 'Mengutamakan aspirasi dan kebutuhan mahasiswa dalam setiap keputusan',
        mission:
          'Memperkuat advokasi mahasiswa, meningkatkan akses informasi, dan membangun kepercayaan',
        electionSessionId: electionSession.id,
      },
    }),
    prisma.candidate.create({
      data: {
        name: 'Ulfa Ramadhani',
        vision: 'BEM yang responsif terhadap perubahan zaman dan kebutuhan mahasiswa',
        mission:
          'Mengintegrasikan teknologi, meningkatkan kualitas program, dan menjadi jembatan komunikasi',
        electionSessionId: electionSession.id,
      },
    }),
  ]);
  console.log(`✓ Created ${candidates.length} candidates\n`);

  // // Create some test Votes
  // console.log('✅ Creating test votes...');
  // const votes = await Promise.all([
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[0].id,
  //       candidateId: candidates[0].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[1].id,
  //       candidateId: candidates[1].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[2].id,
  //       candidateId: candidates[0].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[3].id,
  //       candidateId: candidates[2].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[4].id,
  //       candidateId: candidates[0].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  //   prisma.vote.create({
  //     data: {
  //       voterId: voters[5].id,
  //       candidateId: candidates[3].id,
  //       electionSessionId: electionSession.id,
  //     },
  //   }),
  // ]);
  // console.log(`✓ Created ${votes.length} test votes\n`);

  // // Update voter hasVoted flags
  // console.log('📝 Updating voter status...');
  // await Promise.all([
  //   prisma.voter.update({
  //     where: { id: voters[0].id },
  //     data: { hasVoted: true },
  //   }),
  //   prisma.voter.update({
  //     where: { id: voters[1].id },
  //     data: { hasVoted: true },
  //   }),
  //   prisma.voter.update({
  //     where: { id: voters[2].id },
  //     data: { hasVoted: true },
  //   }),
  //   prisma.voter.update({
  //     where: { id: voters[3].id },
  //     data: { hasVoted: true },
  //   }),
  //   prisma.voter.update({
  //     where: { id: voters[4].id },
  //     data: { hasVoted: true },
  //   }),
  //   prisma.voter.update({
  //     where: { id: voters[5].id },
  //     data: { hasVoted: true },
  //   }),
  // ]);
  // console.log(`✓ Updated voter voting status\n`);

  // Create Audit Logs
  console.log('📋 Creating audit logs...');
  await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'START_SESSION',
        details: JSON.stringify({
          sessionId: electionSession.id,
          sessionTitle: electionSession.title,
          timestamp: new Date().toISOString(),
        }),
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'CANDIDATE_ADDED',
        details: JSON.stringify({
          candidateName: candidates[0].name,
          sessionId: electionSession.id,
          timestamp: new Date().toISOString(),
        }),
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'LOGIN',
        details: JSON.stringify({
          voterId: voters[0].id,
          email: voters[0].email,
          timestamp: new Date().toISOString(),
        }),
      },
    }),
  ]);
  console.log(`✓ Created audit logs\n`);

  console.log('✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Admin users: ${admins.length}`);
  console.log(`   - Voters: ${voters.length}`);
  console.log(`   - Candidates: ${candidates.length}`);
  // console.log(`   - Votes: ${votes.length}`);
  console.log(`   - Election Sessions: 1\n`);

  console.log('🔑 Login Credentials for Testing:');
  console.log('   Admin:');
  console.log('     Username: admin1 / superadmin');
  console.log('     Password: admin123\n');
  console.log('   Voters:');
  console.log('     Email: ahmad@example.com, bella@example.com, etc.');
  console.log('     Password: voter123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
