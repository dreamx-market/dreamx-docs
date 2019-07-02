const { soliditySha3 } = require("web3-utils");
const {
  hashPersonalMessage,
  toBuffer,
  ecsign,
  toRpcSig,
  bufferToHex
} = require("ethereumjs-util");

/**
 * https://api.dreamx.market/return_contract_address
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
const accountAddress = "0xa77344043e0b0bada9318f41803e07e9dfc57b0b";
const accountPrivateKey =
  "0xf1caff04b5ff349674820a4eb6ee11c459ad3698ca581c8a8e82ee09591b7aa2";

/**
 * The amount to be traded
 */
const amount = "100000000000000000000";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1551039552000;

const tradeHash = soliditySha3(
  contractAddress,
  orderHash,
  accountAddress,
  amount,
  nonce
);
const saltedTradeHash = hashPersonalMessage(toBuffer(tradeHash));
const vrs = ecsign(saltedTradeHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`contract_address: ${contractAddress}`);
console.log(`order_hash: ${orderHash}`);
console.log(`account_address: ${accountAddress}`);
console.log(`amount: ${amount}`);
console.log(`nonce: ${nonce}`);
console.log(`trade_hash: ${tradeHash}`);
console.log(`salted_trade_hash: ${bufferToHex(saltedTradeHash)}`);
console.log(`signature: ${signature}`);
