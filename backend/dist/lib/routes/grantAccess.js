var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import hospitalModel from "../../schema/hospitalModel";
import userModel from "../../schema/userModel";
export default function grantAccess(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!body.hospitalId || !body.medicalRecordIds) {
            res.status(400).json({
                err: "Missing fields"
            });
            return;
        }
        const hospital = yield hospitalModel.findOne({ uid: body.hospitalId });
        if (!hospital) {
            res.status(400).json({
                err: "Hospital not found"
            });
            return;
        }
        const user = yield userModel.findOne({ uid: body.userId });
        if (!user) {
            res.status(400).json({
                err: "User not found"
            });
            return;
        }
        if (!body.grantAccess) {
            for (let i = 0; i < hospital.openRecords.length; i++) {
                if (hospital.openRecords[i].userId === user.uid) {
                    hospital.openRecords.splice(i, 1);
                    break;
                }
            }
        }
        else {
            hospital.openRecords.push({
                userId: user.uid,
                recordIds: body.medicalRecordIds,
            });
        }
        yield hospital.save();
    });
}
