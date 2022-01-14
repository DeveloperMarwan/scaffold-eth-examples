// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SalientYachtsStream.sol";
import "hardhat/console.sol";

contract SalientYachtsNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    //assume Yacht price is $600,000 -> we will have 6000 tokens at $100 each
    //assume AVAX is $100 (might considuer using Chainlink AVAX / USD) -> supply is 6000 tokens
    uint256 public constant mintPrice = 1 ether; // assume AVAX is $100 -> $1000 = 10 AVAX
    uint8 public constant mintLimit = 20;
    uint256 public constant tenYearDeposit = 2399999999999765395680;
    //uint256 public constant fourYearDeposit = 959999999999906158272;

    uint16 public supplyLimit = 6000; //assume Yacht price is $600,000 -> we will have 6000 tokens at $100 each
    bool public saleActive = false;                           

    uint256 private TEN_YEARS = 315569520; //10 years -> 315,569,520 seconds
    //uint256 private FOUR_YEARS = 126227808; //4 years = 126,227,808 seconds

    address private rewardContractAddress;
    SalientYachtsStream public streamContract;
    mapping(address => mapping(uint256 => uint256)) private nftOwnerToTokenIdToStreamId;

    constructor(address _rewardContractAddress) ERC721("Salient Yachts", "SYONE") {
        rewardContractAddress = _rewardContractAddress;
        streamContract = new SalientYachtsStream();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://nft.salientyachts.com";
    }

    function toggleSaleActive() public onlyOwner {
        saleActive = !saleActive;
    }

    function buyYachtNFT(uint numberOfTokens) public payable {
        require(saleActive, "Sale is not active");
        require(numberOfTokens <= mintLimit, "No more than 20 yacht NFT's at a time");
        require(msg.value >= mintPrice * numberOfTokens, "Insufficient payment");
        require(totalSupply() + numberOfTokens <= supplyLimit, "Not enough yacht NFT's left");
        
        //mint the NFT(s)
        uint256 startTime = block.timestamp + 60; // 1 minute from now
        uint256 stopTime = block.timestamp + TEN_YEARS + 60; // 10 years and 1 minute from now
        uint256 deposit = numberOfTokens * tenYearDeposit;
        IERC20(rewardContractAddress).approve(address(streamContract), deposit);

        for(uint i = 0; i < numberOfTokens; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            console.log("buyYachtNFT: minted NFT with tokenId: %s", tokenId);

            uint256 streamId = streamContract.createStream(address(this), msg.sender, tenYearDeposit, rewardContractAddress, startTime, 
                stopTime, tokenId);
            nftOwnerToTokenIdToStreamId[msg.sender][tokenId] = streamId;
            console.log("buyYachtNFT: created reward stream with streamId: %s", streamId);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
        console.log("_beforeTokenTransfer called - from: %s, to: %s, tokenId: %s", from, to, tokenId);
        
        if (from != address(0) && to != address(0) && from != to) {
            //cancel the reward stream for "from"
            uint256 fromStreamId = nftOwnerToTokenIdToStreamId[from][tokenId];
            require(fromStreamId > 0, "From stream id not found");
            (,,,,,uint256 oldStreamStopTime,uint256 oldStreamRemainingBalance,,uint256 oldStreamNftTokenId) = streamContract.getStream(fromStreamId);
            streamContract.cancelStream(fromStreamId);
            console.log("_beforeTokenTransfer cancelled stream: %s - from: %s", fromStreamId, from);

            //create a new stream for "to"
            uint256 startTime = block.timestamp;
            uint256 stopTime = oldStreamStopTime;
            uint256 duration = stopTime - startTime;
            uint256 streamAmt = oldStreamRemainingBalance - (oldStreamRemainingBalance % duration);
            IERC20(rewardContractAddress).approve(address(streamContract), tenYearDeposit);
            uint256 toStreamId = streamContract.createStream(address(this), to, streamAmt, rewardContractAddress, startTime, stopTime, 
                oldStreamNftTokenId);
            nftOwnerToTokenIdToStreamId[to][tokenId] = toStreamId;
            console.log("_beforeTokenTransfer created reward stream with streamId: %s for address: %s", toStreamId, to);
        }
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}