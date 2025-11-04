import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import { DarkModeProvider } from "./components/DarkModeContext";
import StudentPage from "./components/StudentPage";
import VerifyPage from "./components/VerifyPage";
import { ToastProvider } from "./hooks/useToast";
import Login from "./components/Login";
import { useState } from "react";

// Admin pages
import UploadCertificate from "./components/UploadCertificate";
import BurnCertificatePage from "./components/BurnCertificatePage";
import MinterManagementPage from "./components/MinterManagementPage";

// ✅ NEW: Approved Credits Page
import ApprovedCreditsPage from "./components/ApprovedCreditsPage";

// ✅ NEW: Student Login + Register
import StudentLogin from "./components/StudentLogin";
import StudentRegister from "./components/StudentRegister";

// ✅ Import Issue Certificate page
import IssueCertificate from "./components/IssueCertificate";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <DarkModeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Router>
            <Routes>
              {/* ✅ Student Auth & Dashboard */}
              <Route path="/student" element={<StudentLogin />} />
              <Route path="/student/register" element={<StudentRegister />} />
              <Route path="/student/dashboard" element={<StudentPage />} />

              {/* Verify Page */}
              <Route path="/verify" element={<VerifyPage />} />

              {/* Admin Dashboard (landing after login) */}
              <Route
                path="/admin"
                element={
                  isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" replace />
                }
              />

              {/* ✅ Issue Certificate Route */}
              <Route
                path="/admin/issue"
                element={
                  isLoggedIn ? <IssueCertificate /> : <Navigate to="/login" replace />
                }
              />

              {/* Admin sub-routes */}
              <Route
                path="/admin/upload"
                element={
                  isLoggedIn ? <UploadCertificate /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/admin/burn"
                element={
                  isLoggedIn ? <BurnCertificatePage /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/admin/minters"
                element={
                  isLoggedIn ? <MinterManagementPage /> : <Navigate to="/login" replace />
                }
              />

              {/* ✅ Approved Credits */}
              <Route
                path="/admin/approved-credits"
                element={
                  isLoggedIn ? <ApprovedCreditsPage /> : <Navigate to="/login" replace />
                }
              />

              {/* Admin Login */}
              <Route
                path="/login"
                element={<Login onLogin={() => setIsLoggedIn(true)} />}
              />

              {/* Default */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </div>
      </ToastProvider>
    </DarkModeProvider>
  );
}
