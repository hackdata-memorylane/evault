import { Request, Response } from "express";
import KeyManager from "../blockchain/keyManager.js";
import { v4 } from "uuid";
import userModel from "../../schema/userModel.js";
import { expiresTimestamp, sha256 } from "../utils.js";

interface SignupRequest {
    username: string
    password: string
    repeatPassword: string
}

export default async function register(req: Request, res: Response) {
    const body = req.body as SignupRequest;
    
    if (!body.username || !body.password || !body.repeatPassword) {
        res.status(400).send({
            err: "Missing fields"
        });
        return;
    }

    if (body.password !== body.repeatPassword) {
        res.status(400).send({
            err: "Passwords do not match"
        });
        return;
    }

    const existingUser = await userModel.findOne({ 
        username: body.username
    });

    if (existingUser) {
        res.status(400).send({
            err: "User already exists"
        });
        return
    }

    const user: User = {
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
    res.status(200).json({
        success: user
    });
}
