var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import unminedQueue from "../blockchain/unminedQueue";
import unminedQueueModel from "../../schema/unminedQueueModel";
import chain from "../blockchain/chain";
import chainModel from "../../schema/chainModel";
export default function updateNonce(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
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
        yield unminedQueueModel.deleteMany({});
        unminedQueue.queue.forEach((block) => __awaiter(this, void 0, void 0, function* () {
            yield unminedQueueModel.create(block);
        }));
        yield chainModel.deleteMany({});
        chain.blocks.forEach((block) => __awaiter(this, void 0, void 0, function* () {
            yield chainModel.create(block);
        }));
        res.status(200).json({
            success: "Nonce updated"
        });
    });
}
