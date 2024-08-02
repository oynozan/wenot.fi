import { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";

import { GoGear } from "react-icons/go";
import { SlLogout } from "react-icons/sl";
import { BsGraphUp } from "react-icons/bs";

import { F } from "../../lib/helpers";

import "./sidebar.scss";

export default function Sidebar() {
    const location = useLocation();

    const [active, setActive] = useState("/");

    async function logout() {
        await F({
            endpoint: "/auth/logout",
            method: "GET",
        });

        window.location.href = "/";
    }

    useEffect(() => {
        if (location.pathname.startsWith("/dashboard/settings")) setActive("settings")
        else setActive("/");
    }, [location.pathname])

    return (
        <div className="sidebar">
            <img src="/logo.png" alt="wenot.fi Logo" />

            <div className="links">
                <Link to="/dashboard/" className={active === "/" ? "active" : undefined}>
                    <BsGraphUp /> Earnings
                </Link>
                <Link to="/dashboard/settings" className={active === "settings" ? "active" : undefined}>
                    <GoGear /> Settings
                </Link>
            </div>

            <div className="actions">
                <button className="blank" onClick={logout}>
                    <SlLogout /> Log out
                </button>
            </div>
        </div>
    );
}
