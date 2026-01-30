/**
 * Binary Search Tree Example untuk SI-EVO
 * Demonstrasi penggunaan BST untuk voter management
 */

const BinarySearchTree = require('../structures/BST');

// Create BST instance
const voterTree = new BinarySearchTree();

console.log('=================================');
console.log('   BINARY SEARCH TREE EXAMPLE   ');
console.log('=================================\n');

// 1. INSERT VOTERS
console.log('📝 INSERTING VOTERS...\n');

voterTree.insert(1, '1234567890123450', 'Ahmad Suryanto', 'ahmad@email.com');
console.log('✓ Inserted: Ahmad (NIK: 1234567890123450)');

voterTree.insert(2, '1234567890123425', 'Bella Kusuma', 'bella@email.com');
console.log('✓ Inserted: Bella (NIK: 1234567890123425)');

voterTree.insert(3, '1234567890123475', 'Chandra Wijaya', 'chandra@email.com');
console.log('✓ Inserted: Chandra (NIK: 1234567890123475)');

voterTree.insert(4, '1234567890123440', 'Dina Pratama', 'dina@email.com');
console.log('✓ Inserted: Dina (NIK: 1234567890123440)');

voterTree.insert(5, '1234567890123460', 'Endra Santoso', 'endra@email.com');
console.log('✓ Inserted: Endra (NIK: 1234567890123460)');

// 2. DISPLAY TREE STRUCTURE
console.log('\n🌳 TREE STRUCTURE:\n');
console.log(voterTree.toString());

// 3. SEARCH OPERATIONS
console.log('\n🔍 SEARCH OPERATIONS:\n');

const search1 = voterTree.search('1234567890123450');
console.log('Search NIK: 1234567890123450');
console.log('Result:', search1 ? `Found - ${search1.name}` : 'Not found');

const search2 = voterTree.search('1234567890123999');
console.log('\nSearch NIK: 1234567890123999');
console.log('Result:', search2 ? `Found - ${search2.name}` : 'Not found');

// 4. GET ALL VOTERS (sorted)
console.log('\n📋 ALL VOTERS (SORTED BY NIK):\n');
const allVoters = voterTree.getAll();
allVoters.forEach((voter, index) => {
  console.log(`${index + 1}. ${voter.name} (${voter.nikNumber})`);
});

// 5. TREE STATISTICS
console.log('\n📊 TREE STATISTICS:\n');
const stats = voterTree.getStats();
console.log('Total Voters:', stats.totalNodes);
console.log('Tree Height:', stats.treeHeight);

// 6. DELETE OPERATION
console.log('\n🗑️  DELETE OPERATION:\n');
console.log('Deleting: Bella (NIK: 1234567890123425)');
const deleted = voterTree.delete('1234567890123425');
console.log('Result:', deleted ? 'Successfully deleted' : 'Not found');

console.log('\nTree after deletion:');
console.log(voterTree.toString());

console.log('\nUpdated stats:');
console.log('Total Voters:', voterTree.getStats().totalNodes);

// 7. CHECK EXISTENCE
console.log('\n✅ EXISTENCE CHECK:\n');
console.log('Ahmad exists?', voterTree.exists('1234567890123450'));
console.log('Bella exists?', voterTree.exists('1234567890123425'));
console.log('Chandra exists?', voterTree.exists('1234567890123475'));