import { Request, Response } from "express";
import userModel from "../../schema/userModel.js";

interface autologinRequest {
    sessionId: string
}

export default async function autologin(req: Request, res: Response) {
    const body = req.body as autologinRequest;
    if (!body.sessionId) {
        res.status(400).json({
            err: "Missing fields"
        });
        return;
    }
    
    const user = await userModel.findOne({ "session.id": body.sessionId });

    if (!user) {
        res.status(400).json({
            err: "Session not found"
        });
        return;
    }

    if ((user.session?.expires as number) < Date.now()) {
        res.status(400).json({
            err: "Session expired"
        });
        return;
    }

    res.status(200).json({
        success: user
    });
}
