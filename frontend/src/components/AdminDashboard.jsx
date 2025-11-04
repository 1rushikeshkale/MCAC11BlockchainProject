import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { getOwner, getProvider, isMinter } from "../utils/blockchain";
import BlockchainLoader from "./BlockchainLoader";
import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [account, setAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCurrentMinter, setIsCurrentMinter] = useState(false);
  const [status, setStatus] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const toast = useToast();

  // ====== TEMPORARY DEBUG EFFECT ======
  useEffect(() => {
    console.log("DEBUG — Account:", account);
    console.log("DEBUG — isAdmin:", isAdmin);
    console.log("DEBUG — isMinter:", isCurrentMinter);
  }, [account, isAdmin, isCurrentMinter]);
  // ====================================

  useEffect(() => {
    async function checkAccess() {
      if (!account) return;
      try {
        const provider = await getProvider();
        const owner = await getOwner(provider);

        setIsAdmin(account.toLowerCase() === owner.toLowerCase());

        if (account.toLowerCase() !== owner.toLowerCase()) {
          const minter = await isMinter(account, provider);
          setIsCurrentMinter(minter);
        } else {
          setIsCurrentMinter(false);
        }
      } catch (err) {
        console.error("checkAccess error:", err);
        setIsAdmin(false);
        setIsCurrentMinter(false);
      }
    }

    checkAccess();
  }, [account]);

  async function connectWallet() {
    setIsConnecting(true);
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAccount(addr);

      const owner = await getOwner(provider);
      setIsAdmin(addr.toLowerCase() === owner.toLowerCase());

      toast.success("Wallet connected successfully");
    } catch (err) {
      console.error("connectWallet error:", err);
      setStatus("Wallet connection failed");
      toast.error("Wallet connection failed");
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 
                    dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      <Header />

      <div className="flex-1">
        {!account ? (
          // 🔐 Login screen
          <div className="min-h-screen flex flex-col items-center justify-start pt-16 p-6 space-y-8">

            {/* 🔥 Animated Heading Section */}
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg mb-3">
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
                                 bg-clip-text text-transparent">
                  Secure Blockchain Admin Access
                </span>{" "}
                <span className="inline-block animate-bounce">🔐</span>
              </h1>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Login with MetaMask to manage student certificates, credits, and blockchain records securely.
              </p>
            </div>

            {/* Admin Portal Box */}
            <div className="max-w-md w-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                              overflow-hidden border dark:border-gray-700">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 
                                p-8 text-center">
                  <div className="text-5xl mb-3">🔐</div>
                  <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                  <p className="text-indigo-100 dark:text-indigo-200 text-sm">
                    Secure blockchain certificate management
                  </p>
                </div>

                {/* Button */}
                <div className="p-6">
                  <button
                    onClick={connectWallet}
                    className="group relative w-full px-6 py-4 
                               bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 
                               text-white font-bold rounded-xl transition-all duration-300 
                               shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isConnecting ? (
                        <BlockchainLoader size={24} />
                      ) : (
                        <div className="text-2xl">🦊</div>
                      )}
                      {isConnecting ? "Connecting..." : "Connect MetaMask"}
                    </div>
                  </button>

                  {status && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 
                                    text-center mt-4 text-red-600">
                      {status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ✅ Admin Panel
          (isAdmin || isCurrentMinter) && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
                Admin Panel
              </h2>

              {/* Grid layout for 5 options now */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

                {/* ✅ Issue Certificate (NEW BOX) */}
                <Link to="/admin/issue">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl 
                                  p-6 text-white shadow-lg hover:scale-105 transform transition text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="font-bold text-xl">Issue Certificate</h3>
                    <p className="text-sm opacity-90">Create and issue new certificates</p>
                  </div>
                </Link>

                {/* ✅ Approved Credits */}
                <Link to="/admin/approved-credits">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl 
                                  p-6 text-white shadow-lg hover:scale-105 transform transition text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="font-bold text-xl">Approved Credits</h3>
                    <p className="text-sm opacity-90">View all student credits approved by University</p>
                  </div>
                </Link>

                {/* 📤 Upload Certificate */}
                <Link to="/admin/upload">
                  <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl 
                                  p-6 text-white shadow-lg hover:scale-105 transform transition text-center">
                    <div className="text-4xl mb-3">📤</div>
                    <h3 className="font-bold text-xl">Upload Certificate</h3>
                    <p className="text-sm opacity-90">Upload original PDF/Image</p>
                  </div>
                </Link>

                {/* 🔥 Burn Certificate */}
                <Link to="/admin/burn">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl 
                                  p-6 text-white shadow-lg hover:scale-105 transform transition text-center">
                    <div className="text-4xl mb-3">🔥</div>
                    <h3 className="font-bold text-xl">Burn Certificate</h3>
                    <p className="text-sm opacity-90">Remove certificates</p>
                  </div>
                </Link>

                {/* 👑 Minter Management */}
                <Link to="/admin/minters">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl 
                                  p-6 text-white shadow-lg hover:scale-105 transform transition text-center">
                    <div className="text-4xl mb-3">👑</div>
                    <h3 className="font-bold text-xl">Minter Management</h3>
                    <p className="text-sm opacity-90">Manage minter permissions</p>
                  </div>
                </Link>
              </div>
            </div>
          )
        )}
      </div>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
