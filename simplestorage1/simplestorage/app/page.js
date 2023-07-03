'use client'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { abi } from './abi';
import { Box } from '@chakra-ui/react';


export default function Home() {
  const [favoriteNumber, setFavoriteNumber] = useState('');
  const [storedNumber, setStoredNumber] = useState('');
  const [personName, setPersonName] = useState('');
  const [personFavoriteNumber, setPersonFavoriteNumber] = useState('');
  const [mappedFavoriteNumber, setMappedFavoriteNumber] = useState('');

  const contractAddress = '0x5544cbe52b0797f71B4186469a0797Bdb260abf6';


  // Connect to the contract
  async function connectToContract() {
    if (window.ethereum) {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      return contract;
    } else {
      console.error('Please install MetaMask to interact with the contract.');
    }
  }

  // Store favorite number
  async function storeFavoriteNumber() {
    const contract = await connectToContract();
    if (contract) {
      const tx = await contract.store(favoriteNumber);
      await tx.wait();
      setFavoriteNumber('');
      retrieveFavoriteNumber();
    }
  }

  // Retrieve favorite number
  async function retrieveFavoriteNumber() {
    const contract = await connectToContract();
    if (contract) {
      console.log("contract OK")
      console.log(abi)
      const number = await contract.retrieve();
      setStoredNumber(number.toString());
    }
  }
 

   // Retrieve favorite number of a person
  async function retrievePersonFavoriteNumber(personName) {
    const contract = await connectToContract();
    console.log(personName)
    if (contract) {
      const number = await contract.nameToFavoriteNumber(personName);
      setMappedFavoriteNumber(number.toString());
    }
  }
  
  
  // Add a person
  async function addPerson() {
    const contract = await connectToContract();
    if (contract) {
      const tx = await contract.addPerson(personName, personFavoriteNumber);
      await tx.wait();
      setPersonName('');
      setPersonFavoriteNumber('');
      retrievePersonFavoriteNumber(personName);
    }
  }

  return (
    <Box>
      <div>
        <h1>SimpleStorage Contract Interaction</h1>
        <div>
          <h2>Store Favorite Number</h2>
          <input
            type="number"
            value={favoriteNumber}
            onChange={(e) => setFavoriteNumber(e.target.value)}
          />
          <button onClick={storeFavoriteNumber}>Store</button>
        </div>
        <div>
          <h2>Retrieve Favorite Number</h2>
          <button onClick={retrieveFavoriteNumber}>Retrieve</button>
          <p>Stored Number: {storedNumber}</p>
        </div>
        <div>
          <h2>Add Person</h2>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="number"
            value={personFavoriteNumber}
            onChange={(e) => setPersonFavoriteNumber(e.target.value)}
            placeholder="Favorite Number"
          />
          <button onClick={addPerson}>Add</button>
        </div>
        <div>
          <h2>Retrieve Favorite Number of a Person</h2>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Name"
          />
          <button onClick={() => retrievePersonFavoriteNumber(personName)}>
            Retrieve
          </button>
          <p>Mapped Favorite Number: {mappedFavoriteNumber}</p>
        </div>
      </div>
    </Box>
  );
}
