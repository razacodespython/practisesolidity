const FlashLoan = artifacts.require("SimpleFlashLoan")
const poolAddress = "0x52A27dC690F8652288194Dd2bc523863eBdEa236"
module.exports = function(deployer){
    deployer.deploy(FlashLoan,poolAddress)
}