/* eslint-disable camelcase */
// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

// const localChainId = "31337";
// const localChainId = "43112";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  console.log("chainId: ", chainId);
  const ownerAddress = "0xe533a62026fd9F3F362c7506f7f2Bd5332e37BBa"; // DeveloperMarwan MM
  const DEFAULT_ADMIN_ROLE =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  await deploy("SalientYachtsReward", {
    from: deployer,
    log: true,
  });
  console.log("After await deploy SalientYachtsReward...");
  const salientYachtsReward = await ethers.getContract(
    "SalientYachtsReward",
    deployer
  );
  console.log("After const salientYachtsReward =...");

  // grant MINTER_ROLE to ownerAddress
  /*
  await salientYachtsReward.grantRole(
    ethers.utils.solidityKeccak256(["string"], ["MINTER_ROLE"]),
    ownerAddress
  );
  console.log("After salientYachtsReward.grantRole(MINTER_ROLE)");

  await salientYachtsReward.grantRole(DEFAULT_ADMIN_ROLE, ownerAddress);
  console.log("After salientYachtsReward.grantRole(DEFAULT_ADMIN_ROLE)");
  */

  const chainLinkPriceFeedAddr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"; // (BNB / USD) -- "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // https://docs.chain.link/docs/avalanche-price-feeds/ (AVAX/USD)

  await deploy("SalientYachtsSYONE_v07", {
    from: deployer,
    args: [salientYachtsReward.address, chainLinkPriceFeedAddr],
    log: true,
  });
  console.log("After await deploy SalientYachtsSYONE_v07...");

  // Getting a previously deployed contract
  const salientYachtsSYONE_v07 = await ethers.getContract(
    "SalientYachtsSYONE_v07",
    deployer
  );
  console.log("After const salientYachtsSYONE_v07 =...");

  // mint reward tokens for the NFT - 240 tokens per year -> ten years -> for 20000 NFT's
  /*
  await salientYachtsReward.mint(
    salientYachtsSYONE_v07.address,
    ethers.utils.parseEther(240 * 10 * 20000 + "")
  );
  console.log("After await salientYachtsReward.mint(...)");
  */

  // await salientYachtsSYONE_v07.toggleSaleActive();
  // console.log("After salientYachtsSYONE_v02.toggleSaleActive()...");

  // transfer ownership of the salientYachtsSYONE_v07 contract to ownerAddress
  await salientYachtsSYONE_v07.transferOwnership(ownerAddress);
  console.log("After await salientYachtsSYONE_v07.transferOwnership(...)");

  /* 
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
module.exports.tags = ["salientYachtsSYONE_v07"];
