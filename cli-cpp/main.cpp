#include <iostream>
#include <string>
#include <cstring>
#include <algorithm>
#include <iomanip>
#include <ctime>
#include <vector>

using namespace std;

const int MAX_VOTERS = 100;
const int MAX_CANDIDATES = 4;
const int MAX_ADMINS = 3;
const int MAX_VOTES = 100;

// ==================== DATA STRUCTURES ====================

// Struct untuk Voter
struct Voter {
  int id;
  string name;
  string voterId;
  bool voted;
};

// Struct untuk Candidate
struct Candidate {
  int id;
  string name;
  string vision;
  string mission;
  int votes;
};

// Struct untuk Vote Log
struct VoteLog {
  int timestamp;
  string voterName;
  string voterId;
  int candidateId;
  string candidateName;
  VoteLog *next;
};

struct DataQueue{
  string voterName;
  string voterId;
  int candidateId;
  string candidateName;
  DataQueue *next;
};

// ==================== GLOBAL DATA ====================

// Admin Data
struct Admin {
  int id;
  string username;
  string password;
};
// ==================== INITIALIZE DATA ====================

Admin admins[MAX_ADMINS] = {
    {1, "admin", "admin123"},
    {2, "Admin", "admin123"},
    {3, "admin2", "admin123"}};
int adminCount = 3;

// Candidates Data
Candidate candidates[MAX_CANDIDATES] = {
    {1, "Reza Gunawan", "Membangun organisasi yang inklusif dan mengutamakan kesejahteraan mahasiswa", "Meningkatkan partisipasi mahasiswa, memperbaiki fasilitas kampus, dan memperkuat hubungan dengan industri", 1},
    {2, "Siti Nurdiana", "Menciptakan kampus yang lebih dinamis dan inovatif", "Mengembangkan program kegiatan, meningkatkan transparansi, dan memberdayakan mahasiswa", 0},
    {3, "Tri Wirawan", "Mengutamakan aspirasi dan kebutuhan mahasiswa dalam setiap keputusan", "Memperkuat advokasi mahasiswa, meningkatkan akses informasi, dan membangun kepercayaan", 4},
    {4, "Ulfa Ramadhani", "BEM yang responsif terhadap perubahan zaman dan kebutuhan mahasiswa", "Mengintegrasikan teknologi, meningkatkan kualitas program, dan menjadi jembatan komunikasi", 5}};
int candidateCount = 4;

// Voters Data
Voter voters[MAX_VOTERS] = {
    {1, "Reza Gunawan", "001", false},
    {2, "Yana Kristina", "002", false},
    {3, "Mustafa Karim", "003", false},
    {4, "Citra Dewi", "004", false},
    {5, "Hafidh Syaiful", "005", false},
    {6, "Qorry Mustoffa", "006", false},
    {7, "Bella Harmoni", "007", false},
    {8, "Tri Wirawan", "008", false},
    {9, "Desi Irawan", "009", false},
    {10, "Yuki Tanaka", "010", false},
    {11, "Gregorius Dedi", "011", false},
    {12, "Budi Santoso", "012", false},
    {13, "Lia Paramita", "013", false},
    {14, "Wayan Suparta", "014", false},
    {15, "Eka Putri", "015", false},
    {16, "Sandi Rahman", "016", false},
    {17, "Jefri Makabraw", "017", false},
    {18, "Ormala Pratiwi", "018", false},
    {19, "Fitri Utama", "019", false},
    {20, "Ahmad Rahman", "020", false},
    {21, "Cahya Nugroho", "021", false},
    {22, "Nadia Wijaya", "022", false},
    {23, "Zulfikar Pratama", "023", false},
    {24, "Indah Sari", "024", false},
    {25, "Vella Simanjuntak", "025", false},
    {26, "Gina Lestari", "026", false},
    {27, "Usman Efendi", "027", false},
    {28, "Maya Kusuma", "028", false},
    {29, "Putra Wijaya", "029", false},
    {30, "Xenia Hermawan", "030", false},
    {31, "Eka Wardana", "031", false},
    {32, "Karina Mustika", "032", false},
    {33, "Taufan Hidayat", "033", false},
    {34, "Dina Rahmawati", "034", false},
    {35, "Siti Nurhaliza", "035", false},
    {36, "Oki Pratama", "036", false},
    {37, "Koko Suryanto", "037", false},
    {38, "Vina Marlina", "038", false},
    {39, "Agus Setiawan", "039", false},
    {40, "Nur Azizah", "040", false},
    {41, "Isa Yulianti", "041", false},
    {42, "Fajar Pratama", "042", false},
    {43, "Laksmi Handoko", "043", false},
    {44, "Joko Supriyanto", "044", false},
    {45, "Ulfa Ramadhani", "045", false},
    {46, "Puri Handayani", "046", false},
    {47, "Haris Wijaya", "047", false},
    {48, "Rani Kusuma", "048", false},
    {49, "Widi Harjanto", "049", false},
    {50, "Zena Kusuma", "050", false}};
