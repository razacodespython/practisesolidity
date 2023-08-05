const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("EtherWallet", () => {
  let etherWallet;
  let accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const EtherWalletContract = await ethers.getContractFactory("EtherWallet");
    etherWallet = await EtherWalletContract.deploy();
    await etherWallet.deployed();
  });

  it("should have an initial balance of zero", async () => {
    const balance = await etherWallet.getBalance();
    expect(balance).to.equal(0, "Initial balance should be zero");
  });

  it("should deposit funds correctly", async () => {
    const depositAmount = ethers.utils.parseEther("1");
    await accounts[0].sendTransaction({ to: etherWallet.address, value: depositAmount });
    const balance = await etherWallet.getBalance();
    expect(balance).to.equal(depositAmount, "Wallet balance should be equal to the deposit amount");
  });

  it("should withdraw funds correctly", async () => {
    const initialBalance = ethers.utils.parseEther("1");
    await accounts[0].sendTransaction({ to: etherWallet.address, value: initialBalance });
    const withdrawalAmount = ethers.utils.parseEther("0.5");
    await etherWallet.withdraw(withdrawalAmount);
    const expectedBalance = initialBalance.sub(withdrawalAmount);
    const balance = await etherWallet.getBalance();
    expect(balance).to.equal(expectedBalance, "Wallet balance should be equal to the initial balance minus the withdrawal amount");
  });

  it("should only allow the owner to withdraw funds", async () => {
    const attacker = accounts[1];
    const initialBalance = ethers.utils.parseEther("1");
    await accounts[0].sendTransaction({ to: etherWallet.address, value: initialBalance });
    const withdrawalAmount = ethers.utils.parseEther("0.5");

    try {
      await etherWallet.connect(attacker).withdraw(withdrawalAmount);
      expect.fail("Withdrawal should fail since the caller is not the owner");
    } catch (error) {
      expect(error.message).to.include("caller is not owner", "Withdrawal should fail since the caller is not the owner");
    }
  });
});
