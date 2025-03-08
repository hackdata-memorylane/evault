import Block from "./block.js";
import { environ, getBlockValueFromParameter } from "../utils.js";
import { configDotenv } from "dotenv";

export class Chain {
    blocks: BlockInterface[] = [];
    pattern: string;
    secure = true;

    onBlockAdd?: (block: BlockInterface) => void 

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    addBlock(block: BlockInterface): boolean {
        if (!this.secure)
            return false;

        if (!block.verify(this.pattern))
            return false;

        this.blocks.push(block);

        if (this.onBlockAdd)
            this.onBlockAdd(block);
        return true;
    }

    search(param: SearchableParameters, value: string): BlockInterface[] {
        return this.blocks.filter(block => getBlockValueFromParameter(param, block) === value);
    }

    fillChain(blocks: EditableBlockInterface[]): void {
        blocks.forEach(block => {
            const newBlock = new Block(block.data.constructordata);
            newBlock.data.autodata = block.data.autodata;
            newBlock.data.nonce = block.data.nonce;
            newBlock.signature = block.signature;

            this.blocks.push(newBlock);
        });
    }

    getLastBlock(): BlockInterface | undefined {
        return this.blocks[this.blocks.length - 1];
    }
}

configDotenv();
export default new Chain(environ.PATTERN);
