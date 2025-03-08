import { Request, Response } from "express"
import unminedQueue, { UnminedQueue } from "../blockchain/unminedQueue";
import unminedQueueModel from "../../schema/unminedQueueModel";
import chain from "../blockchain/chain";
import chainModel from "../../schema/chainModel";

interface UpdateNonceRequest {
    nonce: number
}

export default async function updateNonce(req: Request, res: Response) {
    const body = req.body as UpdateNonceRequest;
    if (!body.nonce) {
        res.status(400).json({
            err: "Missing fields",
        });
        return;
    }

    const block = unminedQueue.getUnmined();
    if (!block) {
        res.status(400).json({
            err: "No block in unmined queue",
        });
        return;
    }

    if (!unminedQueue.consumeBlockToChain(body.nonce)) {
        res.status(400).json({
            err: "Nonce not valid",
        });
        return;
    }

    await unminedQueueModel.deleteMany({});
    unminedQueue.queue.forEach(async (block) => {
        await unminedQueueModel.create(block);
    });

    await chainModel.deleteMany({});
    chain.blocks.forEach(async (block) => {
        await chainModel.create(block);
    });
       
    res.status(200).json({
        success: "Nonce updated"
    })
}
