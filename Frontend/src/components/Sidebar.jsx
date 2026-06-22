import {
  FaChartPie,
  FaCube,
  FaHammer,
  FaExchangeAlt,
  FaWallet,
  FaKey,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { FaNetworkWired } from "react-icons/fa";
import { FaClock } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 p-6">
      <h1 className="text-2xl font-bold mb-10">🚀 ManCoin</h1>

      <ul className="space-y-6">
        <li>
          <Link
            to="/"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaChartPie />
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/explorer"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaCube />
            Explorer
          </Link>
        </li>

        <li>
          <Link
            to="/mine"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaHammer />
            Mine
          </Link>
        </li>

        <li>
          <Link
            to="/transaction"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaExchangeAlt />
            Transaction
          </Link>
        </li>

        <li>
          <Link
            to="/wallet"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaWallet />
            Wallet
          </Link>
        </li>

        <li>
          <Link
            to="/wallet-generator"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            <FaKey />
            Wallet Generator
          </Link>
        </li>

        <li>
          <Link
            to="/validator"
            className="
              flex
              items-center
              gap-3
              hover:text-blue-400
              transition
            "
          >
            🔐 Validator
          </Link>
        </li>

        <li>
          <Link
            to="/network"
            className="
      flex
      items-center
      gap-3
      hover:text-blue-400
      transition
    "
          >
            <FaNetworkWired />
            Network
          </Link>
        </li>

        <li>
          <Link
            to="/pending"
            className="
      flex
      items-center
      gap-3
      hover:text-blue-400
      transition
    "
          >
            <FaClock />
            Pending
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
