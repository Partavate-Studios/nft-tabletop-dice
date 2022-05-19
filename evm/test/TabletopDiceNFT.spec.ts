import { ethers } from "hardhat";
import { BigNumber, Contract } from "ethers";
import chai, { expect } from "chai";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { deployContract, getTestWallet } from "./test-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("TabletopDiceNFT", () => {
  const BASE_URI = "https://example.com";
  let deployedContract: Contract;
  let wallet: SignerWithAddress ;
  let name = "Dungeon Master's D20";
  let sides = 20;
  let fgColor = "000000";
  let bgColor = "555753";
  let styleId = 11;
  let font = 1;
  let nonceFn = () => { return Math.floor(Math.random() * 100) };

  beforeEach(async () => {
    wallet = await getTestWallet();
    deployedContract = await deployContract("TabletopDiceNFT");
  });

  async function mintDie(owner=wallet.address) {
    let tokenId = await deployedContract.mintDie(
      name,
      sides,
      styleId,
      font,
      owner
    );
    return tokenId;
  }

  async function mintRandomDie(owner=wallet.address) {
    let tokenId = await deployedContract.mintRandomDie(
      owner
    );
    return tokenId;
  }
  async function mintRandomDice(count: number, owner=wallet.address) {
    await deployedContract.mintRandomDice(
      count,
      owner
    );
  }

  async function mintNftBatch(count: number, owner=wallet.address) {
    for (var i=0;i<count;i++) {
      await mintDie(owner);
    }
  }

  describe("mintDice", async () => {
    it("emits the Transfer event", async () => {
      await expect(mintDie())
        .to.emit(deployedContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, wallet.address, "0");
    });

    it("returns the new item ID", async () => {
      expect(
        await deployedContract.callStatic.mintDie(
          name,
          sides,
          styleId,
          font,
          wallet.address)
      ).to.eq("0");
    });

    it("increments the item ID", async () => {
      const STARTING_NEW_ITEM_ID = "0";
      const NEXT_NEW_ITEM_ID = "1";

      await expect(mintDie())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          STARTING_NEW_ITEM_ID
        );

      await expect(mintDie())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          NEXT_NEW_ITEM_ID
        );
    });

    it("cannot mint to address zero", async () => {
      const TX = deployedContract.mintDie(
        name,
        sides,
        styleId,
        font,
        ethers.constants.AddressZero
      );
      await expect(TX).to.be.rejectedWith(Error, 'ERC721: mint to the zero address');
    });

    it("Mints dice NFTs with attributes", async () => {
      let name = "der Würfel!";
      let sides = 20;
      let font = 1;
      let tokenURIexpected =
        `https://polydice.app/metadata/${name}/${sides}/${fgColor}/${bgColor}/${font}`;

      await deployedContract.mintDie(
        name,
        sides,
        styleId,
        font,
        wallet.address);

      // TODO: Get tokenId from emitted event:
      const tokenId = 0;
      let die = await deployedContract.getTraits(tokenId);
      expect(die.name).to.equal(name);
      expect(die.sides).to.equal(sides);
      expect(die.fgColor).to.equal("000000");
      expect(die.bgColor).to.equal("555753");
      expect(die.font).to.equal(font);

      expect(await deployedContract.tokenURI(tokenId)).to.equal(tokenURIexpected);
    });
  });

  describe("Minting a random die", async () => {
    it("creates a random die", async () => {
      await mintRandomDie();

      let nftBalance = await deployedContract.balanceOf(wallet.address);
      expect(nftBalance).to.eq(1);


      await mintRandomDice(5);
      nftBalance = await deployedContract.balanceOf(wallet.address);
      expect(nftBalance).to.eq(6);

      let die = await deployedContract.getTraits(0);
      expect(die.name).to.equal("Benny Hicks");
      //expect(die.sides).to.equal(20);

    });
  });

  describe("balanceOf", () => {
    it("gets the count of NFTs for this address", async () => {
      await expect(await deployedContract.balanceOf(wallet.address)).to.eq(0);

      await mintNftBatch(4);

      let nftBalance = await deployedContract.balanceOf(wallet.address);
      expect(nftBalance).to.eq(4);
    });
  });

  describe("setPrice", () => {
    it("checks if price setting works", async () => {
      let price = 1000;
      await deployedContract.setDiePrice(price);
      let cost = await deployedContract.getMintingCost();
      expect(cost).to.eq(price);
    });
  });

  describe("Rolling Tabletop Dice", () => {
    it("Dice NFTs must roll with a result from 1-$sides", async () => {
      await mintDie();

      let tokenId = 0;
      let numRolls = 10;
      for (let index = 0; index < numRolls; ++index) {
        await ethers.provider.send('evm_mine', []); // Advance block number
        expect(await deployedContract.getRoll(tokenId, nonceFn()))
          .to.be.within(1, sides, "Die result is out of allowed range!")
      }

      it("10-side dice NFTs must roll with a result from 0-9", async () => {1
        await deployedContract.mintDie("D10", 10, styleId, font, wallet.address);

        let tokenId = 0;
        let numRolls = 10;
        for (let index = 0; index < numRolls; ++index) {
          await ethers.provider.send('evm_mine', []); // Advance block number
          expect(await deployedContract.getRoll(tokenId, nonceFn()))
            .to.be.within(0, sides, "Die result is out of allowed range!")
        }
      });
    });
  });

  describe("Getting an owners NFT collection", () => {
    it("returns an array of all owned NFT tokenIds", async () => {
      const otherAccount = (await ethers.getSigners())[1];

      let numMinted = 11;

      // The first 5 NFTs will belong to someone else
      await mintNftBatch(5, otherAccount.address);
      // Now generate NFTs for our wallet address
      await mintNftBatch(numMinted);

      expect(await deployedContract.getOwnedTokenIds()).to.be.length(numMinted);
    });
  });
});