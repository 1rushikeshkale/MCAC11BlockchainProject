# Blockchain-Based Academic Certificate Verification & Credit Transfer System

*(A Decentralized Academic Credential System using Blockchain)*

### 🚀 Project Overview

This project is a **Blockchain-powered Academic Certificate Management System** designed to ensure **tamper‑proof certificate issuance, verification, and academic credit transfer** as per **NEP 2020** guidelines.

The platform provides **secure credit transfer, certificate validation, and transparent student academic ledger tracking**, ensuring credibility during **placements, higher studies, and industry verification processes**.

---

## 🎯 Key Objectives

* ✅ Secure and immutable certificate storage using Blockchain
* ✅ Prevent certificate forgery & fraud
* ✅ Enable automated academic **credit calculation & transfer** (Internal + External MOOCs)
* ✅ Provide **trustless verification portal** for employers/institutions
* ✅ Decentralized ledger for **credit & certificate transparency**

---

## 🖥️ System Modules

This system contains **three core portals**:

### 1️⃣ **Admin / University Portal**

**Features:**

* Issue semester grade cards / academic certificates
* Upload certificate documents to blockchain IPFS storage
* Approve or reject student credit requests
* View student certificates & credits
* Burn certificate token (if any incorrect upload)
* Manage blockchain admin wallets / Minters (Hardhat accounts)

### 2️⃣ **Student Portal**

**Features:**

* Register & login with PRN, Email, Password
* Add internal credit request (semester credits)
* Upload external MOOC certificates:

  * NPTEL / SWAYAM
  * Coursera
  * edX
* Automated credit calculation:

  * **12 weeks = 3 credits**
  * **8 weeks = 2 credits**
  * **4 weeks = 1 credit**
* Track verified credits in real‑time
* Download approved certificates

### 3️⃣ **Verification Portal**

For **companies, universities, and government authorities** to verify:

* Verify certificate via **Token ID** 🔐
* Upload certificate file to verify authenticity
* Verify student PRN → view total earned credits
* Validate academic record securely

> No manual verification needed — blockchain ensures trust.

---

## 👨‍💻 Tech Stack Used

| Category   | Technology                                  |
| ---------- | ------------------------------------------- |
| Blockchain | Solidity, Hardhat, EVM, MetaMask            |
| Backend    | Node.js, Express.js                         |
| Frontend   | React.js, Tailwind CSS / Bootstrap          |
| Database   | MongoDB                                     |
| Storage    | IPFS / Pinata / NFT.Storage (Decentralized) |
| Wallet     | MetaMask                                    |
| Dev Tools  | Hardhat, Node.js, Alchemy / Infura          |

---

## ⚙️ How it Works

```
Admin issues → Certificate stored on Blockchain → Token generated → IPFS hash saved →
Student / Employer uploads certificate or token → Verified through smart contract
```

---

## 🔐 Security Features

* Immutable Records on Blockchain (cannot edit/delete)
* Token‑based identity for each certificate
* PDF/Image stored in decentralized storage
* Smart Contract permission control for minting/burning

---

## 🎓 Real‑World Usage

| User                         | Usage                                          |
| ---------------------------- | ---------------------------------------------- |
| Students                     | Submit MOOC certificates, track credits        |
| Universities                 | Issue academic grade cards & certificates      |
| Companies                    | Validate candidate certificates via blockchain |
| Govt / Verification Agencies | Secure document verification                   |

---

## 🧪 Testing & Blockchain Setup

### Local Blockchain

```bash
npx hardhat node
```

### Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 📎 Future Enhancements

* AI‑based Certificate OCR validation
* NFT‑Based Degree tokenization
* QR‑Code based verification portal
* IPFS encryption for confidential docs
* Mobile App version
* University / NAAC dashboard analytics

---

## 📌 Screenshots
1. Admin Login
![Admin Login Page](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/0bf8202d8be989239423fe89268259d9bf70b1dc/Admin%20Login%20Page.PNG?raw=true)

2. Issue Certificate Page
![Issue Certificate Page](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Issue%20Certificate.PNG?raw=true)

3. Connect Metamask Page
![Connect Metamask Page](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Connect%20Metamask%20page.PNG?raw=true)

4. Upload Certificate on Blockchain
![Upload Certificate on Blockchain](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Upload%20Certificate%20on%20Bloackchain.PNG?raw=true)

5. Admin Approve Credit Page
![Admin Approve Credit Page](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Admin%20Approve%20Credit%20%20page.PNG?raw=true)

6. Student Dashboard
![Student Dashboard](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Student%20Dashboard.PNG?raw=true)

7. Verify Porta
![Verify Portal](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/Verify%20Portal.PNG?raw=true)

8. View or Verify Student Credit Using PRN Number
![View or Verify Student Credit Using PRN Number](https://github.com/1rushikeshkale/Blockchain-Based-Academic-Certificate-Verification-and-Credit-Transfer-System/blob/3ba9aa1d1c01b4e23d7316c0a5c2521c0b6f9f13/View%20or%20Verify%20Student%20Credit%20Using%20PRN%20Number.PNG?raw=true)






## ❤️ Credits

Developed by: **Rushikesh Kale** ( Master of Computer Application )

---

## 📄 License

MIT License

---

## ⭐ Support the Project

If you found this project helpful, give it a ⭐ on GitHub!

```
https://github.com/1rushikeshkale/MCAC11BlockchainProject
```

---

### 📬 Contact

For queries or collaboration:

* Email: 1rushikeshkale@gmail.com
* LinkedIn: https://www.linkedin.com/in/1rushikeshkale/

> *"Blockchain for Education — ensuring trust, transparency, and authenticity."*