int voterCount = 50;

// Votes Log Data
VoteLog votesLog[MAX_VOTES];
int votesCount = 0;

// ==================== UTILITY FUNCTIONS ====================

void clearScreen()
{
  #ifdef _WIN32
    system("cls");
  #else
    system("clear");
  #endif
}

void showMessage(string msg)
{
  cout << msg << endl;
}

void showSuccess(string msg)
{
  cout << "\n✅ " << msg << "\n"
       << endl;
}

void showError(string msg)
{
  cout << "\n❌ Error: " << msg << "\n"
       << endl;
}

string getInput(string prompt)
{
  string input;
  cout << prompt;
  getline(cin, input);
  return input;
}

int getNumberInput(string prompt)
{
  string input = getInput(prompt);
  return stoi(input);
}


// void initializeVoters()
// {
//   // Data voter dengan tipe data yang sesuai
//   Voter voterData[50] = {
//       {1, "Reza Gunawan", "001", false},
//       {2, "Yana Kristina", "002", false},
//       {3, "Mustafa Karim", "003", false},
//       {4, "Citra Dewi", "004", false},
//       {5, "Hafidh Syaiful", "005", false},
//       {6, "Qorry Mustoffa", "006", false},
//       {7, "Bella Harmoni", "007", false},
//       {8, "Tri Wirawan", "008", false},
//       {9, "Desi Irawan", "009", false},
//       {10, "Yuki Tanaka", "010", false},
//       {11, "Gregorius Dedi", "011", false},
//       {12, "Budi Santoso", "012", false},
//       {13, "Lia Paramita", "013", false},
//       {14, "Wayan Suparta", "014", false},
//       {15, "Eka Putri", "015", false},
//       {16, "Sandi Rahman", "016", false},
//       {17, "Jefri Makabraw", "017", false},
//       {18, "Ormala Pratiwi", "018", false},
//       {19, "Fitri Utama", "019", false},
//       {20, "Ahmad Rahman", "020", false},
//       {21, "Cahya Nugroho", "021", false},
//       {22, "Nadia Wijaya", "022", false},
//       {23, "Zulfikar Pratama", "023", false},
//       {24, "Indah Sari", "024", false},
//       {25, "Vella Simanjuntak", "025", false},
//       {26, "Gina Lestari", "026", false},
//       {27, "Usman Efendi", "027", false},
//       {28, "Maya Kusuma", "028", false},
//       {29, "Putra Wijaya", "029", false},
//       {30, "Xenia Hermawan", "030", false},
//       {31, "Eka Wardana", "031", false},
//       {32, "Karina Mustika", "032", false},
//       {33, "Taufan Hidayat", "033", false},
//       {34, "Dina Rahmawati", "034", false},
//       {35, "Siti Nurhaliza", "035", false},
//       {36, "Oki Pratama", "036", false},
//       {37, "Koko Suryanto", "037", false},
//       {38, "Vina Marlina", "038", false},
//       {39, "Agus Setiawan", "039", false},
//       {40, "Nur Azizah", "040", false},
//       {41, "Isa Yulianti", "041", false},
//       {42, "Fajar Pratama", "042", false},
//       {43, "Laksmi Handoko", "043", false},
//       {44, "Joko Supriyanto", "044", false},
//       {45, "Ulfa Ramadhani", "045", false},
//       {46, "Puri Handayani", "046", false},
//       {47, "Haris Wijaya", "047", false},
//       {48, "Rani Kusuma", "048", false},
//       {49, "Widi Harjanto", "049", false},
//       {50, "Zena Kusuma", "050", false}};

