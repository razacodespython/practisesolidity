const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function() {
  let Vault, vault, ERC20Mock, erc20Mock, owner, addr1, addr2;

  beforeEach(async function() {
    // Deploy a mock ERC20 token
    ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    erc20Mock = await ERC20Mock.deploy();
    await erc20Mock.deployed();

    // Deploy the Vault
    Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy(erc20Mock.address);
    await vault.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
});

  describe("Deployment", function() {
    it("Should set the correct token address", async function() {
      expect(await vault.token()).to.equal(erc20Mock.address);
    });
  });

  describe("Deposit", function() {
    it("Should allow users to deposit tokens and receive shares", async function() {
      // Approve and deposit 100 tokens from addr1
      await erc20Mock.connect(addr1).mint(addr1.address,ethers.utils.parseEther("100"));
      await erc20Mock.connect(addr1).approve(vault.address, ethers.utils.parseEther("100"));
      await vault.connect(addr1).deposit(ethers.utils.parseEther("100"));

      expect(await vault.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
      expect(await erc20Mock.balanceOf(vault.address)).to.equal(ethers.utils.parseEther("100"));
    });
  });

  describe("Withdraw", function() {
    it("Should allow users to withdraw tokens by burning shares", async function() {
      await erc20Mock.connect(addr1).mint(addr1.address,ethers.utils.parseEther("100"));
      // Deposit first to get shares
      await erc20Mock.connect(addr1).approve(vault.address, ethers.utils.parseEther("100"));
      await vault.connect(addr1).deposit(ethers.utils.parseEther("100"));

      // Withdraw 50 tokens (burn 50 shares)
      await vault.connect(addr1).withdraw(ethers.utils.parseEther("50"));

      expect(await vault.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("50"));
      expect(await erc20Mock.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("50"));
    });
  });
});