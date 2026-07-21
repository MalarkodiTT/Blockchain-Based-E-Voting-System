const crypto = require('crypto');

class Block {
    constructor(index, timestamp, voteData, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.voteData = voteData; // { voterId, candidateId }
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.voteData))
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "2026-01-01", { voterId: "Genesis", candidateId: "None" }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newVoteData) {
        const prevBlock = this.getLatestBlock();
        const newBlock = new Block(
            prevBlock.index + 1,
            new Date().toISOString(),
            newVoteData,
            prevBlock.hash
        );
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;