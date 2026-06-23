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

import { Link } from "react-router-dom";

function Sidebar() {

  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <>
      {/* Mobile Header */}

      <div
        className="
          md:hidden
          flex
          items-center
          justify-between
          bg-slate-800
          p-4
          border-b
          border-slate-700
        "
      >
        <h1 className="text-xl font-bold">
          🚀 ManCoin
        </h1>

        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="
            text-2xl
            hover:text-blue-400
            transition
          "
        >
          {isOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {/* Mobile Menu */}

      {isOpen && (
        <div
          className="
            md:hidden
            bg-slate-800
            p-4
            border-b
            border-slate-700
          "
        >
          <ul className="space-y-4">
            <NavItem to="/" icon={<FaChartPie />} text="Dashboard" close={() => setIsOpen(false)} />
            <NavItem to="/explorer" icon={<FaCube />} text="Explorer" close={() => setIsOpen(false)} />
            <NavItem to="/mine" icon={<FaHammer />} text="Mine" close={() => setIsOpen(false)} />
            <NavItem to="/transaction" icon={<FaExchangeAlt />} text="Transaction" close={() => setIsOpen(false)} />
            <NavItem to="/wallet" icon={<FaWallet />} text="Wallet" close={() => setIsOpen(false)} />
            <NavItem to="/wallet-generator" icon={<FaKey />} text="Wallet Generator" close={() => setIsOpen(false)} />
            <NavItem to="/validator" icon="🔐" text="Validator" close={() => setIsOpen(false)} />
            <NavItem to="/network" icon={<FaNetworkWired />} text="Network" close={() => setIsOpen(false)} />
            <NavItem to="/pending" icon={<FaClock />} text="Pending" close={() => setIsOpen(false)} />
          </ul>
        </div>
      )}

      {/* Desktop Sidebar */}

      <div
        className="
          hidden
          md:block
          w-64
          bg-slate-800
          p-6
        "
      >
        <h1 className="text-2xl font-bold mb-10">
          🚀 ManCoin
        </h1>

        <ul className="space-y-6">
          <NavItem to="/" icon={<FaChartPie />} text="Dashboard" />
          <NavItem to="/explorer" icon={<FaCube />} text="Explorer" />
          <NavItem to="/mine" icon={<FaHammer />} text="Mine" />
          <NavItem to="/transaction" icon={<FaExchangeAlt />} text="Transaction" />
          <NavItem to="/wallet" icon={<FaWallet />} text="Wallet" />
          <NavItem to="/wallet-generator" icon={<FaKey />} text="Wallet Generator" />
          <NavItem to="/validator" icon="🔐" text="Validator" />
          <NavItem to="/network" icon={<FaNetworkWired />} text="Network" />
          <NavItem to="/pending" icon={<FaClock />} text="Pending" />
        </ul>
      </div>
    </>
  );
}

function NavItem({
  to,
  icon,
  text,
  close,
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={close}
        className="
          flex
          items-center
          gap-3
          px-3
          py-2
          rounded-lg
          hover:bg-slate-700
          hover:text-blue-400
          active:scale-95
          transition-all
          duration-200
        "
      >
        {icon}
        {text}
      </Link>
    </li>
  );
}

export default Sidebar;