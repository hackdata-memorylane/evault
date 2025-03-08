import { Request, Response } from "express";
import userModel from "../../schema/userModel.js";
import { expiresTimestamp, sha256 } from "../utils.js";
import { v4 } from "uuid";

interface loginRequest {
    username: string
    password: string
}

export default async function login(req: Request, res: Response) {
    const body = req.body as loginRequest;
    if (!body.username || !body.password) {
        res.status(400).json({
            err: "Missing fields",
        });
        return;
    }
    
    const user = await userModel.findOne({ username: body.username });

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
    }

    res.status(200).json({
        success: user
    });
    await user.save();
}
