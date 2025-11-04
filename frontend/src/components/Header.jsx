import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 text-white shadow-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* College Logo + Name */}
          <div className="flex items-center gap-4">
            <img
              src="/SUST.png"
              alt="PHCET Logo"
              className="h-14 w-14 rounded-full border-2 border-white/30 shadow-lg bg-white/10 p-1"
            />
            <div className="text-center md:text-left">
              <p className="text-blue-200 dark:text-gray-300 text-sm md:text-base font-medium">
                Mahatma Education Society’s
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Pillai HOC College of Engineering and Technology
              </h1>
              <p className="text-indigo-200 text-sm italic mt-1">
                (Autonomous | Affiliated to Mumbai University)
              </p>
            </div>
          </div>

          {/* Dark Mode + Project Badge */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 dark:from-cyan-600 dark:via-blue-700 dark:to-indigo-700 px-6 py-3 rounded-2xl shadow-lg border border-white/20">
              <div className="text-center">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <span className="text-xl">🔗</span>
                  <span>Blockchain Academic Framework</span>
                </div>
                <p className="text-blue-100 text-xs mt-1">
                  Secure Credit Transfer & Certificate Verification
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 dark:from-cyan-600 dark:via-blue-600 dark:to-purple-600"></div>
    </header>
  );
}
