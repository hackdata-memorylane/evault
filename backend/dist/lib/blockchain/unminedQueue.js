import { configDotenv } from "dotenv";
import { environ, getBlockValueFromParameter } from "../utils.js";
import Block from "./block.js";
import chain from "./chain.js";
import KeyManager from "./keyManager.js";
export class UnminedQueue {
    constructor(pattern) {
        this.queue = [];
        this.pattern = pattern;
    }
    addToQueue(block, userPublicKey) {
        var _a;
        if (this.queue.length === 0) {
            block.data.constructordata.prevHash = ((_a = chain.getLastBlock()) === null || _a === void 0 ? void 0 : _a.hash) || "";
        }
        KeyManager.useAndCreateNewPair(block);
        this.queue.push(block);
        return "success";
    }
    getUnmined() {
        return this.queue[0];
    }
    consumeBlockToChain(newNonce) {
        const targetBlock = this.getUnmined();
        if (!targetBlock) {
            return false;
        }
        targetBlock.data.nonce = newNonce;
        if (!targetBlock.verify(this.pattern)) {
            console.log("Block verification failed ", this.pattern, environ.PATTERN);
            return false;
        }
        KeyManager.signAndDestroyPair(targetBlock);
        this.queue.shift();
        if (this.queue[0])
            this.queue[0].data.constructordata.prevHash = targetBlock.hash;
        return chain.addBlock(targetBlock);
    }
    fillQueue(blocks) {
        blocks.forEach(block => {
            const newBlock = new Block(block.data.constructordata);
            newBlock.data.autodata = block.data.autodata;
            newBlock.data.nonce = block.data.nonce;
            newBlock.signature = block.signature;
            this.queue.push(newBlock);
        });
    }
    search(param, value) {
        return this.queue.filter(block => getBlockValueFromParameter(param, block) === value);
    }
}
configDotenv();
export default new UnminedQueue(environ.PATTERN);
