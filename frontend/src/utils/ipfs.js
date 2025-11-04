// src/utils/ipfs.js
// Pinata pe file upload karne ke liye helper function

export async function uploadToIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to upload file to Pinata");
  }

  const result = await res.json();

  // CID se accessible URL return karo
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}
