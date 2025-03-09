import { getEl, Machine } from "json-db-jdb";
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
import hospitalModel from "./schema/hospitalModel.js";
import { v4 } from "uuid";
import loginAdmin from "./lib/routes/loginAdmin.js";

dotenv.config();

Machine.config = JSON.parse(environ.ENCDENC_SALT) as number[];

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

async function fillChain() {
    // increasing order of timestamp
    const existingChainData = await chainModel.find().sort({ "data.autodata.timestamp": 1 });
    const existingChainBlocks: Block[] = existingChainData.map((blockData) => {
        const block = new Block(blockData.data!.constructordata! as any)
        block.data = blockData.data! as any;
        block.signature = blockData.signature as any;
        return block;
    });
    chain.fillChain(existingChainBlocks);
}

async function fillUnminedQueue() {
    const existingUnminedData = await unminedQueueModel.find().sort({ "data.autodata.timestamp": 1 });
    const existingUnminedBlocks: Block[] = existingUnminedData.map((blockData) => {
        const block = new Block(blockData.data!.constructordata! as any)
        block.data = blockData.data! as any;
        block.signature = blockData.signature as any;
        return block;
    });
    unminedQueue.fillQueue(existingUnminedBlocks);
}


async function run() {
    await connectDb();
    fillChain();
    fillUnminedQueue();
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

