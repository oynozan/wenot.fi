/**
 * Express Middlewares as functions
 */

import type { NextFunction, Request, Response } from "express";
import { verifyMessage } from "ethers";

import userDB, { type IUser } from "../db/User";

export async function verifyUser(
    req: Request & { user?: IUser },
    res: Response,
    next: NextFunction
) {
    try {
        const wallet = req?.body?.["wallet"] || req?.query?.["wallet"]; // Wallet is mandatory in almost* every request
        const signature = req.cookies?.["signature"] as string | undefined;

        if (!signature || !wallet)
            return res
                .status(403)
                .send({ message: "Please connect your wallet." });

        const signerAddress = verifyMessage(
            `Welcome to wenot.fi, ${wallet} - The Cross-Chain Payment Gateway`,
            signature
        );

        if (
            !signerAddress ||
            signerAddress.toLowerCase() !== wallet.toLowerCase()
        )
            return res
                .status(403)
                .send({ message: "Your signature is invalid" });

        // Get User
        const user = await userDB.findOne({ signature }).lean();

        if (!user)
            return res
                .status(403)
                .send({ message: "Please refresh the page." });

        // Set the user to request
        req["user"] = user;
        return next();
    } catch (e) {
        console.error(e);
        return res.status(500).send({ message: "An error occured." });
    }
}
