import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Validator from "./pages/Validator";
import Dashboard from "./pages/Dashboard";
import Explorer from "./pages/Explorer";
import Mine from "./pages/Mine";
import Transaction from "./pages/Transaction";
import Wallet from "./pages/Wallet";
import WalletGenerator from "./pages/WalletGenerator";
import Network from "./pages/Network";
import PendingTransactions from "./pages/PendingTransactions";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="min-h-screen md:ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet-generator" element={<WalletGenerator />} />
          <Route path="/validator" element={<Validator />} />
          <Route path="/network" element={<Network />} />
          <Route path="/pending" element={<PendingTransactions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;