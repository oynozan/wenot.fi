import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import { useWalletStore } from '../../lib/states';
import { truncateWalletAddress } from '../../lib/helpers';

import './header.scss';

export default function HeaderDashboard() {
    const location = useLocation();

    const wallet = useWalletStore(s => s.wallet);

    const [active, setActive] = useState("Earnings");

    useEffect(() => {
        if (location.pathname.startsWith("/dashboard/settings")) setActive("Settings")
        else setActive("Earnings");
    }, [location.pathname])

    if (!wallet) return <></>;

    return (
        <header className="header-dashboard">
            <h2>{active}</h2>
            <span>{truncateWalletAddress(wallet)}</span>
        </header>
    )
}