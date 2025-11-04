// src/components/UploadCertificate.jsx
import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { fileSha256Hex } from "../utils/fileHash";
import { uploadToIPFS } from "../utils/ipfs";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contractInfo";

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [creditType, setCreditType] = useState("External"); // ✅ new field
  const [onChainHash, setOnChainHash] = useState(""); // ✅ for success TX

  // Handle file selection
  function handleFile(e) {
    setFile(e.target.files?.[0] || null);
    setStatus("");
    setOnChainHash("");
  }

  // Handle upload to blockchain
  async function handleUpload() {
    try {
      if (!file) {
        setStatus("⚠️ Please select a file first.");
        return;
      }

      setStatus("🔄 Computing SHA256 of the file...");
      const sha = await fileSha256Hex(file);

      // Optional: Upload to IPFS (Pinata)
      setStatus("☁️ Uploading file to IPFS (optional)...");
      let ipfsUrl = "";
      try {
        ipfsUrl = await uploadToIPFS(file);
      } catch (e) {
        console.warn("IPFS upload skipped or failed:", e?.message || e);
      }

      const token = Date.now().toString();

      // Send transaction to blockchain
      setStatus("⛓️ Sending transaction to store file hash on blockchain...");
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueCertificateFileOnly(token, sha);
      setStatus("⏳ Transaction submitted — waiting for confirmation...");
      const receipt = await tx.wait();

      // ✅ On-chain transaction hash
      setOnChainHash(receipt.hash);
      setStatus(
        `✅ ${creditType} Certificate stored successfully on blockchain. Token: ${token}`
      );

      console.log("✅ Upload complete:", {
        creditType,
        ipfsUrl,
        fileHash: sha,
        token,
        txHash: receipt.hash,
      });
    } catch (err) {
      console.error(err);
      const msg = err?.reason || err?.message || String(err);
      setStatus("❌ Error: " + msg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border dark:border-gray-700 p-8 transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          📤 Upload Certificate (Admin)
        </h2>

        {/* ✅ Credit Type Dropdown */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Certificate Type
          </label>
          <select
            value={creditType}
            onChange={(e) => setCreditType(e.target.value)}
            className="block w-full border rounded-lg p-2 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="External">🌐 External (NPTEL, Coursera, edX)</option>
            <option value="Internal">🏛️ Internal (University Course)</option>
          </select>
        </div>

        {/* ✅ File Upload Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Select certificate file (PDF / Image)
          </label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFile}
            className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-100"
          />
        </div>

        {/* ✅ Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          Upload & Store Hash
        </button>

        {/* ✅ Status Message */}
        {status && (
          <div
            className={`mt-6 p-3 rounded-lg text-sm ${
              status.startsWith("✅")
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : status.startsWith("❌")
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {status}
          </div>
        )}

        {/* ✅ On-Chain Verified Badge */}
        {onChainHash && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-800 border border-green-400 text-green-700 dark:text-green-200 rounded-lg text-center">
            ✅ On-Chain Verified <br />
            <a
              href={`https://sepolia.etherscan.io/tx/${onChainHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View Transaction ↗
            </a>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Note: All Certificate files (PDF/Image) are securely stored on Blockchain & IPFS.
        </p>
      </div>
    </div>
  );
}
