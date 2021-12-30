// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SalientYachtsReward is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Salient Yachts Reward", "WIND") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

/*
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SalientYachtsReward is ERC20Burnable, Ownable {
    uint256 private TEN_YEARS = 315569520; //10 years -> 315569520 seconds

    constructor(address _tokenOwner) ERC20("Salient Yachts Reward", "WIND") {
        _mint(_tokenOwner, 14400 * (10 ** uint256(decimals())) * TEN_YEARS);
    }
}
*/