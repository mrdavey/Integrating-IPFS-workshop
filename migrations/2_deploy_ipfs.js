var ipfs = artifacts.require("./ipfs.sol");

module.exports = function (deployer) {
    deployer.deploy(ipfs);
};
