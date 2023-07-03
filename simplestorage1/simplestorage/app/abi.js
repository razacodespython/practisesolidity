export const abi =[
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "_name",
		  "type": "string"
		},
		{
		  "internalType": "uint256",
		  "name": "_favoriteNumber",
		  "type": "uint256"
		}
	  ],
	  "name": "addPerson",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "uint256",
		  "name": "_favoriteNumber",
		  "type": "uint256"
		}
	  ],
	  "name": "store",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "uint256",
		  "name": "",
		  "type": "uint256"
		}
	  ],
	  "name": "listOfPeople",
	  "outputs": [
		{
		  "internalType": "uint256",
		  "name": "favoriteNumber",
		  "type": "uint256"
		},
		{
		  "internalType": "string",
		  "name": "name",
		  "type": "string"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "string",
		  "name": "",
		  "type": "string"
		}
	  ],
	  "name": "nameToFavoriteNumber",
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
	  "name": "retrieve",
	  "outputs": [
		{
		  "components": [
			{
			  "internalType": "uint256",
			  "name": "favoriteNumber",
			  "type": "uint256"
			},
			{
			  "internalType": "string",
			  "name": "name",
			  "type": "string"
			}
		  ],
		  "internalType": "struct SimpleStorage.Person[]",
		  "name": "",
		  "type": "tuple[]"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	}
  ]