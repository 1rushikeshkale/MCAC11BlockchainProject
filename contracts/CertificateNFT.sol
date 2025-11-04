// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721, Ownable {
    uint256 public nextTokenId = 1;
    uint256 public nextSerialNo = 10001;

    struct Certificate {
        uint256 serialNo;
        string token;
        string fileHash;
        string studentId;     // ✅ new field: Student PRN/ID (for Academic Ledger)
        string courseName;    // ✅ new field: course name or subject
        string platform;      // ✅ new field: NPTEL/Coursera/University
        uint16 credits;       // ✅ new field: credits earned (as per NEP 2020)
        uint256 issueDate;    // ✅ new field: issue timestamp
        bool revoked;         // ✅ new field: revocation status
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(string => uint256) public fileHashToTokenId;
    mapping(string => uint256) public tokenToTokenId;
    mapping(address => bool) public minters;

    event CertificateIssued(
        address indexed issuer,
        uint256 tokenId,
        string token,
        string fileHash,
        string studentId,
        string courseName,
        string platform,
        uint16 credits,
        uint256 issueDate
    );

    event CertificateBurned(uint256 tokenId, string token, string fileHash);
    event MinterAdded(address minter);
    event MinterRemoved(address minter);
    event CertificateRevoked(uint256 tokenId, string token, string reason); // ✅ new event

    modifier onlyMinterOrOwner() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    constructor() ERC721("PHCET Certificate", "PHCERT") Ownable(msg.sender) {}

    // =============================================================
    // ✅ 1. Original Function (No Change)
    // =============================================================

    function issueCertificateFileOnly(string memory token, string memory fileHash)
        external
        onlyMinterOrOwner
    {
        require(fileHashToTokenId[fileHash] == 0, "File already exists");
        uint256 tokenId = nextTokenId++;
        uint256 serial = nextSerialNo++;

        certificates[tokenId] = Certificate({
            serialNo: serial,
            token: token,
            fileHash: fileHash,
            studentId: "",
            courseName: "",
            platform: "",
            credits: 0,
            issueDate: block.timestamp,
            revoked: false
        });

        tokenToTokenId[token] = tokenId;
        fileHashToTokenId[fileHash] = tokenId;

        _mint(msg.sender, tokenId);
        emit CertificateIssued(msg.sender, tokenId, token, fileHash, "", "", "", 0, block.timestamp);
    }

    // =============================================================
    // ✅ 2. New Function (Issue Certificate with Academic Details)
    // =============================================================

    function issueAcademicCertificate(
        string memory token,
        string memory fileHash,
        string memory studentId,
        string memory courseName,
        string memory platform,
        uint16 credits
    ) external onlyMinterOrOwner {
        require(fileHashToTokenId[fileHash] == 0, "Certificate already exists");

        uint256 tokenId = nextTokenId++;
        uint256 serial = nextSerialNo++;

        certificates[tokenId] = Certificate({
            serialNo: serial,
            token: token,
            fileHash: fileHash,
            studentId: studentId,
            courseName: courseName,
            platform: platform,
            credits: credits,
            issueDate: block.timestamp,
            revoked: false
        });

        tokenToTokenId[token] = tokenId;
        fileHashToTokenId[fileHash] = tokenId;

        _mint(msg.sender, tokenId);
        emit CertificateIssued(
            msg.sender,
            tokenId,
            token,
            fileHash,
            studentId,
            courseName,
            platform,
            credits,
            block.timestamp
        );
    }

    // =============================================================
    // ✅ 3. Verification Functions (Unchanged)
    // =============================================================

    function getCertificateByToken(string memory token) external view returns (Certificate memory) {
        uint256 tokenId = tokenToTokenId[token];
        require(tokenId != 0, "Certificate not found");
        return certificates[tokenId];
    }

    function getCertificateByFileHash(string memory fileHash) external view returns (Certificate memory) {
        uint256 tokenId = fileHashToTokenId[fileHash];
        require(tokenId != 0, "Certificate not found");
        return certificates[tokenId];
    }

    function isValidFileHash(string memory fileHash) external view returns (bool) {
        return fileHashToTokenId[fileHash] != 0;
    }

    function isValidToken(string memory token) external view returns (bool) {
        return tokenToTokenId[token] != 0;
    }

    // =============================================================
    // ✅ 4. Revoke / Burn Certificate (Unchanged + Enhanced)
    // =============================================================

    function burnCertificate(string memory token) external onlyMinterOrOwner {
        uint256 tokenId = tokenToTokenId[token];
        require(tokenId != 0, "Token not found");

        Certificate memory cert = certificates[tokenId];
        delete fileHashToTokenId[cert.fileHash];
        delete tokenToTokenId[token];
        delete certificates[tokenId];

        _burn(tokenId);
        emit CertificateBurned(tokenId, token, cert.fileHash);
    }

    // ✅ Revoke without burning (for NEP 2020 compliance)
    function revokeCertificate(string memory token, string memory reason) external onlyMinterOrOwner {
        uint256 tokenId = tokenToTokenId[token];
        require(tokenId != 0, "Certificate not found");
        certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId, token, reason);
    }

    // =============================================================
    // ✅ 5. Minter Management (Unchanged)
    // =============================================================

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
}
