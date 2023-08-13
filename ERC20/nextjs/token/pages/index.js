import { useState } from "react";
import { ethers } from "ethers";

import abi from "../abi.json";

const contractAddress = "0xb6b05Fb9F26cc590D25DD85Aa6f7D8f8d0Ead4Dd"; // Replace this with the deployed contract address
const contractAbi = abi;
 
export default function Home() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountEth, setAmountEth] = useState(0)
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [symbol, setSymbol] = useState('')

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const signer = web3Provider.getSigner();
        const erc20 = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(erc20);
        const symbol = setSymbol(await erc20.symbol)

        const connectedAddress = await signer.getAddress();
        setConnectedAddress(connectedAddress);

        const balance = await erc20.balanceOf(signer.getAddress());
        setBalance(balance.toString());
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this dApp.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleTransfer = async () => {
    try {
      if (contract) {
        
        await contract.transfer(recipient, ethers.utils.parseEther(amount.toString()));
        alert("Transfer successful!");
        const balance = await contract.getBalance();
        setBalance(balance.toString());
      } else {
        console.error("Contract is not initialized.");
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  const Mint = async () =>{
    await contract.mint(ethers.utils.parseEther(amountEth.toString()));
        alert("Minting successful!");
    
  }

  return (
    <div>
      {connectedAddress ? (
        <>
          <p>Connected with address: {connectedAddress}</p>
          <p>ERC20 address: {contractAddress}</p>
          <p>Balance: {ethers.utils.formatEther(balance)} {symbol}</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount to transfer"
          />
           <input placeholder="Recipient address" onChange={e => setRecipient(e.target.value)} />
          <button onClick={handleTransfer}>Transfer</button>
          <input
            type="text"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            placeholder="Enter the amount to mint"
          />
          <button onClick={Mint}>mint new tokens</button>
        </>
        
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

