const { soliditySha3, fromUtf8 } = require("web3-utils");
const {
	hashPersonalMessage,
	bufferToHex,
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
const walletAddress = "0xe37a4faa73fced0a177da51d8b62d02764f2fc45";
const walletPrivateKey =
	"0xd15b17f51f613d0d89c64c7b629ffff7ae9c19e509afc9518dac1650e9812c18";

/**
 * The current UNIX timestamp in milliseconds
 */
const nonce = 1550314094931;

/**
 * The expiry UNIX timestamp in milliseconds
 */
const expiry = 4705572264000;

/**
 * Trade assets information
 */
const giveToken = "0x21921361bab476be44c0655256a2f4281bfcf07d"; // NJA
const giveAmount = "100000000000000000000"; // 100 NJA
const takeToken = "0x0000000000000000000000000000000000000000"; // ETH
const takeAmount = "500000000000000000"; // 0.5 ETH

const order_hash = soliditySha3(
	contractAddress,
	walletAddress,
	giveToken,
	giveAmount,
	takeToken,
	takeAmount,
	nonce,
	expiry
);
const salted_order_hash = hashPersonalMessage(toBuffer(fromUtf8(order_hash)));
const vrs = ecsign(salted_order_hash, toBuffer(walletPrivateKey));
// const signature =

console.log(vrs);

// console.log("Order payload:");
// console.log(JSON.stringify(Object.assign(args, vrs), null, 2));
