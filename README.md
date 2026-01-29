# SI-EVO: Sistem E-Voting Organisasi

**A Monolithic E-Voting Application Built with Node.js, Express, and Custom Data Structures**

## 📋 Overview

SI-EVO is an electronic voting system designed to demonstrate the practical implementation of fundamental data structures in a real-world application:

- **AVL Tree** - Fast in-memory voter validation (O(log n) search)
- **Queue** - Buffering incoming votes before database processing
- **Stack** - Admin undo/redo functionality for session configuration
- **Linked List** - Audit trail logs of all admin actions
- **Array** - In-memory vote counting and real-time results

## 🛠️ Tech Stack

- **Runtime**: Node.js >= 16.0.0
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **View Engine**: EJS
- **Frontend**: Vanilla JavaScript (No frameworks)
- **Styling**: Custom CSS (No frameworks)

## 📁 Project Structure

```
si-evo/
├── controllers/              # Business logic controllers
├── routes/                   # Route definitions
├── structures/               # Data structure implementations
│   ├── AVLTree.js
│   ├── Queue.js
│   ├── Stack.js
│   ├── LinkedList.js
│   ├── VoteCounter.js
│   └── index.js
├── prisma/                   # Database schema
├── views/                    # EJS templates
│   ├── admin/
│   ├── voter/
│   └── partials/
├── public/                   # Static files
│   ├── css/
│   └── js/
├── workers/                  # Background jobs
├── middleware/               # Express middleware
├── server.js                 # Main application file
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 16+ installed
- MySQL 5.7+ installed and running
- npm or yarn package manager

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### 3. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE si_evo;
exit

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```
# Run dummy data
npm run seed

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run at `http://localhost:3000`
Admin will run at `http://localhost:3000/admin/dashboard`


## 📖 Available Scripts

```bash
npm start                    # Start production server
npm run dev                  # Start with nodemon (auto-reload)
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Run database migrations
npm run prisma:studio       # Open Prisma Studio GUI
```

## 🏗️ Data Structures

### AVL Tree (`structures/AVLTree.js`)
- Self-balancing binary search tree
- O(log n) search complexity
- Used for fast voter validation
- Automatic balancing on insert/delete

**Key Methods:**
```javascript
tree.insert(voterId, nikNumber, name)
tree.search(nikNumber)
tree.exists(nikNumber)
tree.delete(nikNumber)
tree.getAll()
```

### Queue (`structures/Queue.js`)
- FIFO (First-In-First-Out) data structure
- Buffers incoming votes
- Batch processing support
- Configurable max size

**Key Methods:**
```javascript
queue.enqueue(vote)
queue.dequeue()
queue.dequeueBatch(batchSize)
queue.peek()
queue.size()
queue.getStats()
```

### Stack (`structures/Stack.js`)
- LIFO (Last-In-First-Out) data structure
- Stores admin actions for undo
- Configurable max size
- History tracking

**Key Methods:**
```javascript
stack.push(action, data)
stack.pop()
stack.peek()
stack.size()
stack.getHistory()
stack.clear()
```

### Linked List (`structures/LinkedList.js`)
- Sequential node-based structure
- Efficient insertion at O(1)
- Audit trail logging
- Chronological storage

**Key Methods:**
```javascript
list.append(adminId, action)
list.getAll()
list.getByAdmin(adminId)
list.getByAction(action)
list.getRecent(limit)
list.getByDateRange(start, end)
```

### Vote Counter (`structures/VoteCounter.js`)
- Array-based vote aggregation
- O(1) access time
- Real-time result calculation
- Percentage and ranking support

**Key Methods:**
```javascript
counter.registerCandidate(id, name)
counter.addVote(candidateId)
counter.getVoteCount(candidateId)
counter.getAllVotes()
counter.getDetailedVotes()
counter.getRanking()
counter.getLeader()
```

## 🔐 Security

- Session-based authentication
- Password hashing with bcryptjs
- SQL injection prevention with Prisma
- Environment variable protection
- Role-based access control (Admin, Voter, Supervisor)

