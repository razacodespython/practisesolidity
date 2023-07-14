// SPDX-License-Identifier: MIT

const SimpleStorage = artifacts.require('SimpleStorage');

contract('SimpleStorage', (accounts) => {
  let simpleStorage;

  before(async () => {
    simpleStorage = await SimpleStorage.deployed();
  });

  it('should store the favorite number', async () => {
    const favoriteNumber = 42;
    await simpleStorage.store(favoriteNumber);
    const storedFavoriteNumber = await simpleStorage.retrieve();
    assert.equal(storedFavoriteNumber, favoriteNumber, 'Favorite number was not stored correctly');
  });

  it('should add a person to the list', async () => {
    const name = 'Alice';
    const favoriteNumber = 7;
    await simpleStorage.addPerson(name, favoriteNumber);
    const person = await simpleStorage.listOfPeople(0);
    assert.equal(person.favoriteNumber, favoriteNumber, 'Favorite number of the person was not added correctly');
    assert.equal(person.name, name, 'Name of the person was not added correctly');
  });

  it('should map a name to a favorite number', async () => {
    const name = 'Bob';
    const favoriteNumber = 10;
    await simpleStorage.addPerson(name, favoriteNumber);
    const mappedFavoriteNumber = await simpleStorage.nameToFavoriteNumber(name);
    assert.equal(mappedFavoriteNumber, favoriteNumber, 'Favorite number was not mapped correctly');
  });
});