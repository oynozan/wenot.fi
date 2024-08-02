import { z } from "zod";
import { type Request, type Response, Router } from "express";

import userDB from "../db/User";
import type { UserRequest } from ".";
import { verifyUser } from "../funcs/middleware";

const router = Router();

router.post("/update/network", verifyUser, async (req: UserRequest, res: Response) => {
        try {
            const { network } = req.body;
            if (!network) return res.status(400).send({ error: "Invalid network" });

            // Check if network is valid
            const Payment = await import("./payment.js");
            console.log(Payment.Chain.networks);

            userDB.updateOne(
                { signature: req.user!.signature },
                {
                    "settings.network": network,
                    "settings.asset": null,
                }
            );
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                message: "An error occured",
            });
        }
    }
);

export default router;
