// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Compile the contract
  await hre.run('compile');

  // Get the contract factory
  const Vault = await hre.ethers.getContractFactory("Vault");
  
  // Specify the address of the ERC20 token you want to interact with. 
  // This is just a placeholder. Replace it with your ERC20 address.
  const erc20TokenAddress = "0x48654E550E90B6Cc11C5B57850e696c3ba4341Ba";

  // Deploy the contract with the specified ERC20 token address
  const vault = await Vault.deploy(erc20TokenAddress);

  // Wait for the contract to be mined
  await vault.deployed();

  console.log("Vault deployed to:", vault.address);
}

// Run the script and handle any errors
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });