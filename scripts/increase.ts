import { ethers } from "ethers";
import { getProvider } from "./getProvider";
import membershipNFT from "../artifacts/contracts/membershipNFT.sol/membershipNFT.json";
import { membershipNFTAddress } from "./contractAddresses";
import { privateKey } from "./privateKey";

async function main() {
  const [, , ...unsanitizedArgs] = process.argv;

  if (unsanitizedArgs.length !== 2) {
    console.log(
      "yarn es ./src/mintNft <tokenid> <ammount>"
    );
    return;
  }

  const [tokenid, ammount] = unsanitizedArgs;

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

  console.log("increase");
  const transaction = await membershipNFTContract.increaseToken(tokenid, ammount);
  const tx = await transaction.wait();

  console.log({
    transaction,
    tx
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});