import pytest
from brownie import Wei, EtherWallet, accounts

@pytest.fixture(scope="module")
def ether_wallet():
    return EtherWallet.deploy({'from': accounts[0]})

def test_initial_balance(ether_wallet):
    assert ether_wallet.getBalance() == Wei("0"), "Initial balance should be zero"

def test_deposit_funds(ether_wallet, accounts):
    print(ether_wallet.getBalance())
    deposit_amount = Wei("1 ether")
    accounts[0].transfer(ether_wallet, deposit_amount)
    print(ether_wallet.getBalance())
    assert ether_wallet.getBalance() == deposit_amount, "Wallet balance should be equal to the deposit amount"

def test_withdraw_funds(ether_wallet, accounts):
    initial_balance = ether_wallet.getBalance()
    transfer_amount = Wei("1 ether")
    accounts[0].transfer(ether_wallet, transfer_amount)
    print(ether_wallet.getBalance())
    withdrawal_amount = Wei("0.5 ether")
    ether_wallet.withdraw(withdrawal_amount, {'from': accounts[0]})
    print(ether_wallet.getBalance())
    expected_balance = initial_balance + transfer_amount - withdrawal_amount  # Fix the calculation here
    assert ether_wallet.getBalance() == expected_balance, "Wallet balance should be equal to the initial balance minus the withdrawal amount"

def test_only_owner_can_withdraw_funds(ether_wallet, accounts):
    attacker = accounts[1]
    initial_balance = Wei("1 ether")
    accounts[0].transfer(ether_wallet, initial_balance)
    withdrawal_amount = Wei("0.5 ether")

    with pytest.raises(Exception, match="caller is not owner"):
        ether_wallet.withdraw(withdrawal_amount, {'from': attacker})
