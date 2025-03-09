import { Request, Response } from "express";
import hospitalModel from "../../schema/hospitalModel.js";

interface loginAdminRequest {
    hospitalId: string
    password: string
}

export default async function loginAdmin(req: Request, res: Response) {
    const body = req.body as loginAdminRequest;
    if (!body.hospitalId || !body.password) {
        res.status(400).json({
            err: "Missing fields",
        });
        return;
    }
    
    const hospital = await hospitalModel.findOne({ uid: body.hospitalId });

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
    await hospital.save();
}
