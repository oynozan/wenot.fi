import { useEffect, useState } from "react";

import { F } from "../../lib/helpers";
import { Wallet } from "../../lib/wallet";
import { useUserStore, useWalletStore } from "../../lib/states";
import toast from "react-hot-toast";

export default function Connect() {
    const wallet = useWalletStore(s => s.wallet);
    const setUser = useUserStore(s => s.setUser);
    const handler = useWalletStore(s => s.handler);
    const setWallet = useWalletStore(s => s.setWallet);
    const setHandler = useWalletStore(s => s.setHandler);
    const setLoading = useWalletStore(s => s.setLoading);

    const [readyToConnect, setReadyToConnect] = useState(false);
    const [retryUserLogin, setRetryUserLogin] = useState(false);

    useEffect(() => {
        try {
            const walletHandler = new Wallet();
            setHandler(walletHandler);
            setLoading(true);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!handler) return;

        const finalize = () => {
            clearInterval(interval);
        };

        const interval = setInterval(async () => {
            try {
                const accounts = await handler.accounts();
                if (accounts) setReadyToConnect(true);
                else setLoading(false);
            } catch (e) {
                console.error(e);
                setLoading(false);
            }

            finalize();
        }, 500);
    }, [handler]);

    useEffect(() => {
        if (!readyToConnect) return;

        (async () => {
            let wallet_ = await handler!.connect();
            if (!wallet_) return;

            setWallet(wallet_);
        })();
    }, [readyToConnect]);

    useEffect(() => {
        if (wallet && handler) {
            const handleUser = async (): Promise<any> => {
                try {
                    setLoading(true);

                    const user = await F({
                        endpoint: "/auth/?wallet=" + wallet,
                        method: "GET",
                    });

                    // User is logged in
                    if (user) setUser(user);
                } catch (e) {
                    // Even tho there's a connected wallet, user is not signed in
                    setUser(null);

                    // Ask for signing
                    let signature,
                        message = `Welcome to wenot.fi, ${wallet} - The Cross-Chain Payment Gateway`;
                    try {
                        signature = await handler.signMessage(message);
                        if (!signature) return toast.error("You have to sign the message in order to sign in");
                    } catch (e) {
                        return toast.error("You have to sign the message in order to sign in");
                    }

                    console.log(signature);

                    // Validate signature
                    const validated = await F({
                        endpoint: "/auth/validate-signature",
                        method: "POST",
                        body: {
                            wallet,
                            signature,
                            message,
                        },
                    });

                    if (validated) setRetryUserLogin(s => !s);
                    else toast.error("Your signature cannot be validated, please try again");
                }
            };

            (async () => {
                await handleUser();
                setLoading(false);
            })();
        }
    }, [wallet, retryUserLogin]);

    return null;
}
