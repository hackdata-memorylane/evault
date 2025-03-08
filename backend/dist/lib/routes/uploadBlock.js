var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sha256 } from "../utils.js";
import userModel from "../../schema/userModel.js";
import { createSign } from "crypto";
import { v4 } from "uuid";
import unminedQueue from "../blockchain/unminedQueue.js";
import Block from "../blockchain/block.js";
import unminedQueueModel from "../../schema/unminedQueueModel.js";
export default function uploadBlock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { details, parentRecordId, version, userId } = req.body;
            const file = req.file;
            if (!file) {
                res.status(400).json({ err: "No file uploaded" });
                return;
            }
            const user = yield userModel.findOne({ uid: userId });
            if (!user) {
                res.status(400).json({ err: "User not found" });
                return;
            }
            const fileHash = sha256(file.filename);
            const signer = createSign("rsa-sha256");
            signer.update(fileHash);
            const fileDetails = {
                name: file.filename,
                size: file.size,
                description: details,
                hash: sha256(file.filename),
                userSignedHash: signer.sign(user.keypair.privateKey, "hex"),
            };
            const blockPartial = {
                data: {
                    autodata: {
                        uid: v4(),
                        timestamp: Date.now(),
                    },
                    constructordata: {
                        prevHash: "",
                        parentUid: parentRecordId,
                        file: fileDetails,
                        pk: "",
                        nextPk: "",
                        version: version,
                    },
                    nonce: 0,
                },
                signature: "",
            };
            const block = new Block(blockPartial.data.constructordata);
            block.data = blockPartial.data;
            block.signature = blockPartial.signature;
            unminedQueue.addToQueue(block);
            unminedQueueModel.create(block);
            res.status(200).json({
                message: "File uploaded successfully",
            });
        }
        catch (error) {
            console.error("Error in /uploadBlock:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
