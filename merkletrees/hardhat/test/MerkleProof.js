const { expect } = require("chai");

describe("TestMerkleProof", function() {
  let TestMerkleProof, testMerkleProof;
  
  beforeEach(async function() {
    // Getting the ContractFactory and Signers here.
    TestMerkleProof = await ethers.getContractFactory("TestMerkleProof");
    
    // Deploying our contract
    testMerkleProof = await TestMerkleProof.deploy();
    await testMerkleProof.deployed();
  });

  // Test case: Ensure the contract is deployed successfully
  it("Should be deployed successfully", async function() {
    expect(testMerkleProof.address).to.properAddress;
  });

  // Test case: Validate the root of the Merkle Tree
  it("Should return the correct Merkle root", async function() {
    const expectedRoot = "0xcc086fcc038189b4641db2cc4f1de3bb132aefbd65d510d817591550937818c7";
    expect(await testMerkleProof.getRoot()).to.equal(expectedRoot);
  });

  // Test case: Verify Merkle Proof for given data (you can add more details based on your contract's logic)
  it("Should verify the Merkle proof correctly", async function() {
    const leaf = "0xdca3326ad7e8121bf9cf9c12333e6b2271abe823ec9edfe42f813b1e768fa57b";
    const root = "0xcc086fcc038189b4641db2cc4f1de3bb132aefbd65d510d817591550937818c7";
    const index = 2;
    const proof = [
      "0x8da9e1c820f9dbd1589fd6585872bc1063588625729e7ab0797cfc63a00bd950",
      "0x995788ffc103b987ad50f5e5707fd094419eb12d9552cc423bd0cd86a3861433"
    ];
    const isValid = await testMerkleProof.verify(proof, root, leaf, index);
    expect(isValid).to.be.true;
  });

  // Add more tests as required for other functionality.
});
