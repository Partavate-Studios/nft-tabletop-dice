// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library WordListLibrary {
    struct list {
        mapping(uint256 => string) word;
        uint256 counter;
    }

    function addWord(
        list storage self,
        string memory word
    ) internal {
        self.word[self.counter] = word;
        self.counter++;
    }

    function getRandomWord(
        list storage self,
        uint256 nonce
    ) internal view returns (string storage word) {
        require(self.counter > 0, "no words");
        uint key = uint256(
            keccak256(
                abi.encode(
                    block.difficulty,
                    block.timestamp,
                    msg.sender,
                    nonce
                )
            )
        ) % self.counter;
        return self.word[key];
    }

}

library RandomNameLibrary {
    using WordListLibrary for WordListLibrary.list;

    struct WordStorage {
        WordListLibrary.list adjectives;
        WordListLibrary.list nouns;
    }

    function addAdjective(WordStorage storage self, string memory word) internal {
        self.adjectives.addWord(word);
    }

    function addNoun(WordStorage storage self, string memory word) internal {
        self.nouns.addWord(word);
    }

    function getRandomName(
        WordStorage storage self,
        uint256 nonce
    ) internal view returns (string memory name) {

        name = string(abi.encodePacked(
            self.adjectives.getRandomWord(nonce),
            ' ',
            self.nouns.getRandomWord(nonce)
        ));
        return name;
    }
}
