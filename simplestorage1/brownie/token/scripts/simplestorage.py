from brownie import SimpleStorage, accounts

account = accounts.load("my-new-account")

def main():
    return SimpleStorage.deploy({'from': account})