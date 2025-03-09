var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Machine } from "json-db-jdb";
import dotenv from "dotenv";
import { connectDb, environ, upload } from "./lib/utils.js";
import express from "express";
import register from "./lib/routes/register.js";
import login from "./lib/routes/login.js";
import autologin from "./lib/routes/autologin.js";
import cors from "cors";
import uploadBlock from "./lib/routes/uploadBlock.js";
import chainModel from "./schema/chainModel.js";
import Block from "./lib/blockchain/block.js";
import chain from "./lib/blockchain/chain.js";
import mineBlock from "./lib/routes/mineBlock.js";
import unminedQueueModel from "./schema/unminedQueueModel.js";
import unminedQueue from "./lib/blockchain/unminedQueue.js";
import loginAdmin from "./lib/routes/loginAdmin.js";
dotenv.config();
Machine.config = JSON.parse(environ.ENCDENC_SALT);
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
function fillChain() {
    return __awaiter(this, void 0, void 0, function* () {
        const existingChainData = yield chainModel.find().sort({ "data.autodata.timestamp": 1 });
        const existingChainBlocks = existingChainData.map((blockData) => {
            const block = new Block(blockData.data.constructordata);
            block.data = blockData.data;
            block.signature = blockData.signature;
            return block;
        });
        chain.fillChain(existingChainBlocks);
    });
}
function fillUnminedQueue() {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUnminedData = yield unminedQueueModel.find().sort({ "data.autodata.timestamp": 1 });
        const existingUnminedBlocks = existingUnminedData.map((blockData) => {
            const block = new Block(blockData.data.constructordata);
            block.data = blockData.data;
            block.signature = blockData.signature;
            return block;
        });
        unminedQueue.fillQueue(existingUnminedBlocks);
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectDb();
        fillChain();
        fillUnminedQueue();
    });
}
run();
app.post("/register", (req, res) => register(req, res));
app.post("/login", (req, res) => login(req, res));
app.post("/autologin", (req, res) => autologin(req, res));
app.post("/uploadBlock", upload.single("file"), uploadBlock);
app.post("/mineBlock", (req, res) => mineBlock(req, res));
app.post("/loginAdmin", (req, res) => loginAdmin(req, res));
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
