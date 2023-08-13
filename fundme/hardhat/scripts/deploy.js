const hre = require("hardhat");

async function main() {

  const FundMe = await hre.ethers.getContractFactory("FundMe");
  const fundme = await FundMe.deploy();

  await fundme.deployed();

  console.log(
    `deployed to ${fundme.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
