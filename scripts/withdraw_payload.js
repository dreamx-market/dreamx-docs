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
 * Your wallet's address and private key, address and privateKey are only exemplar and are to be replaced
 */
const accountAddress = "0xfa46ed8f8d3f15e7d820e7246233bbd9450903e3";
const accountPrivateKey =
  "0x481118f6ea0f477469c7040fdb5fda6d9e2b32a5eea79b68256a20498815ba34";

/**
 * The token to be withdrawn
 */
const tokenAddress = "0x21921361bab476be44c0655256a2f4281bfcf07d";

/**
 * The amount to be traded
 */
const amount = "100000000000000000000";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1551375034000;

const withdrawHash = soliditySha3(
  contractAddress,
  tokenAddress,
  amount,
  accountAddress,
  nonce
);
const saltedWithdrawHash = hashPersonalMessage(toBuffer(withdrawHash));
const vrs = ecsign(saltedWithdrawHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`contract_address ${contractAddress}`);
console.log(`token_address: ${tokenAddress}`);
console.log(`amount: ${amount}`);
console.log(`account_address: ${accountAddress}`);
console.log(`nonce: ${nonce}`);
console.log(`withdraw_hash: ${withdrawHash}`);
console.log(`salted_withdraw_hash ${bufferToHex(saltedWithdrawHash)}`);
console.log(`signature: ${signature}`);
