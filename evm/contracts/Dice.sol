// contracts/Dice.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DiceLibrary.sol";
import "./ERC721SimpleEnumerable.sol";
import "./RandomNameLibrary.sol";
import "./Version.sol";

contract TabletopDiceNFT is Ownable, Version, ERC721SimpleEnumerable {
    using Counters for Counters.Counter;
    using DiceLibrary for DiceLibrary.DiceStorage;
    using RandomNameLibrary for RandomNameLibrary.WordStorage;

    uint256 pricePerDie = 0.173 ether;

    uint256 constant maxDicePerTransaction = 7;
    address payable accountsRecievable;

    Counters.Counter private _tokenIds;
    DiceLibrary.DiceStorage diceLib;
    RandomNameLibrary.WordStorage nameLib;

    string private _baseURIvalue;

    constructor(string[] memory adjectives, string[] memory nouns)
        ERC721(string(abi.encodePacked("PolyDice dApp v", version)), "PolyDice") {
        _baseURIvalue = "https://dice.partavate.com";
        accountsRecievable = payable(msg.sender);
        addWords(adjectives, nouns);
        diceLib.possibleSides.push(6);
        diceLib.possibleSides.push(20);
        diceLib.maxThemeValue = 30;
        diceLib.maxFontValue = 1;
    }

    function _mintDie(
        string memory name,
        uint8 sides,
        uint8 styleId,
        uint8 font,
        address reciever
    ) internal returns (uint256 tokenId) {
        tokenId = _tokenIds.current();
        diceLib.createDice(tokenId, name, sides, styleId, font);
        //safe mint will emit a transfer event
        _safeMint(reciever, tokenId);
        _tokenIds.increment();
        return tokenId;
    }

    function _mintRandomDie(address reciever) internal returns (uint256 tokenId) {
        uint256 nonce = _tokenIds.current();
        string memory randomName = nameLib.getRandomName(nonce);
        (uint8 sides, uint8 styleId, uint8 font) = diceLib.getRandomAttributes(uint16(nonce));
        return _mintDie(
            randomName,
            sides,
            styleId,
            font,
            reciever
        );
    }

    /***** Owner Methods ******/

    function addPossibleSides(uint8 sides) external onlyOwner {
        diceLib.possibleSides.push(sides);
    }

    function setDiePrice(uint256 newCost) external onlyOwner {
        pricePerDie = newCost;
    }

    function setAccountsRecievable(address payable newReciver) external onlyOwner {
        accountsRecievable = newReciver;
    }

    function addWords(string[] memory adjectives, string[] memory nouns) public onlyOwner {
        for (uint i=0; i<adjectives.length; i++) {
            nameLib.addAdjective(adjectives[i]);
        }
        for (uint i=0; i<nouns.length; i++) {
            nameLib.addNoun(nouns[i]);
        }
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseURIvalue = baseURI;
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

    function mintRandomDie(address reciever) public onlyOwner returns (uint256 tokenId) {
        uint256 nonce = _tokenIds.current();
        string memory randomName = nameLib.getRandomName(nonce);
        (uint8 sides, uint8 styleId, uint8 font) = diceLib.getRandomAttributes(uint16(nonce));
        return _mintDie(
            randomName,
            sides,
            styleId,
            font,
            reciever
        );
    }

    function mintRandomDice(uint8 count, address reciever) public onlyOwner {
        for (uint8 i=0; i < count; i++) {
            _mintRandomDie(reciever);
        }
    }

    /***** Public Methods ******/

    function tokenURI(uint256 tokenId)
        public view override returns (string memory) {
        require(_exists(tokenId), "nonexistent token");
        return (string(abi.encodePacked(_baseURIvalue, diceLib.getTokenURIpath(tokenId))));
    }

    function getOwnedTokenIds() public view returns (uint256[] memory) {
        uint256 ownedCnt = balanceOf(msg.sender);
        uint256[] memory tokenIds = new uint256[](ownedCnt);
        for (uint256 i = 0; i < ownedCnt; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return tokenIds;
    }

    function getRoll(uint256 tokenId, uint16 nonce) public view returns (uint8) {
        require(msg.sender == ownerOf(tokenId), "Not yours.");
        return diceLib.doRoll(tokenId, nonce);
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

    function getMintingCost() public view returns (uint256 cost) {
        return pricePerDie;
    }

    function buyRandomDice(uint8 count) public payable {
        require((msg.value >= pricePerDie * count),
        "not enough cash");
        for(uint i=0; i < count; i++) {
            _mintRandomDie(msg.sender);
        }
        (bool success,) = accountsRecievable.call{value: msg.value}("");
        require(success, "Failed to forward payment.");
    }
}