//   for (int i = 0; i < 50; i++)
//   {
//     voters[i] = voterData[i];
//   }
//   voterCount = 50;
// }

// ==================== BST IMPLEMENTATION ====================

struct AdminBSTNode
{
  int adminId;
  string username;
  string password;
  AdminBSTNode *left;
  AdminBSTNode *right;

  AdminBSTNode(int id, string u, string p)
      : adminId(id), username(u), password(p), left(nullptr), right(nullptr) {}
};

struct VoterBSTNode
{
  int voterId;
  string name;
  string voterIdNumber;
  bool voted;
  VoterBSTNode *left;
  VoterBSTNode *right;

  VoterBSTNode(int id, string n, string vid, bool v = false)
      : voterId(id), name(n), voterIdNumber(vid), voted(v), left(nullptr), right(nullptr) {}
};

// ==================== ADMIN BST ====================

class AdminBST
{
public:
  AdminBSTNode *root;
  int size;

  AdminBST() : root(nullptr), size(0) {}

  void insert(int adminId, string username, string password)
  {
    root = _insertNode(root, adminId, username, password);
  }

private:
  AdminBSTNode *_insertNode(AdminBSTNode *node, int adminId, string username, string password)
  {
    if (node == nullptr)
    {
      size++;
      return new AdminBSTNode(adminId, username, password);
    }

    if (username < node->username)
    {
      node->left = _insertNode(node->left, adminId, username, password);
    }
    else if (username > node->username)
    {
      node->right = _insertNode(node->right, adminId, username, password);
    }
    return node;
  }

public:
  AdminBSTNode *searchNameAndPassword(string username, string password)
  {
    return _searchNameAndPasswordNode(root, username, password);
  }

private:
  AdminBSTNode *_searchNameAndPasswordNode(AdminBSTNode *node, string username, string password)
  {
    if (node == nullptr)
      return nullptr;

    if (username < node->username)
    {
      return _searchNameAndPasswordNode(node->left, username, password);
    }
    else if (username > node->username)
    {
      return _searchNameAndPasswordNode(node->right, username, password);
    }
    else
    {
      if (node->password == password)
      {
        return node;
      }
      return nullptr;
    }
  }

public:
  int getSize() { return size; }
};

// ==================== VOTER BST ====================

class VoterBST
{
public:
  VoterBSTNode *root;
  int size;

  VoterBST() : root(nullptr), size(0) {}

