import { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi.json"

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);

  const connectWallet = async () => {
    try {
      // Check if window.ethereum is available
      if (typeof window.ethereum !== "undefined") {
        // Request access to the user's MetaMask account
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Get the connected signer
        const connectedSigner = web3Provider.getSigner();
        setSigner(connectedSigner);

        // Get the connected address directly from the signer
        const connectedAddress = await connectedSigner.getAddress();
        setConnectedAddress(connectedAddress);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this dApp.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setConnectedAddress(null);
  };

  return (
    <div>
      {connectedAddress ? (
        <>
          <p>Connected with address: {connectedAddress}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}