import { useState } from "react";
import {
  FaChartPie,
  FaCube,
  FaHammer,
  FaExchangeAlt,
  FaWallet,
  FaKey,
  FaNetworkWired,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white border-b border-slate-700 md:hidden">
        <h1 className="text-xl font-bold">🚀 ManCoin</h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl transition hover:text-blue-400 active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="bg-slate-800 p-4 text-white border-b border-slate-700 md:hidden">
          <button
            onClick={toggleTheme}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-3 transition hover:bg-slate-600 active:scale-95"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <ul className="space-y-2">
            <NavItem to="/" icon={<FaChartPie />} text="Dashboard" close={() => setIsOpen(false)} end />
            <NavItem to="/explorer" icon={<FaCube />} text="Explorer" close={() => setIsOpen(false)} />
            <NavItem to="/mine" icon={<FaHammer />} text="Mine" close={() => setIsOpen(false)} />
            <NavItem to="/transaction" icon={<FaExchangeAlt />} text="Transaction" close={() => setIsOpen(false)} />
            <NavItem to="/wallet" icon={<FaWallet />} text="Wallet" close={() => setIsOpen(false)} />
            <NavItem to="/wallet-generator" icon={<FaKey />} text="Wallet Generator" close={() => setIsOpen(false)} />
            <NavItem to="/validator" icon="🔐" text="Validator" close={() => setIsOpen(false)} />
            <NavItem to="/network" icon={<FaNetworkWired />} text="Network" close={() => setIsOpen(false)} />
            <NavItem to="/pending" icon={<FaClock />} text="Pending" close={() => setIsOpen(false)} />
          </ul>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-screen w-64 overflow-hidden bg-slate-800 p-6 text-white md:block">
        <h1 className="mb-6 text-2xl font-bold">🚀 ManCoin</h1>

        <button
          onClick={toggleTheme}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-3 transition hover:bg-slate-600 active:scale-95"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <nav>
          <ul className="space-y-3">
            <NavItem to="/" icon={<FaChartPie />} text="Dashboard" end />
            <NavItem to="/explorer" icon={<FaCube />} text="Explorer" />
            <NavItem to="/mine" icon={<FaHammer />} text="Mine" />
            <NavItem to="/transaction" icon={<FaExchangeAlt />} text="Transaction" />
            <NavItem to="/wallet" icon={<FaWallet />} text="Wallet" />
            <NavItem to="/wallet-generator" icon={<FaKey />} text="Wallet Generator" />
            <NavItem to="/validator" icon="🔐" text="Validator" />
            <NavItem to="/network" icon={<FaNetworkWired />} text="Network" />
            <NavItem to="/pending" icon={<FaClock />} text="Pending" />
          </ul>
        </nav>
      </aside>
    </>
  );
}

function NavItem({ to, icon, text, close, end = false }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={close}
        className={({ isActive }) =>
          `
            flex
            items-center
            gap-3
            rounded-lg
            px-3
            py-2
            transition-all
            duration-200
            active:scale-95
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                : "text-slate-200 hover:bg-slate-700 hover:text-blue-400"
            }
          `
        }
      >
        {icon}
        <span>{text}</span>
      </NavLink>
    </li>
  );
}

export default Sidebar;