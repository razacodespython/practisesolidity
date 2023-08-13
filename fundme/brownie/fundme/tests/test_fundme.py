from brownie import accounts, FundMe, MockV3Aggregator, exceptions
import pytest

def test_can_fund_and_withdraw():
    # Deployer's account
    deployer = accounts[0]
    # Accounts for testing
    addr1 = accounts[1]
    addr2 = accounts[2]
    
    # Deploy the MockV3Aggregator contract for the Chainlink price feed
    price_feed_mock = MockV3Aggregator.deploy(8, 200000000000, {"from": deployer})
    
    # Deploy the FundMe contract and pass the mock price feed address as an argument
    fund_me = FundMe.deploy({"from": deployer})
    entrance_fee = 1000000000000000000
    tx = fund_me.fund({"from": addr1, "value": entrance_fee})
    tx.wait(1)
    assert fund_me.addressToAmountFunded(addr1.address) == entrance_fee
    tx2 = fund_me.withdraw({"from": deployer})
    tx2.wait(1)
    assert fund_me.addressToAmountFunded(addr1.address) == 0


def test_only_owner_can_withdraw():
     # Deployer's account
    deployer = accounts[0]
    # Accounts for testing
    addr1 = accounts[1]
    addr2 = accounts[2]
    
    # Deploy the FundMe contract and pass the mock price feed address as an argument
    fund_me = FundMe.deploy({"from": deployer})
    bad_actor = addr2
    with pytest.raises(exceptions.VirtualMachineError):
        fund_me.withdraw({"from": bad_actor})
# def test_fundme():
#     # Deployer's account
#     deployer = accounts[0]
#     # Accounts for testing
#     addr1 = accounts[1]
#     addr2 = accounts[2]
    
#     # Deploy the MockV3Aggregator contract for the Chainlink price feed
#     price_feed_mock = MockV3Aggregator.deploy(8, 200000000000, {"from": deployer})
    
#     # Deploy the FundMe contract and pass the mock price feed address as an argument
#     fund_me = FundMe.deploy({"from": deployer})
    
#     # Check if the owner is set correctly
#     assert fund_me.owner() == deployer
    
#     # Fund the contract and record the funds
#     amount = web3.toWei(1, "ether")
#     fund_me.fund({"from": addr1, "value": amount})
#     assert fund_me.addressToAmountFunded(addr1.address) == amount
#     assert fund_me.funders(0) == addr1.address
    
#     # Check that minimum funding requirement is enforced
#     invalid_amount = web3.toWei(0.01, "ether")
#     with reverts("You need to spend more ETH!"):
#         fund_me.fund({"from": addr1, "value": invalid_amount})
    
#     valid_amount = web3.toWei(2, "ether")
#     fund_me.fund({"from": addr1, "value": valid_amount})
    
#     # Allow the owner to withdraw the funds
#     initial_balance = deployer.balance()
#     fund_me.fund({"from": addr1, "value": amount})
#     balance_before = deployer.balance()
    
#     gas_price = web3.eth.gasPrice  # Corrected this line
#     withdraw_tx = fund_me.withdraw({"from": deployer})
#     withdraw_receipt = withdraw_tx.wait(1)  # Wait for the receipt
    
#     if withdraw_receipt is not None and 'gasUsed' in withdraw_receipt:
#         act_gas = withdraw_receipt['gasUsed'] * gas_price
        
#         balance_after = deployer.balance()
#         console_expected_balance = balance_before + (amount - withdraw_receipt['gasUsed'] * gas_price)
#         expected_balance_change = amount - act_gas
        
#         final_check = balance_after - console_expected_balance
        
#         assert balance_after == console_expected_balance
        
#         # Check if funders array is empty
#         with reverts():
#             fund_me.funders(0)
        
#         # Check if mapping for sender which funded is set to 0
#         assert fund_me.addressToAmountFunded(addr1.address) == 0
        
#         # Check if only owner can withdraw amount
#         with reverts():
#             fund_me.withdraw({"from": addr1})
        
#         # ... rest of the test ...
#     else:
#         assert False, "Transaction failed or receipt not available"

