const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20", function() {
  let ERC20, erc20, owner, addr1, addr2;

  beforeEach(async function() {
    ERC20 = await ethers.getContractFactory("ERC20");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const totalSupply = ethers.utils.parseEther('1')
    erc20 = await ERC20.deploy(totalSupply);
    await erc20.deployed();
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
        expect(await erc20.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function() {
        const ownerBalance = await erc20.balanceOf(owner.address);
        expect(await erc20.totalSupply()).to.equal(ownerBalance);
    });
});

describe("Transfer", function() {
  it("Should transfer tokens between accounts", async function() {
      await erc20.transfer(addr1.address, 50);
      const addr1Balance = await erc20.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
  });

  it("Should emit a transfer event on successful transfer", async function() {
      await expect(erc20.transfer(addr1.address, 50))
          .to.emit(erc20, 'Transfer')
          .withArgs(owner.address, addr1.address, 50);
  });
});

describe("Approval", function() {
  it("Should allow owner to approve an address to spend tokens", async function() {
      await erc20.approve(addr1.address, 50);
      expect(await erc20.allowance(owner.address, addr1.address)).to.equal(50);
  });

  it("Should allow addresses to use transferFrom", async function() {
      await erc20.approve(addr1.address, 50);
      await erc20.connect(addr1).transferFrom(owner.address, addr2.address, 50);
      const addr2Balance = await erc20.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
  });

  it("Should emit an approval event", async function() {
      await expect(erc20.approve(addr1.address, 50))
          .to.emit(erc20, 'Approval')
          .withArgs(owner.address, addr1.address, 50);
  });

  it("Should emit a transfer event on successful transferFrom", async function() {
      await erc20.approve(addr1.address, 50);
      await expect(erc20.connect(addr1).transferFrom(owner.address, addr2.address, 50))
          .to.emit(erc20, 'Transfer')
          .withArgs(owner.address, addr2.address, 50);
  });
});

describe("Minting", function() {
  it("Should only allow the owner to mint tokens", async function() {
      await erc20.mint(100);
      const totalSupply = ethers.utils.parseEther('0.001')
      const ownerBalance = await erc20.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply + 100);
  });

  it("Should emit a transfer event on successful minting", async function() {
      await expect(erc20.mint(100))
          .to.emit(erc20, 'Transfer')
          .withArgs(ethers.constants.AddressZero, owner.address, 100);
  });
});

describe("Burning", function() {
  it("Should allow any address to burn its own tokens", async function() {
      await erc20.transfer(addr1.address, 100); // Transfer tokens to burn
      await erc20.connect(addr1).burn(50);
      const addr1Balance = await erc20.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
  });

  it("Should emit a transfer event on successful burning", async function() {
      await erc20.transfer(addr1.address, 100);
      await expect(erc20.connect(addr1).burn(50))
          .to.emit(erc20, 'Transfer')
          .withArgs(addr1.address, ethers.constants.AddressZero, 50);
  });
});



});
