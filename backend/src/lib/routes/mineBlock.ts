import { Request, Response } from "express";
import chainModel from "../../schema/chainModel.js";
import unminedQueueModel from "../../schema/unminedQueueModel.js";
import chain from "../blockchain/chain.js";
import unminedQueue from "../blockchain/unminedQueue.js";
import { environ } from "../utils.js";

export default async function mineBlock(req: Request, res: Response) {
    const blockToMine = unminedQueue.getUnmined();
    if (!blockToMine) {
        res.status(400).json({
            err: "No block in unmined queue",
        });
        return
    }
    let nonce = 0;
    while (true) {
        blockToMine.data.nonce = nonce;
        if (blockToMine.hash.startsWith(environ.PATTERN)) {
            break;
        }
        nonce++;
    }
    
    console.log(unminedQueue.queue);
    console.log(unminedQueue.consumeBlockToChain(nonce));
    console.log(unminedQueue.queue);
    await unminedQueueModel.deleteMany({});
    unminedQueue.queue.forEach(async (block) => {
        await unminedQueueModel.create(block);
    });

    await chainModel.deleteMany({});
    chain.blocks.forEach(async (block) => {
        await chainModel.create(block);
    });
       
    res.status(200).json({
        success: "Block mined"
    })
}
