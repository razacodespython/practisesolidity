import pytest
from brownie import accounts, SimpleStorage, StorageFactory

def test_simple_storage_contract():
    # Deploy the SimpleStorage contract
    simple_storage = SimpleStorage.deploy({'from': accounts[0]})

    # Store a favorite number
    favorite_number = 42
    simple_storage.store(favorite_number, {'from': accounts[0]})

    # Retrieve the stored favorite number
    retrieved_favorite_number = simple_storage.retrieve()
    
    # Assert the retrieved favorite number matches the stored value
    assert retrieved_favorite_number == favorite_number, "Stored and retrieved favorite numbers should match"

def test_storage_factory_contract():
    # Deploy the StorageFactory contract
    storage_factory = StorageFactory.deploy({'from': accounts[0]})

    # Create a new SimpleStorage contract via StorageFactory
    storage_factory.createSimpleStorageContract({'from': accounts[0]})

    # Get the first SimpleStorage contract address from the StorageFactory
    simple_storage_address = storage_factory.listOfSimpleStorageContracts(0)

    # Get the SimpleStorage contract instance from the address
    simple_storage = SimpleStorage.at(simple_storage_address)

    # Store a favorite number in the first SimpleStorage contract via StorageFactory
    favorite_number = 100
    storage_factory.sfStore(0, favorite_number, {'from': accounts[0]})

    # Retrieve the favorite number from the first SimpleStorage contract via StorageFactory
    retrieved_favorite_number = storage_factory.sfGet(0)

    # Assert the retrieved favorite number matches the stored value
    assert retrieved_favorite_number == favorite_number, "Stored and retrieved favorite numbers should match"