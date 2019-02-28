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
 * Your wallet's address and private key, address and privateKey are only exemplar and are to be replaced
 */
const accountAddress = "0xe37a4faa73fced0a177da51d8b62d02764f2fc45";
const accountPrivateKey =
  "0xd15b17f51f613d0d89c64c7b629ffff7ae9c19e509afc9518dac1650e9812c18";

/**
 * The token to be withdrawn
 */
const tokenAddress = "0x0000000000000000000000000000000000000000";

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
  accountAddress,
  tokenAddress,
  amount,
  nonce
);
const saltedWithdrawHash = hashPersonalMessage(toBuffer(withdrawHash));
const vrs = ecsign(saltedWithdrawHash, toBuffer(accountPrivateKey));
const signature = toRpcSig(vrs.v, vrs.r, vrs.s);

console.log(`account_address: ${accountAddress}`);
console.log(`amount: ${amount}`);
console.log(`token_address: ${tokenAddress}`);
console.log(`nonce: ${nonce}`);
console.log(`withdraw_hash: ${withdrawHash}`);
console.log(`signature: ${signature}`);