  void insert(int voterId, string name, string voterIdNumber, bool voted = false)
  {
    root = _insertNode(root, voterId, name, voterIdNumber, voted);
  }

private:
  VoterBSTNode *_insertNode(VoterBSTNode *node, int voterId, string name, string voterIdNumber, bool voted)
  {
    if (node == nullptr)
    {
      size++;
      return new VoterBSTNode(voterId, name, voterIdNumber, voted);
    }

    if (name < node->name)
    {
      node->left = _insertNode(node->left, voterId, name, voterIdNumber, voted);
    }
    else if (name > node->name)
    {
      node->right = _insertNode(node->right, voterId, name, voterIdNumber, voted);
    }
    return node;
  }

public:
  bool deleteNode(string name)
  {
    int oldSize = size;
    root = _deleteNode(root, name);
    return size < oldSize;
  }

private:
  VoterBSTNode *_deleteNode(VoterBSTNode *node, string name)
  {
    if (node == nullptr)
    {
      return nullptr;
    }

    if (name < node->name)
    {
      node->left = _deleteNode(node->left, name);
    }
    else if (name > node->name)
    {
      node->right = _deleteNode(node->right, name);
    }
    else
    {
      // Node found
      size--;

      // Case 1: No child or only right child
      if (node->left == nullptr)
      {
        VoterBSTNode *temp = node->right;
        delete node;
        return temp;
      }
      // Case 2: Only left child
      else if (node->right == nullptr)
      {
        VoterBSTNode *temp = node->left;
        delete node;
        return temp;
      }

      // Case 3: Two children
      // Find in-order successor (smallest in right subtree)
      VoterBSTNode *successor = node->right;
      while (successor->left != nullptr)
      {
        successor = successor->left;
      }

      // Copy successor's data to current node
      node->voterId = successor->voterId;
      node->name = successor->name;
      node->voterIdNumber = successor->voterIdNumber;
      node->voted = successor->voted;

      // Delete the successor
      node->right = _deleteNode(node->right, successor->name);
    }
    return node;
  }

public:
  VoterBSTNode *search(string name)
  {
    return _searchNode(root, name);
  }

private:
  VoterBSTNode *_searchNode(VoterBSTNode *node, string name)
  {
    if (node == nullptr)
      return nullptr;

    if (name < node->name)
    {
      return _searchNode(node->left, name);
    }
    else if (name > node->name)
    {
      return _searchNode(node->right, name);
    }
    else
    {
      return node;
    }
  }

public:
  VoterBSTNode *searchNameAndPassword(string name, string voterIdNumber)
  {
    return _searchNameAndPasswordNode(root, name, voterIdNumber);
  }

private:
  VoterBSTNode *_searchNameAndPasswordNode(VoterBSTNode *node, string name, string voterIdNumber)
  {
    if (node == nullptr)
      return nullptr;

    if (name < node->name)
    {
      return _searchNameAndPasswordNode(node->left, name, voterIdNumber);
    }
    else if (name > node->name)
    {
      return _searchNameAndPasswordNode(node->right, name, voterIdNumber);
    }
    else
    {
      if (node->voterIdNumber == voterIdNumber)
      {
        return node;
      }
      return nullptr;
    }
  }

public:
  void displayAll()
  {
    vector<VoterBSTNode*> result;
    _inOrderTraversal(root, result);

    showMessage("\n--- Daftar Voter Terurut (In-Order) ---");
    for (size_t i = 0; i < result.size(); i++)
    {
      string status = result[i]->voted ? "Sudah Voting" : "Belum Voting";
      cout << i + 1 << ". " << result[i]->name
           << " (" << result[i]->voterIdNumber << ") - " << status << endl;
    }
    cout <<"Total Voter: " << result.size() << endl;
  }

private:
  void _inOrderTraversal(VoterBSTNode *node, vector<VoterBSTNode*> &result)
  {
    if (node != nullptr)
    {
      _inOrderTraversal(node->left, result);
      result.push_back(node);
      _inOrderTraversal(node->right, result);
    }
  }
public:
  void displayVotedVoters()
  {
    vector<VoterBSTNode*> result;
    _inOrderTraversalVoted(root, result);

    showMessage("\n--- Daftar Voter yang Sudah Voting ---");
    for (size_t i = 0; i < result.size(); i++)
    {
      cout << i + 1 << ". " << result[i]->name << endl;
    }
    cout <<"Total Voter: " << result.size() << endl;
  }
private:
  void _inOrderTraversalVoted(VoterBSTNode *node, vector<VoterBSTNode*> &result)
  {
    if (node != nullptr)
    {
      _inOrderTraversalVoted(node->left, result);
      if (node->voted)
      {
        result.push_back(node);
      }
      _inOrderTraversalVoted(node->right, result);
    }
  }
public:
  void displayNotVotedVoters()
  {
    vector<VoterBSTNode*> result;
    _inOrderTraversalNotVoted(root, result);

    showMessage("\n--- Daftar Voter yang Belum Voting ---");
    for (size_t i = 0; i < result.size(); i++)
    {
      cout << i + 1 << ". " << result[i]->name << endl;
    }
    cout <<"Total Voter: " << result.size() << endl;
  }

private:
  void _inOrderTraversalNotVoted(VoterBSTNode *node, vector<VoterBSTNode*> &result)
  {
    if (node != nullptr)
    {
      _inOrderTraversalNotVoted(node->left, result);
      if (!node->voted)
      {
        result.push_back(node);
      }
      _inOrderTraversalNotVoted(node->right, result);
    }
  }
public:
  int getSize() { return size; }
};

// ================= LINKEDLIST LOG ================


