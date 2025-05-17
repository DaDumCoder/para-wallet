// ——— IMPORT FROM CDN (via esm.sh) ———
import Para, { Environment }    from "https://esm.sh/@getpara/web-sdk@latest?bundle";
import { ParaEthersSigner }     from "https://esm.sh/@getpara/ethers-v6-integration@latest?bundle";
import { ethers }               from "https://esm.sh/ethers@5?bundle";
// ——— YOUR SETTINGS ———
const API_KEY       = "8fe977a23730e37cb077ca7b057245d9";
const RPC_URL       = "https://1rpc.io/sepolia";
const CONTRACT_ADDR = "0x7917B4D4071AfdF7BB69bc65c423C3613Cd05c73";
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
