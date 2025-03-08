import { Request, Response } from "express";
import hospitalModel from "../../schema/hospitalModel";
import userModel from "../../schema/userModel";

interface grantAccessRequest {
    hospitalId: string
    medicalRecordIds: string[]
    userId: string,
    grantAccess: boolean
}

export default async function grantAccess(req: Request, res: Response) {
    const body = req.body as grantAccessRequest;
    if (!body.hospitalId || !body.medicalRecordIds) {
        res.status(400).json({
            err: "Missing fields"
        });
        return;
    }

    const hospital = await hospitalModel.findOne({ uid: body.hospitalId });
    if (!hospital) {
        res.status(400).json({
            err: "Hospital not found"
        });
        return;
    }
    
    const user = await userModel.findOne({ uid: body.userId });
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
    } else {
        hospital.openRecords.push({
            userId: user.uid,
            recordIds: body.medicalRecordIds,
        });
    }

    await hospital.save();
}
  
