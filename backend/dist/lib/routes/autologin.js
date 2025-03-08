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
export default function autologin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const body = req.body;
        if (!body.sessionId) {
            res.status(400).json({
                err: "Missing fields"
            });
            return;
        }
        const user = yield userModel.findOne({ "session.id": body.sessionId });
        if (!user) {
            res.status(400).json({
                err: "Session not found"
            });
            return;
        }
        if (((_a = user.session) === null || _a === void 0 ? void 0 : _a.expires) < Date.now()) {
            res.status(400).json({
                err: "Session expired"
            });
            return;
        }
        res.status(200).json({
            success: user
        });
    });
}
