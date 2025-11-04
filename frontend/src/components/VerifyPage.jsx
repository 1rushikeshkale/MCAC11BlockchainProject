// src/components/VerifyPage.jsx
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { getContract, getProvider } from "../utils/blockchain";
import { fileSha256Hex } from "../utils/fileHash";
import Footer from "./Footer";
import Header from "./Header";

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [status, setStatus] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [prn, setPrn] = useState("");
  const [ledger, setLedger] = useState([]);
  const [ledgerStatus, setLedgerStatus] = useState("");
  const [totalCredits, setTotalCredits] = useState(0);

  usePageTitle("Verification Portal");

  // ---- Token verify ----
  async function handleVerifyToken() {
    setStatus("Verifying...");
    setCertificate(null);
    setFilePreview(null);

    if (!input) {
      setStatus("⚠️ Enter a token first.");
      return;
    }

    try {
      const provider = await getProvider();
      const contract = await getContract(provider);
      const cert = await contract.getCertificateByToken(input);

      if (!cert) throw new Error("Not found");

      setCertificate({
        serialNo: cert.serialNo,
        token: cert.token,
        fileHash: cert.fileHash,
      });
      setStatus("✅ Valid Certificate found by token.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Invalid certificate or not issued.");
    }
  }

  // ---- File verify ----
  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    setUploadStatus("");
    if (file) setFilePreview(URL.createObjectURL(file));
  }

  async function handleVerifyUpload() {
    if (!uploadFile) {
      setUploadStatus("⚠️ Please select a file to verify.");
      return;
    }

    try {
      setUploadStatus("🔄 Computing hash...");
      const sha = await fileSha256Hex(uploadFile);

      const provider = await getProvider();
      const contract = await getContract(provider);

      const exists = await contract.isValidFileHash(sha);
      if (!exists) {
        setUploadStatus("❌ File not found on blockchain.");
        return;
      }

      const cert = await contract.getCertificateByFileHash(sha);
      setCertificate({
        serialNo: cert.serialNo,
        token: cert.token,
        fileHash: cert.fileHash,
      });
      setUploadStatus("✅ Valid Certificate verified by file.");
    } catch (err) {
      console.error(err);
      setUploadStatus("❌ Error verifying file: " + (err.message || err));
    }
  }

  // ---- Download handler ----
  function handleDownload() {
    if (!certificate) return;
    if (uploadFile) {
      const url = URL.createObjectURL(uploadFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = uploadFile.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("⚠️ No original file available for download. Please verify by file upload.");
    }
  }

  // ✅ ---- NEW: View Student Ledger ----
  async function handleViewLedger() {
    if (!prn) {
      setLedgerStatus("⚠️ Enter a valid PRN number.");
      return;
    }

    try {
      setLedgerStatus("🔍 Fetching ledger...");
      const res = await fetch(`http://localhost:5000/api/ledger/student/${prn}`);
      const data = await res.json();

      if (!res.ok || !data.entries?.length) {
        setLedger([]);
        setTotalCredits(0);
        setLedgerStatus("❌ No records found for this PRN.");
        return;
      }

      setLedger(data.entries);
      setTotalCredits(data.totalCredits || 0);
      setLedgerStatus(`✅ ${data.entries.length} credit records found.`);
    } catch (err) {
      console.error(err);
      setLedgerStatus("❌ Error fetching ledger.");
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10 flex flex-col items-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 dark:text-gray-100 animate-fadeInDown">
          🎓 Academic Certificate & Credit Verification Portal
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl animate-fadeInUp">
          Verify certificates and view Academic Credit Ledger as per NEP 2020 (Internal + External credits)
        </p>

        {/* Verify Boxes */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Token verify */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">🔑 Verify by Token</h2>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter token..."
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleVerifyToken}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            >
              Verify Token
            </button>
            {status && <p className="mt-4 text-md text-gray-700 dark:text-gray-300">{status}</p>}
          </div>

          {/* File verify */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">📤 Verify by Certificate</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mb-6 text-md border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2"
            />
            <button
              onClick={handleVerifyUpload}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md"
            >
              Verify File
            </button>
            {uploadStatus && <p className="mt-4 text-md text-gray-700 dark:text-gray-300">{uploadStatus}</p>}
          </div>

          {/* ✅ New: Ledger verify */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">📚 View Student Ledger</h2>
            <input
              type="text"
              value={prn}
              onChange={(e) => setPrn(e.target.value)}
              placeholder="Enter PRN (e.g., 20245564664...)"
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={handleViewLedger}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md"
            >
              View Ledger
            </button>
            {ledgerStatus && <p className="mt-4 text-md text-gray-700 dark:text-gray-300">{ledgerStatus}</p>}
          </div>
        </div>

        {/* Certificate Result */}
        {certificate && (
          <div className="max-w-3xl w-full mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-green-600">✅ Valid Certificate</h3>
            <p><strong>Serial:</strong> {certificate.serialNo?.toString()}</p>
            <p><strong>Token:</strong> {certificate.token?.toString()}</p>
            <p className="break-all mb-4"><strong>File Hash:</strong> {certificate.fileHash}</p>
            <button
              onClick={handleDownload}
              className="mt-4 w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
            >
              ⬇️ Download Certificate
            </button>
            {filePreview && (
              <div className="mt-8 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner p-4 flex justify-center">
                <iframe src={filePreview} title="Certificate Preview" className="w-full h-[800px]" />
              </div>
            )}
          </div>
        )}

        {/* ✅ Ledger Results Table */}
        {ledger.length > 0 && (
          <div className="max-w-5xl w-full mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-purple-600">📘 Academic Credit Ledger</h3>
            <p className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
              Total Credits Earned: <span className="text-green-600">{totalCredits}</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2">Course</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Credits</th>
                    <th className="p-2">Issued By</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((l, i) => (
                    <tr key={i} className="border-b dark:border-gray-700">
                      <td className="p-2">{l.courseName}</td>
                      <td className="p-2">{l.sourceType}</td>
                      <td className="p-2">{l.credits}</td>
                      <td className="p-2">{l.platform || "University"}</td>
                      <td className="p-2">{new Date(l.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
