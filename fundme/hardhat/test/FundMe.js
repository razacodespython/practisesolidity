const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { parseEther } = ethers.utils;

describe("FundMe", () => {
  let FundMe;
  let fundMe;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a mock contract for the Chainlink price feed
    const PriceFeedMock = await ethers.getContractFactory("MockV3Aggregator");
    const priceFeedMock = await PriceFeedMock.deploy("8", "200000000000"); // 2000
    await priceFeedMock.deployed();

    // Deploy the FundMe contract and pass the mock price feed address as an argument
    FundMe = await ethers.getContractFactory("FundMe");
    fundMe = await FundMe.deploy();
    await fundMe.deployed();
  });

  it("should set the owner correctly", async () => {
    expect(await fundMe.owner()).to.equal(owner.address);
  });

  it("should accept and record the funds", async () => {
    const amount = parseEther("1");
    await fundMe.connect(addr1).fund({ value: amount });
    const balance = await ethers.provider.getBalance(fundMe.address);
    expect(balance).to.equal(amount);
    expect(await fundMe.addressToAmountFunded(addr1.address)).to.equal(amount);
    expect(await fundMe.funders(0)).to.equal(addr1.address);
  });

  it("should require a minimum of 50 USD worth of ETH to fund", async () => {
    const invalidAmount = parseEther("0.01");
    await expect(fundMe.connect(addr1).fund({ value: invalidAmount })).to.be.revertedWith(
      "You need to spend more ETH!"
    );

    const validAmount = parseEther("2");
    await expect(fundMe.connect(addr1).fund({ value: validAmount })).to.not.be.reverted;
  });


  it("should allow the owner to withdraw the funds", async () => {

    const initialBalance = await ethers.provider.getBalance(owner.address);
    console.log('initial balance',initialBalance)

    const amount = parseEther("1");
    await fundMe.connect(addr1).fund({ value: amount });

    const balanceBefore = await ethers.provider.getBalance(owner.address);
    console.log('balance before', balanceBefore)

    let gasPrice = await ethers.provider.getGasPrice()
    console.log('gasprice', gasPrice)

    const withdrawTx = await fundMe.connect(owner).withdraw();
    const receipt = await withdrawTx.wait();

    //const {gasUsed, effectiveGasPrice} = receipt
    const actGas = await receipt.gasUsed.mul(await ethers.provider.getGasPrice())
    //const actGas = await receipt.gasUsed.mul(gasPrice);

    const balanceAfter = await ethers.provider.getBalance(owner.address);
    console.log('balanceafter', balanceAfter)
    const consoleExpecBalance = balanceBefore.add(amount.sub(receipt.gasUsed.mul(gasPrice)))
    console.log('checkbalance', consoleExpecBalance)
    const expectedBalanceChange = amount.sub(actGas);
    const expectedBalanceAfter = balanceBefore.add(expectedBalanceChange)

    const finalCheck = balanceAfter.sub(consoleExpecBalance)
    console.log('final',finalCheck)
    //expect(balanceAfter).to.equal(expectedBalanceAfter);
    expect(balanceAfter).to.equal(consoleExpecBalance)

    //check if funders array is empty
    await expect(fundMe.funders(0)).to.be.reverted;
    //check if mapping for sender which funded is set to 0
    assert.equal(await fundMe.addressToAmountFunded(addr1.address),0)
    //check if only owner can withdraw amount
    const attacker = await fundMe.connect(addr1)
    await expect(attacker.withdraw()).to.be.reverted
  });

});
  // it("should return the correct version and price", async () => {

  //   expect(await fundMe.getVersion()).to.equal(0);
  //   expect(await fundMe.getPrice()).to.equal(0);
    
  // });

