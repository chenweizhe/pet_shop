const Migrations = artifacts.require("Migrations");
// 这是部署脚本 用来部署合约
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
