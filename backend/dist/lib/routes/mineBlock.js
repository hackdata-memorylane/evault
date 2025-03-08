var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chainModel from "../../schema/chainModel.js";
import unminedQueueModel from "../../schema/unminedQueueModel.js";
import chain from "../blockchain/chain.js";
import unminedQueue from "../blockchain/unminedQueue.js";
import { environ } from "../utils.js";
export default function mineBlock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const blockToMine = unminedQueue.getUnmined();
        if (!blockToMine) {
            res.status(400).json({
                err: "No block in unmined queue",
            });
            return;
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
        yield unminedQueueModel.deleteMany({});
        unminedQueue.queue.forEach((block) => __awaiter(this, void 0, void 0, function* () {
            yield unminedQueueModel.create(block);
        }));
        yield chainModel.deleteMany({});
        chain.blocks.forEach((block) => __awaiter(this, void 0, void 0, function* () {
            yield chainModel.create(block);
        }));
        res.status(200).json({
            success: "Block mined"
        });
    });
}
