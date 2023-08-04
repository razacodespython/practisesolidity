#!/usr/bin/python3

from brownie import SimpleFlashLoan, accounts

pool_address = "0x52A27dC690F8652288194Dd2bc523863eBdEa236"
account = accounts.load("my-new-account")
def main():
    return SimpleFlashLoan.deploy(pool_address, {'from': account})
