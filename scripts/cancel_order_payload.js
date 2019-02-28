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
  "0x57a69889d35410e74bed6f1b6849868da2d0b062b47c87b6d11ba894f3690633";

/**
 * Your wallet's address and private key, address and privateKey are only exemplar and are to be replaced
 */
const accountAddress = "0xe37a4faa73fced0a177da51d8b62d02764f2fc45";
const accountPrivateKey =
  "0xd15b17f51f613d0d89c64c7b629ffff7ae9c19e509afc9518dac1650e9812c18";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1551351258000;

const cancelHash = soliditySha3(contractAddress, orderHash, nonce);
const saltedCancelHash = hashPersonalMessage(toBuffer(cancelHash));
const vrs = ecsign(saltedCancelHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`account_address: ${accountAddress}`);
console.log(`order_hash: ${orderHash}`);
console.log(`nonce: ${nonce}`);
console.log(`cancel_hash: ${cancelHash}`);
console.log(`signature: ${signature}`);
