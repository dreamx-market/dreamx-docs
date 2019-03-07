const { soliditySha3 } = require("web3-utils");
const {
  hashPersonalMessage,
  toBuffer,
  ecsign,
  toRpcSig
} = require("ethereumjs-util");

/**
 * https://api.ninja.trade/return_contract_address
 */
const contractAddress = "0x4ef6474f40bf5c9dbc013efaac07c4d0cb17219a";

/**
 * The hash of the order to be traded
 */
const orderHash =
  "0x0af93d915d9a51b02decd8aa3eb178834ef27e2bde33356989e834c742e27f4e";

/**
 * Your wallet's address and private key, address and privateKey are only exemplar and are to be replaced
 */
const accountAddress = "0xbfd525710ecb49a266337683971bac0d72d746a6";
const accountPrivateKey =
  "0x24b39c598f81d10af245a6b0c1733be41b63ce4d7ea2e694535a2d1c3730c7b9";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1551351258000;

const cancelHash = soliditySha3(
  contractAddress,
  accountAddress,
  orderHash,
  nonce
);
const saltedCancelHash = hashPersonalMessage(toBuffer(cancelHash));
const vrs = ecsign(saltedCancelHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`account_address: ${accountAddress}`);
console.log(`order_hash: ${orderHash}`);
console.log(`nonce: ${nonce}`);
console.log(`cancel_hash: ${cancelHash}`);
console.log(`signature: ${signature}`);
