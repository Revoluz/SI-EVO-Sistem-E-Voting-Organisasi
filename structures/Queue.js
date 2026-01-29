class Queue {
    constructor(maxSize = 50) {
        this.maxSize = maxSize;
        this.data = [];
        this.enqueuedCount = 0;
        this.dequeuedCount = 0;
    }

    enqueue(vote){
        if(this.data.length >= this.maxSize){
            return false;
        }

        this.data[this.data.length] = vote;
        this.enqueuedCount++;
        return true;
        }
    
    dequeue(){
        if(this.data.length === 0){
            return null;
        }

        const value = this.data[0];

        for (let i = 1; i < this.data.length; i++) {
            this.data[i - 1] = this.data[i];
        }

        this.data.length--;
        this.dequeuedCount++;
        return value;
    }


    dequeueBatch(batchSize){
        const result = [];
        let count = 0;

        while (count < batchSize) {
            const value = this.dequeue();
            if (value === null) break;
                result[count++] = value;
        }

        return result;
    }

    peek(){
        return this.data.length === 0 ? null: this.data[0];
        
    }

    size(){
        return this.data.length;
    }

    getStats(){
        return {
            size: this.size(),
            maxSize: this.maxSize,
            enqueuedCount: this.enqueuedCount,
            dequeuedCount: this.dequeuedCount,
            availableSpace: this.maxSize - this.size()
        }
    }
}
