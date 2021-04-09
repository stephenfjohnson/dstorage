const DStorage = artifacts.require('DStorage');
const DGram = artifacts.require('DStorage');

module.exports = function (deployer) {
  //Deploy Contract
  deployer.deploy(DStorage);
  deployer.deploy(DGram);
};
