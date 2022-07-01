import { ethers } from "ethers";
import { getProvider } from "./getProvider";
import membershipNFT from "../artifacts/contracts/membershipNFT.sol/membershipNFT.json";
import { membershipNFTAddress } from "./contractAddresses";
import { privateKey } from "./privateKey";

async function main() {
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

  console.log("tokenURI");
  const uri = await membershipNFTContract.tokenURI(1);
  console.log(uri);

  const data = Buffer.from(uri.substring(29), 'base64').toString();
  console.log(data);

  const json = JSON.parse(data);
  const imageData = json.image.substring(26);
  console.log(Buffer.from(imageData, 'base64').toString());
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});