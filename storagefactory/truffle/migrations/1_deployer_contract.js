
const Factory = artifacts.require("StorageFactory");

module.exports = function(deployer){
    deployer.deploy(Factory);
}