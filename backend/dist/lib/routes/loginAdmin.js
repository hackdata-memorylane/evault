var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import hospitalModel from "../../schema/hospitalModel.js";
export default function loginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!body.hospitalId || !body.password) {
            res.status(400).json({
                err: "Missing fields",
            });
            return;
        }
        const hospital = yield hospitalModel.findOne({ uid: body.hospitalId });
        if (!hospital) {
            res.status(400).json({
                err: "Hospital does not exist",
            });
            return;
        }
        if (hospital.password !== body.password) {
            res.status(400).json({
                err: "Incorrect password",
            });
            return;
        }
        res.status(200).json({
            success: hospital
        });
        yield hospital.save();
    });
}
