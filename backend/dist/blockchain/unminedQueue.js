import KeyManager from "./keyManager.js";
export default class UnminedQueue {
    constructor(pattern) {
        this.queue = [];
        this.pattern = pattern;
    }
    addToQueue(block) {
        KeyManager.useAndCreateNewPair(block);
        this.queue.push(block);
    }
    getUnmined() {
        return this.queue[0];
    }
    addToChain(newNonce, chain) {
        const targetBlock = this.getUnmined();
        if (!targetBlock) {
            return false;
        }
        targetBlock.data.nonce = newNonce;
        if (!targetBlock.verify(this.pattern)) {
            return false;
        }
        KeyManager.signAndDestroyPair(targetBlock);
        this.queue.shift();
        if (this.queue[0])
            this.queue[0].data.constructordata.prevHash = targetBlock.hash;
        return chain.addBlock(targetBlock);
    }
}
