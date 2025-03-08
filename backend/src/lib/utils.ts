import { createHash } from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

export function getBlockValueFromParameter(parameter: SearchableParameters, block: BlockInterface): string {
    switch (parameter) {
        case "uid":
            return block.data.autodata.uid;
        case "timestamp":
            return block.data.autodata.timestamp.toString();
        case "prevHash":
            return block.data.constructordata.prevHash;
        case "file":
            return block.data.constructordata.file.name;
        case "pk":
            return block.data.constructordata.pk;
        case "nextPk":
            return block.data.constructordata.nextPk;
        case "nonce":
            return block.data.nonce.toString();
        case "signature":
            return block.signature;
        case "hash":
            return block.hash;
        case "parentUid":
            return block.data.constructordata.parentUid;
        case "version":
            return block.data.constructordata.version.toString();
    }
}

export const environ = process.env as unknown as Environment;

export async function connectDb() {
    try {
        await mongoose.connect(environ.DB);
    } catch (error) {
        console.error(error);
    }
    console.log("[Connected to DB]");
}

export function expiresTimestamp() {
    // 1 hour
    return Date.now() + 1 * (1000 * 60 * 60);
}

export function sha256(data: string): string {
    const hash = createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Define the directory for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Ensure unique file names
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf/; // Only allow PDF files
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"));
        }
    },
});
