const hre = require("hardhat");

async function main() {
  // Getting the contract factory
  const TestMerkleProof = await hre.ethers.getContractFactory("TestMerkleProof");

  // Deploying the contract and waiting for it to be mined
  const testMerkleProof = await TestMerkleProof.deploy();
  await testMerkleProof.deployed();

  console.log("TestMerkleProof deployed to:", testMerkleProof.address);
}

// Running the script and handling any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
