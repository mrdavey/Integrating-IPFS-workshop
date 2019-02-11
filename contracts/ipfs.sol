pragma solidity ^0.5.0;

contract Ipfs {
    string public latestHash;

    function changeHash(string memory _newHash) public returns (bool) {
        latestHash = _newHash;
        return true;
    }
}