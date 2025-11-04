// backend/utils/blockchain.js
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const abiPath = path.join(__dirname, "../contracts/CertificateNFT.json");

// ✅ Check ABI exists
if (!fs.existsSync(abiPath)) {
  console.error("❌ ABI file not found at:", abiPath);
  throw new Error("CertificateNFT.json ABI file missing!");
}

// Read ABI
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

/**
 * ✅ Get Blockchain Connection (Ethers v5 Compatible)
 */
export function getBlockchain() {
  if (!process.env.PROVIDER_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
    throw new Error("❌ Missing blockchain environment variables in .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi, wallet);

  console.log("✅ Blockchain connected successfully");
  console.log("📜 Contract Address:", process.env.CONTRACT_ADDRESS);
  console.log("👛 Wallet:", wallet.address);

  return { provider, wallet, contract };
}
