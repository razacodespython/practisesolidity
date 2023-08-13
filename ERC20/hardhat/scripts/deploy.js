const hre = require("hardhat");
const ethers = require('ethers');

async function main() {

  const ERC20 = await hre.ethers.getContractFactory("ERC20");
  const totalSupply = ethers.utils.parseEther('1000')
  const erc20 = await ERC20.deploy(totalSupply);

  await erc20.deployed();

  console.log(
    ` deployed to ${erc20.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
