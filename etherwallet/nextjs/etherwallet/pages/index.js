import { useState } from "react";
import { ethers } from "ethers";

import abi from "../abi.json";

const contractAddress = "0x2D12D63706D76F4510D1B2391F81ac42210105F9"; // Replace this with the deployed contract address
const contractAbi = abi;

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [amountEth, setAmountEth] = useState(0)
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const signer = web3Provider.getSigner();
        const etherWalletContract = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(etherWalletContract);

        const connectedAddress = await signer.getAddress();
        setConnectedAddress(connectedAddress);

        const balance = await etherWalletContract.getBalance();
        setBalance(balance.toString());
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this dApp.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      if (contract) {
        await contract.withdraw(ethers.utils.parseEther(withdrawAmount));
        const balance = await contract.getBalance();
        setBalance(balance.toString());
      } else {
        console.error("Contract is not initialized.");
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const sendEth = async () =>{
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const recipientAddress = '0x2D12D63706D76F4510D1B2391F81ac42210105F9'; // Replace with the recipient address
    const transaction = {
      to: recipientAddress,
      value: ethers.utils.parseEther(amountEth),
    };
    const tx = await signer?.sendTransaction(transaction);
    
  }

  return (
    <div>
      {connectedAddress ? (
        <>
          <p>Connected with address: {connectedAddress}</p>
          <p>EtherWallet address: {contractAddress}</p>
          <p>Balance: {ethers.utils.formatEther(balance)} ETH</p>
          <input
            type="text"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter the amount to withdraw in ETH"
          />
          <button onClick={handleWithdraw}>Withdraw</button>
          <input
            type="text"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            placeholder="Enter the amount to withdraw in ETH"
          />
          <button onClick={sendEth}>Send eth to wallet</button>
        </>
        
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

