const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

developmentChains.includes(network.name) ? describe.skip : describe("Raffle Unit Tests", async function () {
  let raffle, raffleEntranceFee, deployer;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    raffle = await ethers.getContract("Raffle", deployer);
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
    raffleEntranceFee = await raffle.getEntranceFee();
    interval = await raffle.getInterval();
  });

  describe("fulfillRandomWords", function () {
    it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
      const startingTimestamp = await raffle.getLatestTimestamp();
      const accounts = await ethers.getSigners();
      await new Promise(async (resolve, reject) => {
        raffle.once("WinnerPicked", async () => {
          console.log("WinnerPicked event fired!");
          try {
            const recentWinner = await raffle.getRecentWinner();
            const raffleState = await raffle.getRaffleState();
            const winnerBalance = await accounts[0].getBalance();
            const endingTimestamp = await raffle.getLatestTimestamp();
            await expect(raffle.getPlayer(0)).to.be.reverted;
            assert.equal(recentWinner.toString(), accounts[0].address);
            assert.equal(raffleState, 0);
          } catch (error) {
            console.log(error);
            reject(e);
          }
        })
        await raffle.enterRaffle({ value: raffleEntranceFee });
        const winnerStartingBalance = await accounts[0].getBalance();

      })
    })
  })
});