var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Adoption);
};

// 合约需要区块链环境 所以我们用ganance给模拟一个环境