class LinkedList {
  VoteLog *head;
  VoteLog *tail;

  LinkedList(){
    head = nullptr;
    tail = nullptr;
  }


  void addHistoryVoter(DataQueue data){
    VoteLog *dataNew;
    dataNew->timestamp = time(0);
    dataNew->voterName = data.voterName;
    dataNew->voterId = data.voterId;
    dataNew->candidateId = data.candidateId;
    dataNew->candidateName = data.candidateName;
    dataNew->next = nullptr;
    
    if (head == nullptr){
        head = tail = dataNew;
    } else {
      tail->next = dataNew;
      tail = dataNew;   
    }

  };

  
  void printHistory(){
    VoteLog *current = head;
    while (current != nullptr){
      cout << "Timestamp: " << current->timestamp << endl;
      cout << "Voter Name: " << current->voterName << endl;
      cout << "Voter ID: " << current->voterId << endl;
      cout << "Candidate ID: " << current->candidateId << endl;
      cout << "Candidate Name: " << current->candidateName << endl;
      cout << endl;
      current = current->next;
    }
  };

};

// ==================== ADMIN MENU ====================

bool loginAdmin(AdminBST &adminBST)
{
  clearScreen();
  showMessage("==========================================");
  showMessage("||           LOGIN ADMIN                ||");
  showMessage("==========================================");
  showMessage("");

  showMessage("📊 BST Stats - Total Admin: " + to_string(adminBST.getSize()));
  showMessage("");

  string username = getInput("Masukkan username: ");
  string password = getInput("Masukkan password: ");

  AdminBSTNode *adminNode = adminBST.searchNameAndPassword(username, password);
  if (adminNode != nullptr && adminNode->password == password)
  {
    showSuccess("Login berhasil!");
    return true;
  }
  else
  {
    showError("Username atau password salah!");
    return false;
  }
}

void showStatistics()
{
  clearScreen();
  showMessage("==========================================");
  showMessage("||       STATISTIK VOTING                ||");
  showMessage("==========================================");
  showMessage("");

  if (candidateCount == 0)
  {
    showMessage("Belum ada kandidat.");
  }
  else
  {
    showMessage("Hasil Voting:");
    showMessage("-------------------------------");
    for (int i = 0; i < candidateCount; i++)
    {
      cout << (i + 1) << ". " << candidates[i].name << " - " << candidates[i].votes << " suara" << endl;
      cout << "   " << candidates[i].mission << endl;
    }
  }

  showMessage("");
  showMessage("Total Voters: " + to_string(voterCount));
  showMessage("Total Candidates: " + to_string(candidateCount));
  showMessage("");

  getInput("Tekan Enter untuk kembali...");
}

void manageCandidate()
{
  while (true)
  {
    clearScreen();
    showMessage("==========================================");
    showMessage("||          KELOLA KANDIDAT              ||");
    showMessage("==========================================");
    showMessage("");
    showMessage("  1. Tambah Kandidat");
    showMessage("  2. Lihat Semua Kandidat");
    showMessage("  3. Hapus Kandidat");
    showMessage("  4. Kembali");
    showMessage("");

    int choice = getNumberInput("Masukkan pilihan: ");
    showMessage("");

    if (choice == 1)
    {
      showMessage("─── Tambah Kandidat ───");
      string name = getInput("Nama kandidat: ");
      string vision = getInput("Visi: ");
      string mission = getInput("Misi: ");

      if (candidateCount < MAX_CANDIDATES)
      {
        candidates[candidateCount].id = candidateCount + 1;
        candidates[candidateCount].name = name;
        candidates[candidateCount].vision = vision;
        candidates[candidateCount].mission = mission;
        candidates[candidateCount].votes = 0;
        candidateCount++;
        showSuccess("Kandidat \"" + name + "\" berhasil ditambahkan!");
      }
      else
      {
        showError("Kapasitas kandidat penuh!");
      }
      getInput("Tekan Enter untuk lanjut...");
    }
    else if (choice == 2)
    {
      showMessage("─── Daftar Kandidat ───");
      if (candidateCount == 0)
      {
        showMessage("Belum ada kandidat.");
      }
      else
      {
        for (int i = 0; i < candidateCount; i++)
        {
          cout << (i + 1) << ". " << candidates[i].name << endl;
          cout << "   Visi: " << candidates[i].vision << endl;
          cout << "   Misi: " << candidates[i].mission << endl;
        }
      }
      showMessage("");
      getInput("Tekan Enter untuk lanjut...");
    }
    else if (choice == 3)
    {
      showMessage("─── Hapus Kandidat ───");
      if (candidateCount == 0)
      {
        showMessage("Belum ada kandidat.");
      }
      else
      {
        for (int i = 0; i < candidateCount; i++)
        {
          cout << (i + 1) << ". " << candidates[i].name << endl;
        }
        int id = getNumberInput("Masukkan nomor kandidat yang akan dihapus: ");
        int index = id - 1;

        if (index >= 0 && index < candidateCount)
        {
          string deletedName = candidates[index].name;
          for (int i = index; i < candidateCount - 1; i++)
          {
            candidates[i] = candidates[i + 1];
          }
          candidateCount--;
          showSuccess("Kandidat \"" + deletedName + "\" berhasil dihapus!");
        }
        else
        {
          showError("Nomor kandidat tidak valid");
        }
      }
      showMessage("");
      getInput("Tekan Enter untuk lanjut...");
    }
    else if (choice == 4)
    {
      return;
    }
    else
    {
      showError("Pilihan tidak valid");
      getInput("Tekan Enter untuk lanjut...");
    }
  }
}

