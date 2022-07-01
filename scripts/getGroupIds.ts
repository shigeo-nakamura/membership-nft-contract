import { ethers } from "ethers";
import { getProvider } from "./getProvider";
import membershipNFT from "../artifacts/contracts/membershipNFT.sol/membershipNFT.json";
import { membershipNFTAddress } from "./contractAddresses";
import { privateKey } from "./privateKey";

async function main() {
  const [, , ...unsanitizedArgs] = process.argv;

  if (unsanitizedArgs.length !== 1) {
    console.log("yarn es ./src/mintNft <tokenid>");
    return;
  }

  const [tokenid] = unsanitizedArgs;

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

  console.log("getGroupIdFromTokenId(tokenid)");
  const groupId = await membershipNFTContract.getGroupIdFromTokenId(tokenid);
  console.log(groupId);

  console.log("getGroupId");
  const groupId2 = await membershipNFTContract.getGroupId();
  console.log(groupId2);

  console.log("getGroupIdFromAddress");
  const groupId3 = await membershipNFTContract.getGroupIdFromAddress(
    "5B659918F383dF52c5Dd042e204DaeAD4df954F2"
  );
  console.log(groupId3);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
