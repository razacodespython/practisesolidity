from brownie import StorageFactory, accounts

account = accounts.load("my-new-account")

def main():
    return StorageFactory.deploy({'from': account})