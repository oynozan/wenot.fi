/**
 * Global state management
 */

import { create } from "zustand";
import type { IWallet } from './wallet';
import type { Networks } from './networks';

export type TNetwork = (typeof Networks)[number];

interface IWalletStore {
    loading: boolean;
    wallet: string | null;
    handler: IWallet | null;
    setWallet: (w: string) => void;
    setHandler: (h: IWallet) => void;
    setLoading: (l: boolean) => void;
}

export const useWalletStore = create<IWalletStore>(set => ({
    loading: true,
    wallet: null,
    handler: null,
    setWallet: wallet => set(() => ({ wallet })),
    setHandler: handler => set(() => ({ handler })),
    setLoading: loading => set(() => ({ loading })),
}));

interface IUser {
    settings: {
        asset: string;
        network: TNetwork;
        redirectURL: string;
        addFeeAsExtraPayment: boolean;
    }
}

interface IUserStore {
    user: IUser | null;
    network: TNetwork | null;
    setUser: (user: IUser | null) => void;
    setNetwork: (network: TNetwork) => void;
}

export const useUserStore = create<IUserStore>(set => ({
    user: null,
    network: null,
    setUser: user => set(() => ({ user })),
    setNetwork: network => set(() => ({ network })),
}));
