const { soliditySha3 } = require("web3-utils");
const {
  hashPersonalMessage,
  toBuffer,
  ecsign,
  toRpcSig,
  bufferToHex
} = require("ethereumjs-util");

/**
 * https://api.ninja.trade/return_contract_address
 */
const contractAddress = "0x4ef6474f40bf5c9dbc013efaac07c4d0cb17219a";

/**
 * Your wallet's address and private key, address and privateKey are only exemplar and are to be replaced
 */
const accountAddress = "0xbfd525710ecb49a266337683971bac0d72d746a6";
const accountPrivateKey =
  "0x24b39c598f81d10af245a6b0c1733be41b63ce4d7ea2e694535a2d1c3730c7b9";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1550314094931;

/**
 * The expiry UNIX timestamp in milliseconds
 */
const expiryTimestampInMilliseconds = 4705572264000;

/**
 * Trade assets information
 */
const giveTokenAddress = "0x21921361bab476be44c0655256a2f4281bfcf07d"; // NJA
const giveAmount = "100000000000000000000"; // 100 NJA
const takeTokenAddress = "0x0000000000000000000000000000000000000000"; // ETH
const takeAmount = "500000000000000000"; // 0.5 ETH

const orderHash = soliditySha3(
  contractAddress,
  accountAddress,
  giveTokenAddress,
  giveAmount,
  takeTokenAddress,
  takeAmount,
  nonce,
  expiryTimestampInMilliseconds
);
const saltedOrderHash = hashPersonalMessage(toBuffer(orderHash));
const vrs = ecsign(saltedOrderHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`contract_address: ${contractAddress}`);
console.log(`account_address: ${accountAddress}`);
console.log(`give_token_address: ${giveTokenAddress}`);
console.log(`give_amount: ${giveAmount}`);
console.log(`take_token_address: ${takeTokenAddress}`);
console.log(`take_amount: ${takeAmount}`);
console.log(`nonce: ${nonce}`);
console.log(
  `expiry_timestamp_in_milliseconds: ${expiryTimestampInMilliseconds}`
);
console.log(`order_hash: ${orderHash}`);
console.log(`salted_order_hash: ${bufferToHex(saltedOrderHash)}`);
console.log(`signature: ${signature}`);
