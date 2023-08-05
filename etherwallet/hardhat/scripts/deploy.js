const hre = require("hardhat");

async function main() {

  const EtherWallet = await hre.ethers.getContractFactory("EtherWallet");
  const etherwallet = await EtherWallet.deploy();

  await etherwallet.deployed();

  console.log(
    `deployed to ${etherwallet.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
