const SimpleStorage = artifacts.require("SimpleStorage");
const StorageFactory = artifacts.require("StorageFactory");

contract("TestStorageContracts", (accounts) => {
  // Test SimpleStorage contract
  it("should store and retrieve favorite number in SimpleStorage contract", async () => {
    const simpleStorageInstance = await SimpleStorage.new();
    const favoriteNumber = 42;

    // Store the favorite number in SimpleStorage contract
    await simpleStorageInstance.store(favoriteNumber);

    // Retrieve the favorite number from SimpleStorage contract
    const retrievedFavoriteNumber = await simpleStorageInstance.retrieve();

    // Assert the retrieved favorite number matches the stored value
    assert.equal(retrievedFavoriteNumber, favoriteNumber, "Stored and retrieved favorite numbers should match");
  });

  // Test StorageFactory contract
  it("should create and interact with SimpleStorage contracts via StorageFactory contract", async () => {
    const storageFactoryInstance = await StorageFactory.new();
    const favoriteNumber = 100;

    // Create a new SimpleStorage contract via StorageFactory
    await storageFactoryInstance.createSimpleStorageContract();

    // Get the first SimpleStorage contract address from the StorageFactory
    const simpleStorageAddress = await storageFactoryInstance.listOfSimpleStorageContracts(0);

    // Get the SimpleStorage contract instance from the address
    const simpleStorageInstance = await SimpleStorage.at(simpleStorageAddress);

    // Store the favorite number in the first SimpleStorage contract via StorageFactory
    await storageFactoryInstance.sfStore(0, favoriteNumber);

    // Retrieve the favorite number from the first SimpleStorage contract via StorageFactory
    const retrievedFavoriteNumber = await storageFactoryInstance.sfGet(0);

    // Assert the retrieved favorite number matches the stored value
    assert.equal(retrievedFavoriteNumber, favoriteNumber, "Stored and retrieved favorite numbers should match");
  });
});