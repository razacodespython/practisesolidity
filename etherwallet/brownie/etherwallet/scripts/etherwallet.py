#!/usr/bin/python3

from brownie import EtherWallet, accounts

account = accounts.load("my-new-account")

def main():
    return EtherWallet.deploy({'from': account})
