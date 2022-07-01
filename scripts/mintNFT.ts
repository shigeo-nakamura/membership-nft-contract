import { ethers } from "ethers";
import { getProvider } from "./getProvider";
import membershipNFT from "../artifacts/contracts/membershipNFT.sol/membershipNFT.json";
import { membershipNFTAddress } from "./contractAddresses";
import { privateKey } from "./privateKey";

async function main() {
  const [, , ...unsanitizedArgs] = process.argv;

  if (unsanitizedArgs.length !== 4) {
    console.log("yarn es ./src/mintNft <membername> <description> <color> <ammount>");
    return;
  }

  const [membername, description, color, ammount] = unsanitizedArgs;

  const provider = getProvider();
  const wallet = new ethers.Wallet(privateKey, provider);

  if (membershipNFTAddress == undefined) {
    console.log("The contract address is undefined");
    return;
  }

  const membershipNFTContract = new ethers.Contract(
    membershipNFTAddress,
    membershipNFT.abi,
    wallet
  );

  console.log("minting");
  const transaction = await membershipNFTContract.createToken(membername, description, color, ammount);
  const tx = await transaction.wait();
  const event = tx.events[0];
  const value = event.args[2];
  const tokenId = value.toNumber();

  console.log({
    transaction,
    tx,
    tokenId,
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});