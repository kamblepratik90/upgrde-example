// const { ethers } = require("ethers");
const { ethers } = require("hardhat");
const {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
  default: Safe,
} = require("@gnosis.pm/safe-core-sdk");

const {
  SafeTransactionDataPartial,
} = require("@gnosis.pm/safe-core-sdk-types");

const Abi = require("../artifacts/contracts/Box.sol/Box.json").abi;

const NODE_URL =
  // "https://eth-rinkeby.alchemyapi.io/v2/W7xdeF1I5yzryiFdqL8ziMqGCZrRQrnQ";
  // "https://speedy-nodes-nyc.moralis.io/5f1205910f0abf7df5c1a750/eth/rinkeby";
  "https://speedy-nodes-nyc.moralis.io/1dd7e4f38823c504f532c532/polygon/mumbai/archive";
const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

// Genosis safe
const safeAddress = "0x77C5e893F7441BcF41E400F5802dBb34638B40Ef"; // "0x3F838eBfDA3c3F44eAC421A1DC5b22E98Ea64a7a";

let owner1, owner2;

// account = 0x45B88cE0844F7BF2F6D466CF921a98F1Fb487f7D
// const account1PrivateKey36 =
//   "";
// account = 0x12C65BF8023b36D28c723A74fd6B4AfeFE697940
const account2PrivateKeyA1 = pk;

// const signer = new ethers.Wallet(account1PrivateKey36, provider);
const signer2 = new ethers.Wallet(account2PrivateKeyA1, provider);
let ethAdapterOwner1, ethAdapterOwner2;
ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signer: signer2,
});

let safeSdk;
let startTime, endTime;

const initSigners = async () => {
  [owner1, owner2] = await ethers.getSigners();
  ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signer: owner1,
    // contractNetworks: { id: 4 },
    contractNetworks: { id: 80001 },
  });
  // ethAdapterOwner2 = new EthersAdapter({
  //   ethers,
  //   signer: owner2,
  // });

  console.log("ethAdapterOwner1: ", JSON.stringify(ethAdapterOwner1));
  console.log("ethAdapterOwner2: ", JSON.stringify(ethAdapterOwner2));
};

const deploy = async () => {
  const owners = [
    "0x45B88cE0844F7BF2F6D466CF921a98F1Fb487f7D",
    "0x12C65BF8023b36D28c723A74fd6B4AfeFE697940",
  ];
  const threshold = 2;
  // const safeAccountConfig = { owners, threshold };
  const safeAccountConfig = {
    owners,
    threshold,
  };
  const safeFactory = await SafeFactory.create({
    ethAdapterOwner1,
    contractNetworks: { id: 4 },
  });
  safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig);
  const newSafeAddress = safeSdk.getAddress();

  console.log("new safte addtess " + newSafeAddress);
};

const getSafe = async () => {
  safeSdk = await Safe.create({
    ethAdapter: ethAdapterOwner1,
    safeAddress: safeAddress,
    // contractNetworks: { id: 4 },
    contractNetworks: { id: 80001 },
  });
  // console.log(safeSdk);

  const newSafeAddress = safeSdk.getAddress();
  console.log("address: ", newSafeAddress);
};

const createTrans = async () => {
  console.log("** createTrans ***");

  const myContract = new ethers.Contract(
    // "0x9C1CfCc5384B53E1756E96838e5c80287e81aB71",// proxy
    "0xA64142C327D26eE539cF26800c9EF56A1b86503e", // implementation
    Abi,
    owner1
  ); // Write only

  const transactions = await myContract.populateTransaction.store(58);
  transactions.value = 0;
  console.log("transactions");
  console.log(transactions);

  // const transactions = [
  //   {
  //     to: "0x9C1CfCc5384B53E1756E96838e5c80287e81aB71",
  //     value: 44,
  //     data: "0x6dd5e67c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000000000b6a656576616e6768756c65000000000000000000000000000000000000000000",
  //   },
  // ];
  // const safeTransaction = await safeSdk.createTransaction(...transactions);
  const safeTransaction = await safeSdk.createTransaction(transactions);
  console.log("safeTransaction: ", safeTransaction);

  const txHash = await safeSdk.getTransactionHash(safeTransaction);
  console.log("txHash");
  console.log(txHash);
  const approveTxResponse = await safeSdk.approveTransactionHash(txHash);
  console.log("approveTxResponse");
  console.log(approveTxResponse);
  const end = await approveTxResponse.transactionResponse?.wait();
  console.log("end");
  console.log(end);

  const owners = await safeSdk.getOwnersWhoApprovedTx(txHash);

  console.log("owners");
  console.log(owners);

  // other owner
  const safeSdk2 = await safeSdk.connect({
    ethAdapter: ethAdapterOwner2,
    safeAddress,
  });
  const txHash2 = await safeSdk2.getTransactionHash(safeTransaction);
  console.log("txHash2");
  console.log(txHash2);
  const approveTxResponse2 = await safeSdk2.approveTransactionHash(txHash2);
  await approveTxResponse2.transactionResponse?.wait();

  const owners2 = await safeSdk2.getOwnersWhoApprovedTx(txHash);

  console.log("owners2");
  console.log(owners2);

  console.log("executeTxResponse Transation");
  const executeTxResponse = await safeSdk2.executeTransaction(safeTransaction);
  console.log(executeTxResponse);
  const res = await executeTxResponse.transactionResponse?.wait();
  console.log("EXECTUTEEEE");
  console.log(res);
};
const signerFunctions = async (signer) => {
  const { chainId } = await provider.getNetwork();
  console.log(chainId);
  console.log("** signerFunctions ***");
  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const getGasPrice = await signer.getGasPrice();
  console.log("ADDRESS = " + address);
  console.log("BALANCE = " + balance.toString());
  console.log("getGasPrice = " + getGasPrice.toString());
};

function start() {
  startTime = new Date();
}

function end() {
  endTime = new Date();
  let timeDiff = endTime - startTime; // in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  const seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}

async function main() {
  try {
    console.log("Hello");
    start();

    await initSigners();

    // await signerFunctions(owner1);
    // await signerFunctions(signer2);
    // await deploy();
    await getSafe();
    await createTrans();

    // await signerFunctions(owner1);
    // await signerFunctions(signer2);
    end();
  } catch (error) {
    console.log(error);
    end();
  }
}
main();
