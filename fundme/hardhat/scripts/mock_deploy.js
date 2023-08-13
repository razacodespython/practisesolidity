const hre = require("hardhat");

async function main() {

  const DECIMALS = "8";
  const INITIAL_PRICE = "200000000000"; // 2000

  const Mock = await hre.ethers.getContractFactory("MockV3Aggregator");
  const mock = await Mock.deploy(DECIMALS,INITIAL_PRICE);

  await mock.deployed();

  console.log(`deployed to ${mock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
