var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import KeyManager from "../blockchain/keyManager";
import { v4 } from "uuid";
import userModel from "../../schema/userModel";
import { expiresTimestamp, sha256 } from "../utils";
export default function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!body.username || !body.password || !body.repeatPassword) {
            res.status(400).send("Missing fields");
            return;
        }
        if (body.password !== body.repeatPassword) {
            res.status(400).send("Passwords do not match");
            return;
        }
        const existingUser = yield userModel.findOne({
            username: body.username
        });
        if (existingUser) {
            res.status(400).send("User already exists");
            return;
        }
        const user = {
            uid: v4(),
            username: body.username,
            password: sha256(body.password),
            keypair: KeyManager.generatePair(),
            session: {
                id: v4(),
                expires: expiresTimestamp(),
            }
        };
        userModel.create(user);
        res.status(200).json(user);
    });
}
