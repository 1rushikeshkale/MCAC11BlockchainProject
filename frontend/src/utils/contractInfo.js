// src/utils/contractInfo.js

// 👉 Contract Address (deployment के बाद update करो)
export const CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <- tumhare deploy ka address

// 👉 ABI (with owner() added)
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "minter", "type": "address" }],
    "name": "addMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "token", "type": "string" }],
    "name": "burnCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "fileHash", "type": "string" }],
    "name": "getCertificateByFileHash",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "serialNo", "type": "uint256" },
          { "internalType": "string", "name": "token", "type": "string" },
          { "internalType": "string", "name": "fileHash", "type": "string" }
        ],
        "internalType": "struct CertificateNFT.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "token", "type": "string" }],
    "name": "getCertificateByToken",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "serialNo", "type": "uint256" },
          { "internalType": "string", "name": "token", "type": "string" },
          { "internalType": "string", "name": "fileHash", "type": "string" }
        ],
        "internalType": "struct CertificateNFT.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "fileHash", "type": "string" }],
    "name": "isValidFileHash",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "token", "type": "string" }],
    "name": "isValidToken",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "token", "type": "string" },
      { "internalType": "string", "name": "fileHash", "type": "string" }
    ],
    "name": "issueCertificateFileOnly",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "minter", "type": "address" }],
    "name": "removeMinter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
