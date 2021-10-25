const { expect } = require("chai");
const { ethers } = require("hardhat");

let box;
let Box;

describe("Box (proxy)", function () {
  this.beforeEach(async () => {
    Box = await ethers.getContractFactory("Box");
    box = await upgrades.deployProxy(Box, [42], { initializer: "store" });
  });

  it("Returns the value previously initialised", async function () {
    expect(await box.retrieve()).to.equal("42");
  });
});
