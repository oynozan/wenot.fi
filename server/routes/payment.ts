import cors from "cors";
import axios from "axios";
import { Chains } from "@chainflip/sdk/swap";
import { type Request, type Response, Router } from "express";

import userDB from "../db/User";
import paymentDB from "../db/Payment";

interface IChainInfo {
    networks: any[],
    assets: any,
}

const ChainInfo: IChainInfo = {
    networks: [],
    assets: {}
}

const router = Router();

async function getAvailableChains() {
    // Get available networks
    const result = await axios.get('https://api.thorswap.net/aggregator/chains');
    if (!result?.data) return [];
    return result.data;
}

// Generates a payment link
router.put("/", cors({ origin: "*" }), async (req: Request, res: Response) => {
    try {
        const { wallet, amount } = req.body;
        if (!wallet) return res.status(400).send({ error: "Invalid wallet" });
        if (!amount) return res.status(400).send({ error: "Invalid amount" });

        // Get user associated with the wallet
        const user = await userDB.findOne({ wallet: wallet.toLowerCase() });
        if (!user)
            return res.status(400).send({
                error: "Be sure there's an account registered with this wallet address",
            });

        // Check if there are mandatory payment data
        if (
            !user?.settings?.asset ||
            !user?.settings?.network ||
            !user?.settings?.redirectURL
        )
            return res.status(400).send({
                error: "Be sure asset, network, and a redirect URL is set on your account's dashboard",
            });

        // Generate a blank payment link record
        const newPayment = new paymentDB({
            to: wallet.toLowerCase(),
            amount,
            creationDate: Date.now(),
            status: "creating",
        });

        const paymentInfo = newPayment.save();

        return res.send({
            payment: paymentInfo,
            redirectTo: process.env.CLIENT_URL,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "An error occured",
        });
    }
});

router.get("/available-networks", async (req: Request, res: Response) => {
    try {
        // Cached response
        if (ChainInfo.networks.length) return res.send({ networks: ChainInfo.networks });

        ChainInfo.networks = await getAvailableChains();
        return res.send({ networks: ChainInfo.networks });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ networks: [] });
    }
});

router.get("/available-assets", async (req: Request, res: Response) => {
    console.log(Chains)

    try {
        let { network } = req?.query;
        if (!network) return res.send({ assets: [] });
        if (!ChainInfo.networks.length) ChainInfo.networks = await getAvailableChains();

        network = network.toString();

        // Cached response
        if (ChainInfo.assets[network]) return res.send({ assets: ChainInfo.assets[network] });

        const TokenList = await import("@swapkit/tokens");
        const availableAssets: Array<any> = [];
        const identifiers: string[] = [];

        for (let list of Object.values(TokenList)) {
            for (let asset of list.tokens) {
                if (asset.chain !== network) break;

                if (identifiers.includes(asset.identifier)) break;
                identifiers.push(asset.identifier);

                availableAssets.push(asset);
            }
        }

        ChainInfo.assets[network] = availableAssets;
        return res.send({ assets: availableAssets });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ networks: [] });
    }
})

export default router;
export const Chain = ChainInfo;