// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserProvider, Contract } from "ethers";
import { fileSha256Hex } from "./utils/fileHash";
import { uploadToIPFS } from "./utils/ipfs";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./utils/contractInfo";

async function initBlockchain() {
  if (!window.ethereum) {
    console.error("⚠️ MetaMask not detected");
    return;
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  console.log("Provider:", provider);
  console.log("Signer:", signer);
  console.log("Contract:", contract);
}

initBlockchain();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
