
from brownie import (
    accounts,
    SimpleFlashLoan,
    Contract,
    Wei, 
)
import pytest



#from brownie.project import build

IERC20_ABI = [
     {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }

]

#@pytest.mark.require_network("scroll")
def test_flash_loan():
    # Deploy the SimpleFlashLoan contract
    account = accounts.load("my-new-account")
    pool_address = "0x52A27dC690F8652288194Dd2bc523863eBdEa236"  # Replace this with the actual address of the PoolAddressesProvider
    flash_loan_example = SimpleFlashLoan.deploy(pool_address, {'from': account})
    flash_loan_example.deployed()

    print("Contract Address:", flash_loan_example.address)

    # Get the USDC contract instance
    usdc_address = "0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D"  # Replace this with the actual address of the USDC contract
    # token = IERC20.at(usdc_address)
    token = Contract.from_abi("IERC20", usdc_address, IERC20_ABI)
    print("USDC Contract Address:", token.address)

    # Impersonate the USDC_WHALE account to be able to send transactions from that account
    whale_address = "0x6340223526AfF6887093fA9968a01A19d2503C66"  # Replace this with the actual address of the USDC_WHALE account
    signer = accounts.at(whale_address)

    signer_balance_before = token.balanceOf(signer)
    print("Signer USDC Balance Before Sending:", signer_balance_before)

    # Send USDC to the flash loan contract
    contract_balance = token.balanceOf(flash_loan_example.address)
    print("Flash Loan Contract USDC Balance Before Transfer:", contract_balance)

    token.transfer(flash_loan_example.address, 10000000, {"from": signer})

    contract_balance_after_transfer = token.balanceOf(flash_loan_example.address)
    print("Flash Loan Contract USDC Balance After Transfer:", contract_balance_after_transfer)

    # Execute the flash loan
    flash_loan_example.fn_RequestFlashLoan(usdc_address, 100000, {"from": accounts[0]})

    remaining_balance = token.balanceOf(flash_loan_example.address)
    assert remaining_balance < 10000000  # We must have less than 10,000,000 USDC now, since the premium was paid from our contract's balance