void manageVoter(VoterBST &voterBST)
{
  while (true)
  {
    clearScreen();
    showMessage("==========================================");
    showMessage("||           KELOLA VOTER                ||");
    showMessage("==========================================");
    showMessage("");
    showMessage("  1. Tambah Voter");
    showMessage("  2. Lihat Semua Voter");
    showMessage("  3. Lihat Voter yang Sudah Voting");
    showMessage("  4. Lihat Voter yang Belum Voting");
    showMessage("  5. Hapus Voter");
    showMessage("  6. Kembali");
    showMessage("");

    int choice = getNumberInput("Masukkan pilihan: ");
    showMessage("");

    if (choice == 1)
    {
      showMessage("─── Tambah Voter ───");
      string voterName = getInput("Nama voter: ");
      string voterId = getInput("ID/NIM: ");

      if (voterCount < MAX_VOTERS)
      {
        voters[voterCount].id = voterCount + 1;
        voters[voterCount].name = voterName;
        voters[voterCount].voterId = voterId;
        voters[voterCount].voted = false;
        voterCount++;
        
        // Insert ke BST
        voterBST.insert(voters[voterCount - 1].id, voters[voterCount - 1].name, 
                       voters[voterCount - 1].voterId, voters[voterCount - 1].voted);
        
        showSuccess("Voter \"" + voterName + "\" berhasil ditambahkan!");
      }
      else
      {
        showError("Kapasitas voter penuh!");
      }
      getInput("Tekan Enter untuk lanjut...");
    }
    else if (choice == 2)
    {
      showMessage("─── Daftar Voter (Sorted by Name) ───");
      voterBST.displayAll();
      getInput("\nTekan Enter untuk lanjut...");
    }
    else if (choice == 3)
    {
      showMessage("─── Daftar Voter yang Sudah Voting ───");
      voterBST.displayVotedVoters();
      getInput("\nTekan Enter untuk lanjut...");
    }
    else if (choice == 4)
    {
      showMessage("─── Daftar Voter yang Belum Voting ───");
      voterBST.displayNotVotedVoters();
      getInput("\nTekan Enter untuk lanjut...");
    }
    else if (choice == 5)
    {
      showMessage("─── Hapus Voter ───");
      if (voterCount == 0)
      {
        showMessage("Belum ada voter.");
      }
      else
      {
        for (int i = 0; i < voterCount; i++)
        {
          cout << (i + 1) << ". " << voters[i].name << endl;
        }
        int id = getNumberInput("Masukkan nomor voter yang akan dihapus: ");
        int index = id - 1;

        if (index >= 0 && index < voterCount)
        {
          string deletedName = voters[index].name;
          
          // Delete dari BST dulu
          voterBST.deleteNode(deletedName);
          
          // Hapus dari array
          for (int i = index; i < voterCount - 1; i++)
          {
            voters[i] = voters[i + 1];
          }
          voterCount--;
          showSuccess("Voter \"" + deletedName + "\" berhasil dihapus!");
        }
        else
        {
          showError("Nomor voter tidak valid");
        }
      }
      showMessage("");
      getInput("Tekan Enter untuk lanjut...");
    }
    else if (choice == 6)
    {
      return;
    }
    else
    {
      showError("Pilihan tidak valid");
      getInput("Tekan Enter untuk lanjut...");
    }
  }
}

