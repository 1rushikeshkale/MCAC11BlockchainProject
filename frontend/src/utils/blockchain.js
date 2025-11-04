// src/utils/blockchain.js
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contractInfo";

// Utility to generate random token
export function generateToken() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ✅ Get Provider & Request Wallet Connection
export async function getProvider() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("❌ MetaMask not found. Please install it.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Return provider
    return new ethers.BrowserProvider(window.ethereum);
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 user rejected request
      throw new Error("❌ Connection rejected by user.");
    }
    console.error("MetaMask error:", err);
    throw new Error("❌ Failed to connect MetaMask.");
  }
}

// ✅ Get contract instance
export async function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

// ✅ Get contract owner
export async function getOwner(signerOrProvider) {
  const contract = await getContract(signerOrProvider);
  return await contract.owner();
}

// ✅ Burn certificate
export async function burnCertificate(token, signerOrProvider) {
  const contract = await getContract(signerOrProvider);
  const tx = await contract.burnCertificate(token);
  await tx.wait();
}

// ✅ Add a minter
export async function addMinter(address, signerOrProvider) {
  const contract = await getContract(signerOrProvider);
  const tx = await contract.addMinter(address);
  await tx.wait();
}

// ✅ Remove a minter
export async function removeMinter(address, signerOrProvider) {
  const contract = await getContract(signerOrProvider);
  const tx = await contract.removeMinter(address);
  await tx.wait();
}

// ✅ Check if an address is a minter
export async function isMinter(address, provider) {
  const contract = await getContract(provider);
  return await contract.minters(address);
}

// ✅ Check if a token is valid
export async function isValidCertificate(token, provider) {
  const contract = await getContract(provider);
  return await contract.isValidToken(token);
}
