import { createHash } from "crypto";
import { v4 } from "uuid";
export default class Block {
    constructor(data) {
        this.signature = "";
        this.data = {
            autodata: {
                uid: v4(),
                timestamp: Date.now(),
            },
            constructordata: data,
            nonce: 0,
        };
    }
    get hash() {
        const blockStr = JSON.stringify(this.data);
        const hash = createHash('SHA256');
        hash.update(blockStr).end();
        return hash.digest('hex');
    }
    verify(pattern) {
        return this.hash.startsWith(pattern);
    }
}
