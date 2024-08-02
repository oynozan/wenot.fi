import { Route, Routes } from "react-router-dom";

import Earnings from "./Earnings";
import Settings from "./Settings";

import Sidebar from "../../components/Sidebar";
import HeaderDashboard from '../../components/Header/HeaderDashboard';

import { useWalletStore } from '../../lib/states';

import "./dashboard.scss";

export default function Dashboard() {
    const loading = useWalletStore(s => s.loading);

    if (loading) return <></>;

    return (
        <div id="dashboard">
            <Sidebar />
            <main>
                <HeaderDashboard />
                <div className="content">
                    <Routes>
                        <Route path="/"  element={<Earnings />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
