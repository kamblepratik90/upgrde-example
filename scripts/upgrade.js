// scripts/prepare_upgrade.js
async function main() {
  const proxyAddress = "0xE0bBB141051E8e9808090aD3f15e54c755740A8f";

  const BoxV2 = await ethers.getContractFactory("BoxV2");
  console.log("Preparing upgrade...");
  const box = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  console.log("BoxV2 at:", box.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
