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

/*
TODO:
Owner can change the minting cost per die.
Owner can change payment receiver address.
Owner can mint a die to specification and for an arbitrary owner.
Owner can mint batch of random dice for an arbitrary owner.
Owner can enable add new types of die by adding another options for "sides".

*/

contract TabletopDiceNFT is Ownable, Version, ERC721SimpleEnumerable {
    using Counters for Counters.Counter;
    using DiceLibrary for DiceLibrary.DiceStorage;
    using RandomNameLibrary for RandomNameLibrary.WordStorage;

    uint256 pricePerDie;
    uint256 constant maxDicePerTransaction = 3;
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
        pricePerDie = 0.001 ether;
    }

    function updateMintingCost(uint256 newCost) public onlyOwner {
        pricePerDie = newCost;
    }

    function getMintingCost(uint8 number) public view returns (uint256 cost) {
        require (number >= 1, "Not enough dice.");
        require (number <= maxDicePerTransaction, "Too many dice.");
        cost = 0;
        for (uint i=0; i<number; i++) {
            //the more you buy, the more you save
            cost = cost + pricePerDie / i;
        }
        return cost;
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

    function _mintDie(
        string memory name,
        uint8 sides,
        uint8 styleId,
        uint8 font,
        address reciever
    ) private returns (uint256 tokenId) {
        // TODO: require valid sides, font & style

        tokenId = _tokenIds.current();
        diceLib.createDice(tokenId, name, sides, styleId, font);
        //safe mint will emit a transfer event
        _safeMint(reciever, tokenId);
        _tokenIds.increment();
        //is this already implied? can it be dropped?
        return tokenId;
    }

    function _mintRandomDie(address reciever) private returns (uint256 tokenId) {
        uint256 nonce = _tokenIds.current();
        string memory randomName = nameLib.getRandomName(nonce);
        uint8 sides = DiceLibrary.randomSides(uint16(nonce));
        uint8 styleId = DiceLibrary.randomStyle(uint16(nonce * sides));
        uint8 font = DiceLibrary.randomFont(uint16(nonce * styleId));
        return _mintDie(
            randomName,
            sides,
            styleId,
            font,
            reciever
        );
    }

    function mintDie(
        string memory name,
        uint8 sides,
        uint8 styleId,
        uint8 font,
        address reciever
    ) public onlyOwner returns (uint256 tokenId) {
        return _mintDie(name, sides, styleId, font, reciever);
    }

/*
    function mintRandomDie() public onlyOwner returns (uint256 tokenId) {
        return mintRandomDie(msg.sender);
    }
*/
    function mintRandomDie(address reciever) public onlyOwner returns (uint256 tokenId) {
        return _mintRandomDie(reciever);
    }

    function buyRandomDice() public payable returns (uint256 count) {
        require((msg.value >= getMintingCost(1)), "not enough cash");
        //funds sent above price are treated as a donation
        count = uint256(msg.value / pricePerDie) % (maxDicePerTransaction + 1);
        for(uint i=0; i < count; i++) {
            _mintRandomDie(msg.sender);
        }
        (bool success,) = accountsRecievable.call{value: msg.value}("");
        require(success, "Failed to forward payment.");
    }

    function getOwnedTokenIds() public view returns (uint256[] memory) {
        uint256 ownedCnt = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](ownedCnt);
        for (uint256 i = 0; i < ownedCnt; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return tokenIds;
    }

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
