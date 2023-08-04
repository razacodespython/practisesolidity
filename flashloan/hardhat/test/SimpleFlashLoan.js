const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, artifacts } = require("hardhat");
const hre = require("hardhat");

const { USDC, USDC_WHALE, POOL_ADDRESS_PROVIDER } = require("../config");

describe("Deploy a Flash Loan", function () {
  it("Should take a flash loan and be able to return it", async function () {
    const flashLoanExample = await ethers.getContractFactory(
      "SimpleFlashLoan"
    );

    const _flashLoanExample = await flashLoanExample.deploy(
      // Address of the PoolAddressProvider: you can find it here: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon
      POOL_ADDRESS_PROVIDER
    );
    await _flashLoanExample.deployed();
    console.log(_flashLoanExample.address)

    const token = await ethers.getContractAt("IERC20", USDC);
    console.log(token.address)

    const BALANCE_AMOUNT_USDC = ethers.utils.parseEther("1000");
    

    
    // Impersonate the USDC_WHALE account to be able to send transactions from that account
   
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });
   
    const signer = await ethers.getSigner(USDC_WHALE);

    const signerBalanceBefore = await token.balanceOf(signer.address);
    console.log("Signer USDC Balance Before Sending:", signerBalanceBefore.toString());

    //await token.connect(signer).transfer(POOL_ADDRESS_PROVIDER, AMOUNT_TO_SEND_USDC);
    const contractBalance = await token.balanceOf(_flashLoanExample.address);

    console.log("Flash Loan Contract USDC Balance Before Transfer:", contractBalance.toString());

    // await token
    //   .connect(signer)
    //   .transfer(_flashLoanExample.address, BALANCE_AMOUNT_USDC);

    console.log("contract to send to",_flashLoanExample.address)
    const txReceipt = await token
      .connect(signer)
      .transfer(_flashLoanExample.address, 10000000);
    console.log("Transfer Transaction Receipt:", txReceipt);

    //await token.connect(signer).transfer(_flashLoanExample.address, AMOUNT_TO_SEND_USDC);
    const contractBalanceAfterTransfer = await token.balanceOf(_flashLoanExample.address);
    console.log("Flash Loan Contract USDC Balance After Transfer:", contractBalanceAfterTransfer.toString());


    const tx = await _flashLoanExample.fn_RequestFlashLoan(USDC,100000) //createFlashLoan(USDC, 1000);  Borrow 1000 USDC in a Flash Loan with no upfront collateral
    await tx.wait();
    const remainingBalance = await token.balanceOf(_flashLoanExample.address); // Check the balance of USDC in the Flash Loan contract afterwards
    expect(remainingBalance.lt(10000000)).to.be.true; // We must have less than 2000 USDC now, since the premium was paid from our contract's balance
  });
});
