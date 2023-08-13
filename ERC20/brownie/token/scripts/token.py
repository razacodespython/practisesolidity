#!/usr/bin/python3

from brownie import Token, accounts

account = accounts.load("my-new-account")

def main():
    return Token.deploy("Test Token", "TST", 18, 1e21, {'from': account})
