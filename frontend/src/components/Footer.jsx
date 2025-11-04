export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white py-10 mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Project Description */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-800/20 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/10">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
            🔐 A Blockchain-Based Academic Certificate Verification and Credit Transfer System
Designed for University-Level Credit Management
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-4xl mx-auto">
            A next-generation decentralized system ensuring transparent, tamper-proof,
            and verifiable academic credit management — integrating blockchain,
            smart contracts, and NFT-based verification for educational institutions.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

          {/* Left: College Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-2">🏛️ Pillai HOC College of Engineering and Technology</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Mahatma Education Society’s premier institution dedicated to excellence in engineering and research, fostering innovation through technology integration.
            </p>
          </div>

          {/* Middle: Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-3">🔗 Quick Access</h4>
            <div className="space-y-2">
              <a href="/admin" className="block text-gray-300 hover:text-white text-sm transition">🧭 Admin Dashboard</a>
              <a href="/student" className="block text-gray-300 hover:text-white text-sm transition">🎓 Student Portal</a>
              <a href="/verify" className="block text-gray-300 hover:text-white text-sm transition">✅ Verification Portal</a>
            </div>
          </div>

          {/* Right: Technology Stack */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-white mb-3">⚙️ Technology Stack</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>🪙 Ethereum Smart Contracts</p>
              <p>🧾 NFT-based Certificate Registry</p>
              <p>☁️ MERN Stack Integration</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4">
          <p className="text-xs text-gray-400">
            © 2025 Pillai HOC College of Engineering and Technology | All Rights Reserved
          </p>
          <p className="text-xs text-gray-400 italic">
           Developed under the guidance of Prof. Abhijeet More (HOD, MCA Department)
           Project Members: Rushikesh Kale, Sujal Gaikwad, Siddhesh Sarvankar
          </p>
          <p className="text-xs text-gray-400">🔗 Blockchain Secured • Verified on Ethereum</p>
        </div>
      </div>
    </footer>
  );
}
