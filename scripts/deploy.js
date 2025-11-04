// scripts/deploy.js
// 🚀 Script to deploy CertificateNFT contract and auto-update backend .env

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Path to backend .env file
const backendEnvPath = path.join(__dirname, "..", "backend", ".env");

// Helper: update CONTRACT_ADDRESS in backend .env
function updateBackendEnv(newAddress) {
  try {
    let envContent = "";
    if (fs.existsSync(backendEnvPath)) {
      envContent = fs.readFileSync(backendEnvPath, "utf8");
    }

    // If CONTRACT_ADDRESS already exists, replace it
    if (envContent.includes("CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/g,
        `CONTRACT_ADDRESS=${newAddress}`
      );
    } else {
      // Otherwise append at end
      envContent += `\nCONTRACT_ADDRESS=${newAddress}\n`;
    }

    fs.writeFileSync(backendEnvPath, envContent);
    console.log("✅ backend/.env file updated with new CONTRACT_ADDRESS");
  } catch (err) {
    console.error("❌ Failed to update backend .env:", err);
  }
}

async function main() {
  console.log("🚀 Deploying CertificateNFT contract...\n");

  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();

  await certificateNFT.deployed();

  console.log("============================================");
  console.log("✅ CertificateNFT Deployed Successfully!");
  console.log("📜 Contract Address:", certificateNFT.address);
  console.log("============================================\n");

  // ✅ Auto update backend .env file
  updateBackendEnv(certificateNFT.address);

  console.log("🌍 Deployment complete!");
  console.log("Now your backend is ready to connect to this contract.\n");
  console.log("👉 Run: cd backend && npm start");
}

main().catch((error) => {
  console.error("❌ Deployment Error:", error);
  process.exitCode = 1;
});
