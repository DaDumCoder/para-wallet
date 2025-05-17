import Para, { Environment } from "@getpara/web-sdk";
import { ParaEthersSigner } from "@getpara/ethers-v6-integration";
import { ethers } from "https://cdn.skypack.dev/ethers";

// ——— YOUR SETTINGS ———
const API_KEY       = "YOUR_PARA_API_KEY";
const RPC_URL       = "YOUR_RPC_URL";
const CONTRACT_ADDR = "0xYourContractAddress";
const CONTRACT_ABI  = ["function claim() returns (bool)"];
// ————————————————

const para     = new Para(Environment.BETA, API_KEY);
const provider = new ethers.JsonRpcProvider(RPC_URL);
let signer;

document.getElementById("connect").onclick = async () => {
  await para.init();
  if (!await para.isFullyLoggedIn()) {
    await para.createUser();
    // follow Para’s on-screen flow
  }
  signer = new ParaEthersSigner(para, provider);
  document.getElementById("claim").disabled = false;
};

document.getElementById("claim").onclick = async () => {
  if (!signer) return alert("Connect first!");
  const contract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, signer);
  try {
    const tx = await contract.claim();
    await tx.wait();
    alert("✅ Token claimed!");
  } catch (e) {
    alert("❌ Claim failed: " + e.message);
  }
};
