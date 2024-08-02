import { useEffect, useState } from "react";

import { useUserStore } from "../../../lib/states";

import "./settings.scss";
import { F } from "../../../lib/helpers";
import { BsChevronDown } from "react-icons/bs";
import Selection from "../../../components/Selection";

export default function Settings() {
    const user = useUserStore(s => s.user);

    const [assets, setAssets] = useState<any[]>([]);
    const [networks, setNetworks] = useState<string[]>([]);

    const [swapProtocol, setSwapProtocol] = useState("Chainflip");
    const [redirectURL, setRedirectURL] = useState("");
    const [targetAsset, setTargetAsset] = useState<any>({
        chain: "ETH",
        chainId: "1",
        ticker: "ETH",
        identifier: "ETH.ETH",
        decimals: 18,
        logoURI: "https://storage.googleapis.com/token-list-swapkit-dev/images/eth.eth.png",
    });
    const [targetNetwork, setTargetNetwork] = useState("ETH");

    const [networkSelection, setNetworkSelection] = useState(false);
    const [assetSelection, setAssetSelection] = useState(false);
    const [swapSelection, setSwapSelection] = useState(false);

    useEffect(() => {
        (async () => {
            const availableNetworks = await F({
                endpoint: "/payment/available-networks",
                method: "GET",
            });

            setNetworks(Object.keys(availableNetworks.networks));
        })();
    }, []);

    useEffect(() => {
        if (!targetNetwork) return;

        (async () => {
            const availableAssets = await F({
                endpoint: "/payment/available-assets?network=" + targetNetwork,
                method: "GET",
            });

            setAssets(availableAssets.assets);
        })();
    }, [targetNetwork]);

    function handleNetworkChange(e: any) {
        setTargetNetwork(e.target.innerText);
        setTargetAsset({});
    }
    function handleAssetChange(e: any, index: number) {
        setTargetAsset(assets[index]);
    }
    function handleSwapChange(e: any) {
        setSwapProtocol(e.target.innerText);
        setTargetNetwork("ETH");
        setTargetAsset({});
    }

    return (
        <div id="settings">
            <div>
                <h5>Redirect URL</h5>
                <p>Users will be redirected to this address after a successful payment.</p>

                <div className="actions">
                    <input
                        defaultValue={user?.settings?.redirectURL ?? undefined}
                        onChange={e => setRedirectURL(e.target.value)}
                    />
                    <button className="dark" disabled={!redirectURL}>
                        Save
                    </button>
                </div>
            </div>

            <div>
                <h5>Swap Protocol</h5>
                <p>Choose a swap protocol. Each protocol support various networks and assets.</p>

                <div className="selection-container">
                    <button
                        onClick={() => {
                            setSwapSelection(true);
                            setNetworkSelection(false);
                            setAssetSelection(false);
                        }}
                    >
                        <b>{swapProtocol}</b>
                        <BsChevronDown className="down-arrow" size={14} />
                    </button>
                    <div>
                        <Selection
                            visible={swapSelection}
                            setVisible={setSwapSelection}
                            items={["Chainflip", "SwapKit"]}
                            click={handleSwapChange}
                            active={swapProtocol}
                            position="left"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h5>Target Network</h5>
                <p>Which network you want to receive your assets?</p>

                <div className="selection-container">
                    <button
                        onClick={() => {
                            setNetworkSelection(true);
                            setAssetSelection(false);
                            setSwapSelection(false);
                        }}
                    >
                        <b>{targetNetwork}</b>
                        <BsChevronDown className="down-arrow" size={14} />
                    </button>
                    <div>
                        <Selection
                            visible={networkSelection}
                            setVisible={setNetworkSelection}
                            items={networks}
                            click={handleNetworkChange}
                            active={targetNetwork}
                            position="left"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h5>Target Asset</h5>
                <p>What is your preferred crypto asset to receive your payments?</p>

                <div className="selection-container">
                    <button
                        onClick={() => {
                            setAssetSelection(true);
                            setNetworkSelection(false);
                            setSwapSelection(false);
                        }}
                    >
                        {targetAsset?.identifier ? (
                            <>
                            <img
                                src={targetAsset.logoURI}
                                alt={targetAsset.identifier}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src="/images/not-found.svg";
                                }}
                            />
                            <b>{targetAsset.ticker}</b>
                            </>
                        ) : (
                            <span>Select an Asset</span>
                        )}
                        <BsChevronDown className="down-arrow" size={14} />
                    </button>
                    <div>
                        <Selection
                            visible={assetSelection}
                            setVisible={setAssetSelection}
                            items={assets.map(asset => asset.ticker)}
                            click={handleAssetChange}
                            active={targetAsset?.identifier}
                            position="left"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
