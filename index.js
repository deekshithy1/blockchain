const crypto = require("crypto");

class Block {
    constructor(index, previousHash, transactions, difficulty) {
        this.index = index;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.timestamp = Date.now();
        this.nonce = 0;
        this.hash = this.calculateHash();
        this.mineBlock(difficulty); // Mine block upon creation
    }

    // Compute SHA-256 hash
    calculateHash() {
        const data = this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.transactions);
        return crypto.createHash("sha256").update(data).digest("hex");
    }

    // Proof-of-Work: Adjust nonce until hash meets difficulty criteria
    mineBlock(difficulty) {
        const target = "0".repeat(difficulty);
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block ${this.index} mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor(difficulty = 4) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, "0", ["Genesis Block"], this.difficulty);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const newBlock = new Block(this.chain.length, this.getLatestBlock().hash, transactions, this.difficulty);
        this.chain.push(newBlock);
    }

    // Check blockchain integrity
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block ${currentBlock.index} has been tampered!`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${currentBlock.index} has an invalid previous hash!`);
                return false;
            }
        }
        return true;
    }

    printChain() {
        console.log(JSON.stringify(this.chain, null, 2));
    }
}

// Create a new blockchain
const myBlockchain = new Blockchain();

// Add blocks
myBlockchain.addBlock(["Alice -> Bob: 10 BTC"]);
myBlockchain.addBlock(["Bob -> Charlie: 5 BTC", "Charlie -> Dave: 2 BTC"]);

console.log("\nBlockchain before tampering:");
myBlockchain.printChain();

// Validate blockchain
console.log("\nIs blockchain valid?", myBlockchain.isChainValid() ? "Yes" : "No");

// Tamper with blockchain
console.log("\nTampering with blockchain...");
myBlockchain.chain[1].transactions = ["Tampered Transaction"];

console.log("\nBlockchain after tampering:");
myBlockchain.printChain();

// Validate again
console.log("\nIs blockchain valid?", myBlockchain.isChainValid() ? "Yes" : "No");
