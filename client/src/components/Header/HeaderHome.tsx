import { Link } from 'react-router-dom';

import ConnectButton from '../Connect/ConnectButton';

import './header.scss';

export default function HeaderHome() {
    return (
        <header className="header-home">
            <h1>
                <img src="/logo.png" alt="Logo" />
            </h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/">Usage</Link>
                <Link to="/">Tech</Link>
                <Link to="/">FAQ</Link>
            </div>
            <ConnectButton />
        </header>
    )
}