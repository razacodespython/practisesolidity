from ape import accounts, project

def main(): 
      # Initialize deployer account and print balance 
    dev_account = accounts.load("scrolltest") 
    print(f'The account balance is: {dev_account.balance / 1e18} ETH')  
     # Deploy the smart contract and print a message 
    dev_account.deploy(project.EtherWallet) 
    print("Contract deployed!") 