## 📚 Usage Example

```javascript
// Import structures
const { AVLTree, Queue, Stack, LinkedList, VoteCounter } = require('./structures');

// Vote Counter
const counter = new VoteCounter();
counter.registerCandidate(1, 'Candidate A');
counter.addVote(1);
console.log(counter.getTotalVotes()); // 1

// AVL Tree for voter validation
const voterTree = new AVLTree();
voterTree.insert(123, '1234567890123456', 'John Doe');
const voter = voterTree.search('1234567890123456');

// Queue for vote buffering
const voteQueue = new Queue();
voteQueue.enqueue({ voterId: 123, candidateId: 1 });
const batch = voteQueue.dequeueBatch(10);

// Audit trail
const auditTrail = new LinkedList();
auditTrail.append(1, 'OPEN_VOTING', 'Started voting session');
const logs = auditTrail.getRecent(10);

// Undo/Redo stack
const undoStack = new Stack();
undoStack.push('UPDATE_SESSION', { sessionId: 1 });
const lastAction = undoStack.pop();
```

## 📝 Database Models

- **User** - Voters, admins, supervisors
- **Vote** - Vote records with timestamp
- **Candidate** - Election candidates
- **ElectionSession** - Voting session details
- **AuditLog** - Admin action history

## 🔧 Configuration

### .env Variables

```
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/si_evo
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=si_evo
SESSION_SECRET=your-secret-key
APP_NAME=SI-EVO
APP_URL=http://localhost:3000
```

## 🧪 Testing & Credentials

### Admin Accounts
| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin1 | admin1@example.com | admin123 | Super Admin |
| superadmin | superadmin@example.com | admin123 | Super Admin |
| admin2 | admin2@example.com | admin123 | Super Admin |

**Access Admin Panel**: `http://localhost:3000/admin/login`

### Voter Accounts
All voter accounts use password: `voter123`

| Name | Email |
|------|-------|
| Ahmad Suryanto | ahmad@example.com |
| Bella Kusuma | bella@example.com |
| Chandra Wijaya | chandra@example.com |
| Dina Pratama | dina@example.com |
| Endra Santoso | endra@example.com |
| Fara Amelia | fara@example.com |
| Gita Maharani | gita@example.com |
| Hendra Kusuma | hendra@example.com |
| Indra Permana | indra@example.com |
| Jati Nurwanto | jati@example.com |

**Access Voter Page**: `http://localhost:3000/vote`
**Access Admin Panel**: `http://localhost:3000/admin/login`

### Election Session
- **Title**: Pemilihan Ketua BEM 2026
- **Status**: ACTIVE
- **Duration**: 3 hours (1 hour started, 2 hours remaining)

### Candidates
1. **Reza Gunawan** - Membangun organisasi yang inklusif
2. **Siti Nurdiana** - Menciptakan kampus yang lebih dinamis
3. **Tri Wirawan** - Mengutamakan aspirasi mahasiswa
4. **Ulfa Ramadhani** - BEM yang responsif terhadap perubahan zaman

## 📱 Features (Planned)

- [x] Data structure implementations
- [x] Basic project structure
- [x] Prisma database setup
- [ ] User authentication (Login/Register)
- [ ] Voter interface
- [ ] Voting process
- [ ] Real-time results
- [ ] Admin panel
- [ ] Audit logs viewer
- [ ] Undo/Redo functionality
- [ ] Session management
- [ ] Report generation

## 🚧 Development Roadmap

1. **Phase 1**: Project setup and data structures ✅
2. **Phase 2**: User authentication
3. **Phase 3**: Voter interface and voting logic
4. **Phase 4**: Admin panel and management
5. **Phase 5**: Testing and deployment

## 🤝 Contributing

This is a course/portfolio project. Contributions for educational purposes are welcome.

## 📄 License

MIT License

## 👤 Author

SI-EVO Development Team

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026  
**Status**: Development
