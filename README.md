# Building Dapp with Ethereum

## Install development tools
1. Download a personal blockchain for local dev
- Get a development blockchain framework to develop locally
- Download [Ganache](https://www.trufflesuite.com/ganache)
- Will have accounts with ether for local blockchain, along with the IP address for RPC Server for dapp to connect to blockchain

2. Download and install the Truffle framework on Node.js
```
$ npm install -g truffle
// $ npm install -g truffle@5.0.2   // include version for DappU tutorial
```

3. Connect your browser to the blockchain network using Metamask
- Download Metamask extension for Google Chrome, which is an Ethereum wallet for the browser
- Add local network for Ganache private blockchain to Metamask in Chrome browser:
```
Network Name: Ganache private blockchain
New RPC URL: HTTP://127.0.0.1:7545
Chain ID: 1337  // from Ganache docs via StackOverflow Q&A
```
- Connect Ganache blockchain account to MetaMask: Get private key from an account in Ganache, then "Import Account" in MetaMask by pasting private key.

## Set up project

1. Make and change into root directory
```
$ mkdir root
$ cd root
```

2. Initialize new Truffle project 
```
truffle init
```

3. Create package.json with following config
```
{
  "name": "todo-list",
  "version": "0.1.0",
  "description": "",
  "main": "truffle-config.js",
  "directories": {
    "test": "test"
  },
  "scripts": {
    "dev": "lite-server",
    "test": "echo \"Error: no test specified\" && sexit 1"
  },
  "author": "",
  "license": "ISC"
  "devDependencies": {
    // can declare packages with their versions for DappU tutorial

    <!-- "bootstrap": "4.1.3",
    "chai": "^4.1.2",
    "chai-as-promised": "^7.1.1",
    "chai-bignumber": "^2.0.2",
    "lite-server": "^2.3.0",
    "nodemon": "^1.17.3",
    "truffle": "5.0.2",
    "truffle-contract": "3.0.6" -->
  }
}
```

4. Install dependencies
```
$ npm i -S bootstrap chai chai-as-promised chai-bignumber lite-server nodemon truffle truffle-contract
```

5. Initialize git and set up .gitignore
```
$git init
```
```
// .gitignore

.DS_Store

node_modules

```

## Developing with Truffle on Back-End
1. Truffle commands. Should execute the following before deploying any smart contracts or updates.
```
    $truffle compile    // creates build file called ABI file in build/contracts dir
    $truffle test       // runs tests on code
    $truffle migrate [--reset]   // migrate to deploy on blockchain, must use reset param to deploy a new updated contract, since public blockchain is immutable 
    
```

2. Local dev: Set configuration for connecting to local blockchain network (Ganache)  
```
// settings for local dev using Ganache personal blockchain provided by tutorial

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

3. Create a migration file for deploying smart contract to blockchain
```
$ touch migrations/2_deploy_contracts.js
```

4. Put following code in 2_deploy_contracts.js file (after writing a smart contract, TodoList in this example)
```
// migrations/2_deploy_contracts.js

var TodoList = artifacts.require("./TodoList.sol"); // import smart contract TodoList and assign to variable

module.exports = function(deployer) {
  deployer.deploy(TodoList);  // deploy smart contract to blockchain
};

```

5. Deploy smart contract. Do so after every time you change code of a smart contract, in order to update state on Ethereum network.
```
$ truffle migrate
```

6. Interact with deployed smart contract using CLI
```
$ truffle console

todoList = await TodoList.deployed()  // retrieved deployed smart contract

todoList.address  // retrieve address of smart contract on blockchain
// o: '0xABC123...'

todoList.taskCount() // read taskCount state variable inside of smart contract TodoList

todoList.tasks(1) // access an item in 'tasks' mapping with key '1'

```

## Developing with Truffle on Front-End 

0. Connecting to blockchain: Web3.JS connects front-end client side with blockchain, while MetaMask is Chrome plugin that connects browser to blockchain. 
- Connect Ganache blockchain account to MetaMask (if not done already): Get private key from an account in Ganache, then "Import Account" in MetaMask by pasting private key. 
- Connect Web3 to Ganache blockchain account: see loadAccount method in App.js.

1. Run front-end application 
```
$ npm run dev // runs on lite-server as defined in package.json
```

1. Create bs-config.json file to tell lite-server where to serve client-side files
```
// bs-config.json
{
  "server": {
    "baseDir": [
      "./src",    // exposes all files from /src and /build in root server
      "./build/contracts"
    ],
    "routes": {
      "/vendor": "./node_modules" // can use vendor instead of node_modules for route
    }
  }
}
```

2. Create "index.html" file (example: refer to index.html for TodoList here)

3. Create "app.js" file (example w/ comments: refer to app.js for TodoList here; step-by-step (vid explanation here at 40:25)[https://www.youtube.com/watch?t=40m25s&v=rzvk2kdjr2I&feature=youtu.be]). Great example of structuring native JS code with a sprinkle of jQuery.




