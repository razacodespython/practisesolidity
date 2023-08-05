import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/abi.json"

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [favoriteNumber, setFavoriteNumber] = useState(0);

  useEffect(() => {
    initializeEthers();
  }, []);

  const initializeEthers = async () => {
    try {
      // Check if window.ethereum is available
      if (typeof window.ethereum !== "undefined") {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = provider.getSigner()
        // Get the connected accounts
        const accounts = await web3Provider.listAccounts();
        console.log(signer)
        setAccounts(accounts);
        // Initialize contract
        const contractAddress = "0xaAeC7c3a1Af1d5a7f9542D8199e26F95dFa88cAc";
        const contractAbi = abi;
        const storageFactoryContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        setContract(storageFactoryContract);
        setContractAddress(contractAddress);
      
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this dApp.");
      }
    } catch (error) {
      console.error("Error initializing ethers:", error);
    }
  };

  const handleCreateSimpleStorageContract = async () => {
    try {
      console.log(contract)
      // Call createSimpleStorageContract function on the contract
      await contract.createSimpleStorageContract();
    } catch (error) {
      console.error("Error creating SimpleStorage contract:", error);
    }
  };

  const handleStoreFavoriteNumber = async () => {
    try {
      // Call sfStore function on the contract to store the favorite number
      const index = 0; // Use 0 for the first SimpleStorage contract (modify as needed)
      await contract.sfStore(index, favoriteNumber);
    } catch (error) {
      console.error("Error storing favorite number:", error);
    }
  };

  const handleRetrieveFavoriteNumber = async () => {
    try {
      // Call sfGet function on the contract to retrieve the favorite number
      const index = 0; // Use 0 for the first SimpleStorage contract (modify as needed)
      const retrievedNumber = await contract.sfGet(index);
      setFavoriteNumber(retrievedNumber.toNumber());
    } catch (error) {
      console.error("Error retrieving favorite number:", error);
    }
  };

  return (
    <div>
      <h1>Ethers.js and Next.js Example</h1>
      {accounts.length > 0 ? (
        <p>Connected with address: {accounts[0]}</p>
      ) : (
        <button onClick={() => initializeEthers()}>Connect Wallet</button>
      )}

      <div>
        <h2>StorageFactory Contract</h2>
        <p>Contract Address: {contractAddress}</p>
        <button onClick={() => handleCreateSimpleStorageContract()}>
          Create SimpleStorage Contract
        </button>
        <br />
        <label>
          Favorite Number:
          <input
            type="number"
            value={favoriteNumber}
            onChange={(e) => setFavoriteNumber(parseInt(e.target.value))}
          />
        </label>
        <button onClick={() => handleStoreFavoriteNumber()}>Store</button>
        <button onClick={() => handleRetrieveFavoriteNumber()}>
          Retrieve
        </button>
        <p>Favorite Number: {favoriteNumber}</p>
      </div>
    </div>
  );
}
