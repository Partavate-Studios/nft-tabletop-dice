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

  async function mintNftDefault(): Promise<TransactionResponse> {
    return deployedContract.mintNFT(
      wallet.address,
      name,
      sides,
      styleId,
      font
    );
  }

  async function mintNftBatch(count: number, owner=wallet.address): Promise<TransactionResponse> {
    return deployedContract.mintNFTBatch(
      owner,
      name,
      sides,
      styleId,
      font,
      count
    );
  }

  describe("mintNft", async () => {
    it("emits the Transfer event", async () => {
      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(ethers.constants.AddressZero, wallet.address, "0");
    });

    it("returns the new item ID", async () => {
      await expect(
        await deployedContract.callStatic.mintNFT(
          wallet.address,
          name,
          sides,
          styleId,
          font)
      ).to.be.eq(0);
    });

    it("increments the item ID", async () => {
      const STARTING_NEW_ITEM_ID = "0";
      const NEXT_NEW_ITEM_ID = "1";

      await expect(mintNftDefault())
        .to.emit(deployedContract, "Transfer")
        .withArgs(
          ethers.constants.AddressZero,
          wallet.address,
          STARTING_NEW_ITEM_ID
        );

      // await expect(mintNftDefault())
      //   .to.emit(deployedContract, "Transfer")
      //   .withArgs(
      //     ethers.constants.AddressZero,
      //     wallet.address,
      //     NEXT_NEW_ITEM_ID
      //   );
    });

    it("cannot mint to address zero", async () => {
      const TX = deployedContract.mintNFT(
        ethers.constants.AddressZero,
        name,
        sides,
        styleId,
        font
      );
      await expect(TX).to.be.rejectedWith(Error, 'ERC721: mint to the zero address')
      //await expect(TX).to.be.revertedWith("ERC721: mint to the zero address");
    });

    it("translates styleId to color themes", async () => {
      let key = 0;
      let theme = await deployedContract.getColorTheme(key);
      expect(theme.foreground).to.equal('0000ff');
      expect(theme.background).to.equal('00134e');
      key = 30;
      theme = await deployedContract.getColorTheme(key);
      expect(theme.foreground).to.equal('ffffff');
      expect(theme.background).to.equal('0000ff');
    });

    it("Mints dice NFTs with attributes", async () => {
      let name = "der Würfel!";
      let sides = 10;
      let font = 14;
      let tokenURIexpected =
        `https://dice.partavate.com/metadata/${name}/${sides}/${fgColor}/${bgColor}/${font}`;

      await deployedContract.mintNFT(wallet.address,
        name,
        sides,
        styleId,
        font);

      // TODO: Get tokenId from emitted event:
      const tokenId = 0;
      let die = await deployedContract.getTraits(tokenId);
      expect(die.name).to.equal(name);
      expect(die.sides).to.equal(sides);
      expect(die.fgColor).to.equal("000000");
      expect(die.bgColor).to.equal("555753");
      expect(die.font).to.equal(font);

      //console.log(await deployedContract.tokenURI(tokenId));
      expect(await deployedContract.tokenURI(tokenId)).to.equal(tokenURIexpected);
    });
  });

  describe("Minting a random die", async () => {
    it("creates a random die", async () => {
      let tokenId = await deployedContract.mintRandomDie();
      console.log('address', wallet.address);
      //expect(tokenId).to.eq("0");

      let nftBalance = await deployedContract.balanceOf(wallet.address);
      expect(nftBalance).to.eq(1);

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

  describe("Rolling Tabletop Dice", () => {
    it("Dice NFTs must roll with a result from 1-$sides", async () => {
      await mintNftDefault();

      let tokenId = 0;
      let numRolls = 10;
      for (let index = 0; index < numRolls; ++index) {
        await ethers.provider.send('evm_mine', []); // Advance block number
        expect(await deployedContract.roll(tokenId, nonceFn()))
          .to.be.within(1, sides, "Die result is out of allowed range!")
      }

      it("10-side dice NFTs must roll with a result from 0-9", async () => {1
        await deployedContract.mintNFT(wallet.address, "D10", 10, styleId, font);

        let tokenId = 0;
        let numRolls = 10;
        for (let index = 0; index < numRolls; ++index) {
          await ethers.provider.send('evm_mine', []); // Advance block number
          expect(await deployedContract.roll(tokenId, nonceFn()))
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