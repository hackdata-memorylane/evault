var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createHash } from "crypto";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
export function getBlockValueFromParameter(parameter, block) {
    var _a;
    switch (parameter) {
        case "uid":
            return block.data.autodata.uid;
        case "timestamp":
            return block.data.autodata.timestamp.toString();
        case "prevHash":
            return block.data.constructordata.prevHash;
        case "med.patient.id":
            return block.data.constructordata.medicalRecord.patient.id;
        case "med.patient.name":
            return block.data.constructordata.medicalRecord.patient.name;
        case "med.patient.age":
            return block.data.constructordata.medicalRecord.patient.age.toString();
        case "med.doctor.name":
            return block.data.constructordata.medicalRecord.doctor.name;
        case "med.hospital.name":
            return block.data.constructordata.medicalRecord.hospital.name;
        case "med.hospital.id":
            return block.data.constructordata.medicalRecord.hospital.id;
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
        case "accessTo":
            return (_a = block.data.constructordata.medicalRecord.accessTo.hospitalId) !== null && _a !== void 0 ? _a : "null";
    }
}
export const environ = process.env;
export function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose.connect(environ.DB);
        }
        catch (error) {
            console.error(error);
        }
        console.log("[Connected to DB]");
    });
}
export function expiresTimestamp() {
    return Date.now() + 1 * (1000 * 60 * 60);
}
export function sha256(data) {
    const hash = createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are allowed!"));
        }
    },
});