void resetVoting()
{
  clearScreen();  
  showMessage("==========================================");
  showMessage("||           RESET VOTING                ||");
  showMessage("==========================================");
  showMessage("");
  showMessage("⚠️  PERINGATAN: Tindakan ini akan mereset semua voting!");
  showMessage("");

  string confirm = getInput("Apakah Anda yakin? (y/n): ");

  if (confirm == "y" || confirm == "Y")
  {
    for (int i = 0; i < candidateCount; i++)
    {
      candidates[i].votes = 0;
    }
    for (int i = 0; i < voterCount; i++)
    {
      voters[i].voted = false;
    }
    votesCount = 0;
    showSuccess("Voting berhasil direset!");
  }
  else
  {
    showMessage("Reset dibatalkan.");
  }

  showMessage("");
  getInput("Tekan Enter untuk lanjut...");
}

void adminMenu(AdminBST &adminBST, VoterBST &voterBST)
{
  if (!loginAdmin(adminBST))
  {
    return;
  }

  while (true)
  {
    clearScreen();
    showMessage("==========================================");
    showMessage("||            MENU ADMIN                ||");
    showMessage("==========================================");
    showMessage("");
    showMessage("  1. Kelola Kandidat");
    showMessage("  2. Kelola Voter");
    showMessage("  3. Lihat Statistik");
    showMessage("  4. Reset Voting");
    showMessage("  5. Kembali ke Menu Utama");
    showMessage("");

    int choice = getNumberInput("Masukkan pilihan: ");
    showMessage("");

    switch (choice)
    {
    case 1:
      manageCandidate();
      break;
    case 2:
      manageVoter(voterBST);
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
      showError("Pilihan tidak valid");
      getInput("Tekan Enter untuk lanjut...");
    }
  }
}

// ==================== VOTER MENU ====================

void showCandidates()
{
  clearScreen();
  showMessage("==========================================");
  showMessage("||          DAFTAR KANDIDAT             ||");
  showMessage("==========================================");
  showMessage("");

  if (candidateCount == 0)
  {
    showMessage("Belum ada kandidat.");
  }
  else
  {
    for (int i = 0; i < candidateCount; i++)
    {
      cout << (i + 1) << ". " << candidates[i].name << endl;
      cout << "Visi : " << candidates[i].vision << endl;
      cout << "Misi : " << candidates[i].mission << endl;
      showMessage("");
    }
  }

  getInput("Tekan Enter untuk kembali...");
}

