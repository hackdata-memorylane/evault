import { Request, Response } from "express";
import { sha256 } from "../utils.js";
import userModel from "../../schema/userModel.js";
import { createSign } from "crypto";
import { v4 } from "uuid";
import unminedQueue from "../blockchain/unminedQueue.js";
import Block from "../blockchain/block.js";
import { blob } from "stream/consumers";
import unminedQueueModel from "../../schema/unminedQueueModel.js";

export default async function uploadBlock(req: Request, res: Response) {
    try {
        const { details, parentRecordId, version, userId } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ err: "No file uploaded" });
            return;
        }

        const user = await userModel.findOne({ uid: userId });
        if (!user) {
            res.status(400).json({ err: "User not found" });
            return;
        }

        const fileHash = sha256(file.filename);
        const signer = createSign("rsa-sha256");
        signer.update(fileHash);
        
        const fileDetails: FileInterface = {
            name: file.filename,
            size: file.size,
            description: details,
            hash: sha256(file.filename),
            userSignedHash: signer.sign(user.keypair!.privateKey!, "hex"),
        };

        const blockPartial: EditableBlockInterface = {
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
        }
        
        const block = new Block(blockPartial.data.constructordata);
        block.data = blockPartial.data;
        block.signature = blockPartial.signature;

        unminedQueue.addToQueue(block);
        unminedQueueModel.create(block);

        res.status(200).json({
            message: "File uploaded successfully",
        });
    } catch (error) {
        console.error("Error in /uploadBlock:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

