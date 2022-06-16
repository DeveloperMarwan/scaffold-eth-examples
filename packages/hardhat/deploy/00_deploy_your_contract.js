// deploy/00_deploy_your_contract.js

const { ethers, upgrades } = require("hardhat");

// const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log("chainId: ", chainId);

  await deploy("VoteToken", {
    from: deployer,
    log: true,
  });
  console.log("After VoteToken - Deploy");

  // Getting a previously deployed contract
  const voteToken = await ethers.getContract("VoteToken", deployer);
  /*
  console.log("BEFORE VoteTokenV1 - Deploy");
  const voteTokenV1Factory = await ethers.getContractFactory("VoteTokenV1");
  console.log("VoteTokenV1Factory: ", voteTokenV1Factory);
  const voteTokenV1 = await upgrades.deployProxy(voteTokenV1Factory, {
    kind: "uups",
  });
  console.log("VoteTokenV1 - voteTokenV1: ", voteTokenV1);
  console.log("AFTER VoteTokenV1 - Deploy");
  */

  // transfer 20 vote tokens
  /*
  await voteToken.transfer(
    "0x7C04681be730c2f418884036b5D9Bb94573d71B1",
    ethers.utils.parseEther("30")
  );

  await voteToken.transfer(
    "0xFa2905794A52cC086dcE056b441A21eB963CC7EF",
    ethers.utils.parseEther("30")
  );

  await voteToken.transfer(
    "0xe533a62026fd9F3F362c7506f7f2Bd5332e37BBa",
    ethers.utils.parseEther("30")
  );

  await voteToken.transfer(
    "0x5755ce1779C4A071f9aEcd0042F224957c121E1C",
    ethers.utils.parseEther("30")
  );

  await voteToken.transfer(
    "0x140D36b05111B1108ABDAfDEF2cd03359FA239ff",
    ethers.utils.parseEther("30")
  );

  await voteToken.transfer(
    "0xe533a62026fd9F3F362c7506f7f2Bd5332e37BBa",
    ethers.utils.parseEther("30")
  );

  console.log("After VoteToken - Transfers");
  // 0xD1766A94ceF16D6A893fA2C5dC210EE13Cc79b24
  // 0x5755ce1779C4A071f9aEcd0042F224957c121E1C
  // 0x140D36b05111B1108ABDAfDEF2cd03359FA239ff (William)
  */
  console.log("Before VoteTokenFactory - Deploy");
  await deploy("VoteTokenFactory", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("After VoteTokenFactory - Deploy");
  const voteTokenFactory = await ethers.getContract(
    "VoteTokenFactory",
    deployer
  );

  console.log("Before VoteGovernorFactory_V3 - Deploy");
  await deploy("VoteGovernorFactory_V3", {
    from: deployer,
    args: [voteTokenFactory.address],
    log: true,
  });
  console.log("After VoteGovernorFactory_V3 - Deploy");

  const voteGovernorFactory_v3 = await ethers.getContract(
    "VoteGovernorFactory_V3",
    deployer
  );

  await voteGovernorFactory_v3.transferOwnership(
    "0x5755ce1779C4A071f9aEcd0042F224957c121E1C"
  );
  console.log("After VoteGovernorFactory_V3 - transferOwnership");

  /*
  console.log("Before VoteGovernorFactory_V2 - Deploy");
  await deploy("VoteGovernorFactory_V2", {
    from: deployer,
    args: [],
    log: true,
  });
  console.log("After VoteGovernorFactory_V2 - Deploy");

  const voteGovernorFactory_v2 = await ethers.getContract(
    "VoteGovernorFactory_V2",
    deployer
  );

  await voteGovernorFactory_v2.transferOwnership(
    "0x5755ce1779C4A071f9aEcd0042F224957c121E1C"
  );
  console.log("After VoteGovernorFactory_V2 - transferOwnership");
  */

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
      address: voteGovernorFactory.address,
      contract: "contracts/YourContract.sol:YourContract",
      contractArguments: [],
    });
  }
  */
};
module.exports.tags = ["voteToken", "voteGovernorFactory_v3"];