void voting(VoterBST &voterBST)
{
  clearScreen();
  showMessage("==========================================");
  showMessage("||                VOTING                ||");
  showMessage("==========================================");
  showMessage("");

  showMessage("─── Autentikasi Voter ───");
  string voterId = getInput("Masukkan ID/NIM Anda: ");
  string voterName = getInput("Masukkan Nama Anda: ");
  showMessage("");

  // Cari di BST untuk validasi
  VoterBSTNode *validatedVoter = voterBST.searchNameAndPassword(voterName, voterId);
  if (validatedVoter == nullptr)
  {
    showError("ID/NIM atau Nama tidak ditemukan!");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  // Cari di array untuk update
  int voterIndex = -1;
  for (int i = 0; i < voterCount; i++)
  {
    if (voters[i].name == voterName && voters[i].voterId == voterId)
    {
      voterIndex = i;
      break;
    }
  }

  if (voterIndex == -1)
  {
    showError("Data voter tidak valid!");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  if (validatedVoter->voted)
  {
    showError("Anda sudah melakukan voting sebelumnya!");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  if (candidateCount == 0)
  {
    showMessage("Belum ada kandidat untuk dipilih.");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  showMessage("─── Pilih Kandidat ───");
  showMessage("");
  for (int i = 0; i < candidateCount; i++)
  {
    cout << (i + 1) << ". " << candidates[i].name << endl;
    cout << "Visi : " << candidates[i].vision << endl;
    cout << "Misi : " << candidates[i].mission << endl;
    showMessage("");
  }

  int choice = getNumberInput("Pilih nomor kandidat: ");
  int candidateIndex = choice - 1;

  if (candidateIndex < 0 || candidateIndex >= candidateCount)
  {
    showError("Pilihan tidak valid!");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  showMessage("");
  cout << "Anda memilih: " << candidates[candidateIndex].name << endl;
  string confirm = getInput("Apakah Anda yakin? (y/n): ");

  if (confirm != "y" && confirm != "Y")
  {
    showMessage("Voting dibatalkan.");
    getInput("Tekan Enter untuk lanjut...");
    return;
  }

  // UPDATE candidates votes
  candidates[candidateIndex].votes++;

  // UPDATE voters voted status
  voters[voterIndex].voted = true;
  validatedVoter->voted = true;

  // Catat voting
  if (votesCount < MAX_VOTES)
  {
    votesLog[votesCount].timestamp = (int)time(0);
    votesLog[votesCount].voterName = voterName;
    votesLog[votesCount].voterId = voterId;
    votesLog[votesCount].candidateId = candidates[candidateIndex].id;
    votesLog[votesCount].candidateName = candidates[candidateIndex].name;
    votesCount++;
  }

  showSuccess("Terima kasih! Suara Anda untuk \"" + candidates[candidateIndex].name + "\" telah dicatat.");
  getInput("Tekan Enter untuk lanjut...");
}

void voterMenu(VoterBST &voterBST)
{
  while (true)
  {
    clearScreen();
    showMessage("==========================================");
    showMessage("||             MENU VOTER                ||");
    showMessage("==========================================");
    showMessage("");
    showMessage("  1. Voting");
    showMessage("  2. Lihat Daftar Kandidat");
    showMessage("  3. Kembali ke Menu Utama");
    showMessage("");

    int choice = getNumberInput("Masukkan pilihan: ");
    showMessage("");

    switch (choice)
    {
    case 1:
      voting(voterBST);
      break;
    case 2:
      showCandidates();
      break;
    case 3:
      return;
    default:
      showError("Pilihan tidak valid");
      getInput("Tekan Enter untuk lanjut...");
    }
  }
}

// ==================== MAIN MENU ====================

void mainMenu(AdminBST &adminBST, VoterBST &voterBST)
{
  while (true)
  {
    clearScreen();
    showMessage("==========================================");
    showMessage("||        SISTEM E-VOTING | C++         ||");
    showMessage("==========================================");
    showMessage("");
    showMessage("Pilih role Anda:");
    showMessage("  1. Admin");
    showMessage("  2. Voter");
    showMessage("  3. Keluar");
    showMessage("");

    int choice = getNumberInput("Masukkan pilihan (1-3): ");
    showMessage("");

    switch (choice)
    {
    case 1:
      adminMenu(adminBST, voterBST);
      break;
    case 2:
      voterMenu(voterBST);
      break;
    case 3:
      showMessage("Terima kasih telah menggunakan Sistem E-Voting. Sampai jumpa!");
      return;
    default:
      showMessage("❌ Pilihan tidak valid. Silakan coba lagi.");
    }
  }
}

// ==================== MAIN ====================

int main()
{
  // Initialize voters
  // initializeVoters();

  // Initialize BST for admins
  AdminBST adminBST;
  for (int i = 0; i < adminCount; i++)
  {
    adminBST.insert(
        admins[i].id,
        admins[i].username,
        admins[i].password);
  }

  // Initialize BST for voters
  VoterBST voterBST;
  for (int i = 0; i < voterCount; i++)
  {
    voterBST.insert(
        voters[i].id,
        voters[i].name,
        voters[i].voterId,
        voters[i].voted);
  }

  // Run main menu
  mainMenu(adminBST, voterBST);

  return 0;
}