const { expect } = require("chai");

describe("Minting the token and returning it", function () {
  it("should the contract be able to mint a function and return it", async function () {
    const metadata = "";

    const FactoryContract = await ethers.getContractFactory("membershipNFT");

    const factoryContract = await FactoryContract.deploy();

    const transaction = await factoryContract.createToken(metadata);
    const tx = await transaction.wait()

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const tokenURI = await factoryContract.tokenURI(tokenId)

    expect(tokenURI).to.be.equal(metadata);

  });
});