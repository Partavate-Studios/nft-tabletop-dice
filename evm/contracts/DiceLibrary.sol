// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library DiceLibrary {
    struct Dice {
        string name;
        uint8 sides;
        uint8 colorTheme;
        uint8 font;
    }

    struct DiceStorage {
        mapping(uint256 => Dice) dice;

        uint8[] possibleSides;
        uint8 maxThemeValue;
        uint8 maxFontValue;
    }

    function inSides(DiceStorage storage self, uint8 sides) internal view returns (bool) {
        for (uint256 i = 0; i < self.possibleSides.length; i++) {
            if (self.possibleSides[i] == sides) {
                return true;
            }
        }
        return false;
    }

    function createDice(
        DiceStorage storage self,
        uint256 tokenId,
        string memory name,
        uint8 sides,
        uint8 colorTheme,
        uint8 font
    ) internal {
        require(colorTheme <= self.maxThemeValue, "Invalid color theme");
        require(font <= self.maxFontValue, "Invalid color theme");
        require(inSides(self, sides), "Invalid number of sides");

        self.dice[tokenId] = Dice(
            name,
            sides,
            colorTheme,
            font
        );
    }

    // URI path is composed of attributes
    function getTokenURIpath(DiceStorage storage self, uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        (string memory _fgColor, string memory _bgColor) = getColorTheme(self.dice[tokenId].colorTheme);

        return(string(abi.encodePacked(
            "/metadata",
            "/", self.dice[tokenId].name,
            "/", Strings.toString(self.dice[tokenId].sides),
            "/", _fgColor,
            "/", _bgColor,
            "/", Strings.toString(self.dice[tokenId].font)
        )));
    }

    function getTraits(DiceStorage storage self, uint256 tokenId)
        internal
        view
        returns (
            string memory name,
            uint8 sides,
            string memory fgColor,
            string memory bgColor,
            uint8 font
        )
    {
        (string memory _fgColor, string memory _bgColor) = getColorTheme(self.dice[tokenId].colorTheme);

        return (
            self.dice[tokenId].name,
            self.dice[tokenId].sides,
            _fgColor,
            _bgColor,
            self.dice[tokenId].font
        );
    }

    function random(uint16 nonce) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(
                        block.difficulty,
                        block.timestamp,
                        msg.sender,
                        nonce
                    )
                )
            );
    }

    function getRandomAttributes(DiceStorage storage self, uint16 nonce) internal view returns (uint8 sides, uint8 colorTheme, uint8 font) {
        sides = self.possibleSides[(uint8(random(nonce)) % self.possibleSides.length)];
        colorTheme = (uint8(random(nonce * sides)) % (self.maxThemeValue + 1));
        font = (uint8(random(nonce * colorTheme)) % (self.maxFontValue + 1));
        return (sides, colorTheme, font);
    }

    function doRoll(
        DiceStorage storage self,
        uint256 tokenId,
        uint16 nonce
    ) internal view returns (uint8) {
        uint8 offset = (self.dice[tokenId].sides == 10) ? 0 : 1;
        uint8 result = uint8(
            (random(nonce) % self.dice[tokenId].sides) + offset
        );
        return result;
    }

    // Storing small indexed values allows much less data per minted token
    function getColorTheme(uint8 colorTheme) internal pure returns(
        string memory foreground, string memory background
    ) {
        require(colorTheme <= 30, "style out of range");

        if ((colorTheme >= 0) && (colorTheme <= 3)) {
            background = '00134e';
        } else if ((colorTheme >= 4) && (colorTheme <= 7)) {
            background = '1a1a1a';
        } else if ((colorTheme >= 8) && (colorTheme <= 10)) {
            background = 'ffffff';
        } else if ((colorTheme >= 11) && (colorTheme <= 13)) {
            background = '555753';
        } else if ((colorTheme >= 14) && (colorTheme <= 16)) {
            background = '8b10d0';
        } else if ((colorTheme >= 17) && (colorTheme <= 19)) {
            background = 'ecdc19';
        } else if ((colorTheme == 20) || (colorTheme == 21)) {
            background = '408fdd';
        } else if ((colorTheme == 22) || (colorTheme == 23)) {
            background = '317a26';
        } else if ((colorTheme == 24) || (colorTheme == 25)) {
            background = 'f21d0a';
        } else if (colorTheme == 26) {
            background = '88ff44';
        } else if (colorTheme == 27) {
            background = 'd09c10';
        } else if (colorTheme == 28) {
            background = 'ef54da';
        } else if (colorTheme == 29) {
            background = '4e0000';
        } else if (colorTheme == 30) {
            background = '0000ff';
        }

        if ((colorTheme == 0) ||
            (colorTheme == 4) ||
            (colorTheme == 8) ||
            (colorTheme == 17) ||
            (colorTheme == 26)) {
            foreground = '0000ff';
        } else if ((colorTheme == 1) ||
            (colorTheme == 5)) {
            foreground = '00ff00';
        } else if ((colorTheme == 2) ||
            (colorTheme == 6) ||
            (colorTheme == 10) ||
            (colorTheme == 19) ||
            (colorTheme == 28)) {
            foreground = 'ff0000';
        } else if ((colorTheme == 3) ||
            (colorTheme == 7) ||
            (colorTheme == 13) ||
            (colorTheme == 16) ||
            (colorTheme == 21) ||
            (colorTheme == 23) ||
            (colorTheme == 25) ||
            (colorTheme == 29) ||
            (colorTheme == 30)) {
            foreground = 'ffffff';
        } else if ((colorTheme == 9) ||
            (colorTheme == 11) ||
            (colorTheme == 14) ||
            (colorTheme == 18) ||
            (colorTheme == 20) ||
            (colorTheme == 27)) {
            foreground = '000000';
        }  else if ((colorTheme == 12) ||
            (colorTheme == 22)) {
            foreground = '88ff88';
        }  else if (colorTheme == 15) {
            foreground = '66cc66';
        }  else if (colorTheme == 24) {
            foreground = '880000';
        }

        return (foreground, background);
    }
}
