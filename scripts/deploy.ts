import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address); 

  const membershipNFTcontract = await ethers.getContractFactory("membershipNFT");
  const membershipNFT = await membershipNFTcontract.deploy(1000000);
  await membershipNFT.deployed();

  console.log("membershipNFT deployed to:", membershipNFT.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

