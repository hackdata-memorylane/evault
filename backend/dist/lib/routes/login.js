var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../../schema/userModel.js";
import { expiresTimestamp, sha256 } from "../utils.js";
import { v4 } from "uuid";
export default function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!body.username || !body.password) {
            res.status(400).json({
                err: "Missing fields",
            });
            return;
        }
        const user = yield userModel.findOne({ username: body.username });
        if (!user) {
            res.status(400).json({
                err: "User does not exist",
            });
            return;
        }
        if (user.password !== sha256(body.password)) {
            res.status(400).json({
                err: "Incorrect password",
            });
            return;
        }
        user.session = {
            id: v4(),
            expires: expiresTimestamp(),
        };
        res.status(200).json({
            success: user
        });
        yield user.save();
    });
}
