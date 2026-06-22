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
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar />

      <div className="flex-1">
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
      </div>
    </div>
  );
}

export default App;
