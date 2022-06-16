/* eslint-disable camelcase */
// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log("chainId: ", chainId);

  await deploy("SalientYachtsSYNFT", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [],
    log: true,
  });
  console.log("After await deploy SalientYachtsSYNFT...");

  // Getting a previously deployed contract
  const salientYachtsSYNFT = await ethers.getContract(
    "SalientYachtsSYNFT",
    deployer
  );
  console.log("After const SalientYachtsSYNFT =...");

  salientYachtsSYNFT.transferOwnership(
    "0x5755ce1779C4A071f9aEcd0042F224957c121E1C"
  );
  console.log("After salientYachtsSYNFT.transferOwnership...");

  /*  await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify your contracts with Etherscan
  // You don't want to verify on localhost
  /*
  if (chainId !== localChainId) {
    await run("verify:verify", {
      address: salientYachtsNFTContract.address,
      contract: "contracts/SalientYachtsNFT.sol:SalientYachtsNFT",
      contractArguments: [],
    });
  }
  */
};
module.exports.tags = ["salientYachtsSYNFT"];
