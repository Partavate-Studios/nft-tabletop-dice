// contracts/Dice.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./DiceLibrary.sol";
import "./ERC721SimpleEnumerable.sol";
import "./RandomNameLibrary.sol";
import "./Version.sol";

contract TabletopDiceNFT is Ownable, Version, ERC721SimpleEnumerable {
    using Counters for Counters.Counter;
    using DiceLibrary for DiceLibrary.DiceStorage;
    using RandomNameLibrary for RandomNameLibrary.WordStorage;

    address payable accountsRecievable;

    Counters.Counter private _tokenIds;
    DiceLibrary.DiceStorage diceLib;
    RandomNameLibrary.WordStorage nameLib;

    string private _baseURIvalue;

    constructor(string[] memory adjectives, string[] memory nouns)
        ERC721(string(abi.encodePacked("PolyDice dApp v", version)), "PolyDice") {
        _baseURIvalue = "https://dice.partavate.com";
        accountsRecievable = payable(msg.sender);
        addAdjectives(adjectives);
        addNouns(nouns);
    }

    function addAdjectives(string[] memory adjectives) public onlyOwner {
        for (uint i=0; i<adjectives.length; i++) {
            nameLib.addAdjective(adjectives[i]);
        }
    }

    function addNouns(string[] memory nouns) public onlyOwner {
        for (uint i=0; i<nouns.length; i++) {
            nameLib.addNoun(nouns[i]);
        }
    }

    function setBaseURI(string calldata baseURI) public onlyOwner {
        _baseURIvalue = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIvalue;
    }

    function tokenURI(uint256 tokenId)
        public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return (string(abi.encodePacked(_baseURI(), diceLib.getTokenURIpath(tokenId))));
    }

    function mintRandomDice()
       public payable returns (uint256 count) {
        // TODO: price should be stored in a variable
        uint256 priceEach = 0.001 ether;
        require((msg.value >= priceEach), "not enough cash");
        count = uint256(msg.value / priceEach);
        for(uint i=0; i<count; i++) {
            mintRandomDie();
        }
        (bool success,) = accountsRecievable.call{value: msg.value}("");
        require(success, "Failed to send money");
        return count;
    }

    function mintRandomDie() public returns (uint256) {
        uint256 tokenId = _tokenIds.current();
        string memory randomName = nameLib.getRandomName(tokenId);
        uint8 sides = DiceLibrary.randomSides(uint16(tokenId));
        uint8 styleId = DiceLibrary.randomStyle(uint16(tokenId * sides));
        uint8 font = DiceLibrary.randomFont(uint16(tokenId * styleId));
        diceLib.createDice(
            tokenId,
            randomName,
            sides,
            styleId,
            font
        );
        _safeMint(msg.sender, tokenId);
        _tokenIds.increment();
        return tokenId;
    }

    function mintNFT(
        address owner,
        string calldata name,
        uint8 sides,
        uint8 styleId,
        uint8 font
    ) public onlyOwner returns (uint256) {
        // NOTE: Start at id #0
        uint256 newId = _tokenIds.current();
        diceLib.createDice(newId, name, sides, styleId, font);
        _safeMint(owner, newId);
        _tokenIds.increment();

        return newId;
    }

    function mintNFTBatch(
        address owner,
        string calldata name,
        uint8 sides,
        uint8 styleId,
        uint8 font,
        uint16 count
    ) public onlyOwner {
        for (uint16 i = 0; i < count; i++) {
            mintNFT(owner, name, sides, styleId, font);
        }
    }



    function getOwnedTokenIds() public view returns (uint256[] memory) {
        uint256 ownedCnt = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](ownedCnt);
        for (uint256 i = 0; i < ownedCnt; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return tokenIds;
    }

    // TODO: Add new attributes
    function getTraits(uint256 tokenId)
        public view returns (
            string memory name,
            uint8 sides,
            string memory fgColor,
            string memory bgColor,
            uint8 font
        )
    {
        return diceLib.getTraits(tokenId);
    }

    function roll(uint256 tokenId, uint16 nonce) public view returns (uint8) {
        // FIXME:
        // require(msg.sender == ownerOf(tokenId), "Ah Ah Ah, you didn't say the magic word! (This isn't your NFT.)");
        return diceLib.doRoll(tokenId, nonce);
    }

    function getColorTheme(uint8 styleId) public pure
        returns (string memory foreground, string memory background)
    {
        return DiceLibrary.getColorTheme(styleId);
    }

    function getOwnerOf(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }
}
