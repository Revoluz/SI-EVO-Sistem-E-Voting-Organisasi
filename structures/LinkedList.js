class Linkedlist {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(adminId, data) {
        console.log("Appending ID:", data.id);
        const newNode = { // Gunakan const
            'id': data.id,
            'admin': adminId,
            'action': data.action,
            'timestamp': data.timestamp || new Date().toISOString(),
            'timeMs': Date.parse(data.timestamp || new Date()),
            'details': data.details,
            'next': null,
            'tempNext': null // digunakan sebagai penujuk sementara sesuai action
        };

        if (this.head == null) { // Gunakan this.head
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
    }

    getAll() {
        return { startNode: this.head, total: this.length };
    }

    getByAction(action) {
        let tempHead = null;
        let tempTail = null;
        let count = 0; // ini digunakan untuk memtotal ada berapa data yang ada
        let current = this.head;

        while (current !== null) {
            if (current.action === action) {
                if (tempHead === null) { // PERBAIKAN: Jika masih kosong, isi head
                    tempHead = tempTail = current;
                } else {
                    tempTail.tempNext = current;
                    tempTail = current;
                }
                count++;
            }
            current = current.next;
        }
        if (tempTail) tempTail.tempNext = null;
        return { startNode: tempHead, total: count };
    }

    getByAdmin(adminId){
        let tempHead = null;
        let tempTail = null;
        let count = 0;
        let current = this.head;

        while (current !== null) {
            if (current.admin === adminId) {
                if (tempHead === null) {
                    tempHead = tempTail = current;
                } else {
                    tempTail.tempNext = current; 
                    tempTail = current;
                }
                count++;
            }
                current = current.next;
        }

        if (tempTail) tempTail.tempNext = null;
        return { startNode: tempHead, total: count };

    }


    getRecent(limit){
        let tempHead = null;
        let tempTail = null;
        let count = 0;
        let current = this.head;

        while (current !== null && count < limit) {
            if (tempHead === null) {
                tempHead = tempTail = current;
            } else {
                tempTail.tempNext = current; 
                tempTail = current;
            }
            count++;
            current = current.next;
        }

        if (tempTail) tempTail.tempNext = null;
        return { startNode: tempHead, total: count };
    }

    getByDateRange(startDate, endDate) {
        let tempHead = null;
        let tempTail = null;
        let count = 0;
        let current = this.head;

        const startMs = new Date(startDate).getTime();
        const endMs = new Date(endDate).setHours(23, 59, 59, 999);

        // menimpa tempNext dan membuat linkedlist sementara sesuai current.timeMs
        while (current !== null) {
            if (current.timeMs >= startMs && current.timeMs <= endMs) {
                if (tempHead === null) {
                    tempHead = tempTail = current;
                } else {
                    tempTail.tempNext = current;
                    tempTail = current;
                }
                count++;
            }
            current = current.next;
        }
        if (tempTail) tempTail.tempNext = null;
        return { startNode: tempHead, total: count };
    }
}

module.exports = Linkedlist;
