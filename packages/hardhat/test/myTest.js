const { ethers, upgrades } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("VoteTokenV1", function () {
  let voteTokenProxy;
  it("deploys", async function () {
    const voteTokenV1 = await ethers.getContractFactory("VoteTokenV1");
    voteTokenProxy = await upgrades.deployProxy(voteTokenV1, { kind: "uups" });
    console.log("deploys - voteTokenProxy", voteTokenProxy.address);
  });
  it("upgrades", async function () {
    const voteTokenV2 = await ethers.getContractFactory("VoteTokenV2");
    voteTokenProxy = await upgrades.upgradeProxy(voteTokenProxy, voteTokenV2);
    console.log("upgrades - voteTokenProxy", voteTokenProxy.address);
    let newVar = await voteTokenProxy.newVar();
    console.log("newVar: ", newVar);
    await voteTokenProxy.setNewVar(10);
    newVar = await voteTokenProxy.newVar();
    console.log("newVar: ", newVar);
  });
});
