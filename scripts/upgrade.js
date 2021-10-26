// scripts/prepare_upgrade.js
async function main() {
  const proxyAddress = "0x1c40F2F3567C2940F25B94a279dC8105Cc0a0af1";

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
