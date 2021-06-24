// migrations/2_deploy_contracts.js

var TodoList = artifacts.require("./TodoList.sol"); // import smart contract TodoList and assign to variable

module.exports = function(deployer) {
  deployer.deploy(TodoList);  // deploy smart contract to blockchain
};
