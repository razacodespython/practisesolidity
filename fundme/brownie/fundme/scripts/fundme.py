from brownie import FundMe, accounts

account = accounts.load("my-new-account")

def main():
    return FundMe.deploy({'from': account})