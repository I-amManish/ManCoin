import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      <Sidebar />

      <div className="flex-1">
        <Dashboard />
      </div>

    </div>
  );
}

export default App;