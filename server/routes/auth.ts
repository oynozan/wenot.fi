import { z } from "zod";
import { verifyMessage } from "ethers";
import { type Request, type Response, Router } from "express";

import userDB from "../db/User";
import type { UserRequest } from ".";
import { verifyUser } from "../funcs/middleware";

const router = Router();

// Zod Schemas
const SignatureInput = z.object({
    wallet: z.string(),
    message: z.string(),
    signature: z.string(),
});
type ISignatureInput = z.infer<typeof SignatureInput>;

router.post("/validate-signature", async (req: Request, res: Response) => {
    try {
        const signatureInput: ISignatureInput = req.body;
        if (!SignatureInput.safeParse(signatureInput).success) {
            return res.status(400).send({
                message: "Invalid signature",
            });
        }

        const signerAddress = verifyMessage(
            `Welcome to wenot.fi, ${signatureInput.wallet} - The Cross-Chain Payment Gateway`,
            signatureInput.signature
        );

        if (
            !signerAddress ||
            signerAddress.toLowerCase() !== signatureInput.wallet.toLowerCase()
        )
            return res.status(400).send({
                message: "Signature cannot be validated, please try again",
            });

        // Check if user exists
        let user: any = await userDB
            .find({ signature: signatureInput.signature })
            .lean();

        if (!user?.length) {
            console.log("New user:", signatureInput.wallet);

            // Register the user
            const newUser = new userDB({
                wallet: signatureInput.wallet,
                signature: signatureInput.signature,
                registrationDate: Date.now(),
            });

            user = await newUser.save();
        }

        // Set signature as cookie
        res.cookie("signature", signatureInput.signature, {
            maxAge: 24 * 60 * 60 * 1000 * 90,
            httpOnly: true,
        });

        delete user._id;
        return res.send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "An error occured",
        });
    }
});

router.get("/", verifyUser, (req: UserRequest, res: Response) => {
    if (!req?.user)
        return res.status(403).send({ message: "Please connect your wallet." });

    const user: any = { ...req.user };
    delete user._id

    return res.send({ user });
});

router.get("/logout", (req: Request, res: Response) => {
    res.clearCookie("signature");
    return res.send({});
})

export default router;
