
import pytest
from brownie import SimpleStorage, accounts

def test_simple_storage():
    # Deploy the contract
    simple_storage = SimpleStorage.deploy({'from': accounts[0]})

    # Test storing and retrieving a favorite number
    favorite_number = 42
    simple_storage.store(favorite_number, {'from': accounts[0]})
    stored_favorite_number = simple_storage.retrieve({'from': accounts[0]})
    assert stored_favorite_number == favorite_number, "Favorite number was not stored correctly"

    # Test adding a person to the list
    name = "Alice"
    favorite_number = 7
    simple_storage.addPerson(name, favorite_number, {'from': accounts[0]})
    person = simple_storage.listOfPeople(0, {'from': accounts[0]})
    print(person)
    assert person[1] == name, "Name of the person was not added correctly"
    assert person[0] == favorite_number, "Favorite number of the person was not added correctly"
    
    # Test mapping a name to a favorite number
    name = "Bob"
    favorite_number = 10
    simple_storage.addPerson(name, favorite_number, {'from': accounts[0]})
    mapped_favorite_number = simple_storage.nameToFavoriteNumber(name, {'from': accounts[0]})
    assert mapped_favorite_number == favorite_number, "Favorite number was not mapped correctly"