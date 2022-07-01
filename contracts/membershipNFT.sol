// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from "base64-sol/base64.sol";

contract membershipNFT is Ownable, ERC721Burnable {
  using Strings for uint16;
  using Strings for uint256;

  struct Property {
    string groupName;
    string description;
    string color;
  }

  // mint limit
  uint256 public limit;

  uint256 private _tokenIdCounter;
  uint16 private _groupIdCounter;
  mapping(uint16 => Property) private _props; // groupId => property
  mapping(uint256 => uint16) private _groupIdsFromTokenId; // tokenId => groupId
  mapping(address => uint16) private _groupIdsFromAddress; // address => groupId

  constructor(uint256 _limit) ERC721("My Membership NFT", "MEMBER") {
    _tokenIdCounter = 1;
    _groupIdCounter = 1;
    limit = _limit;
  }

  /**
   * @notice anyone can create a token for free.
   */
  function createToken(
    string memory _groupName,
    string memory _description,
    string memory _color,
    uint16 _amount
  ) external returns (uint16) {
    require(_tokenIdCounter <= limit, "Sold out.");
    require(_groupIdsFromAddress[msg.sender] == 0, "You have minted already");

    uint16 newGroupId = _groupIdCounter;
    _groupIdCounter += 1;

    Property storage prop = _props[newGroupId];
    prop.groupName = _groupName;
    prop.description = _description;
    prop.color = _color;

    _groupIdsFromAddress[msg.sender] = newGroupId;

    for (uint16 i = 0; i < _amount; i++) {
      _mint(msg.sender, _tokenIdCounter);
      _groupIdsFromTokenId[_tokenIdCounter] = newGroupId;
      _tokenIdCounter += 1;
    }

    return newGroupId;
  }

  /**
   * @notice only the owner of a token can create additional tokens with the same group id.
   */
  function increaseToken(uint256 _tokenId, uint16 _amount) external {
    require(
      ownerOf(_tokenId) == msg.sender,
      "You're not the owner of this token"
    );

    uint16 groupId = _groupIdsFromTokenId[_tokenId];

    for (uint16 i = 0; i < _amount; i++) {
      _groupIdsFromTokenId[_tokenIdCounter] = groupId;
      _mint(msg.sender, _tokenIdCounter);
      _tokenIdCounter += 1;
    }
  }

  /**
   * @notice get a group ID that belong to the given token ID.
   */
  function getGroupIdFromTokenId(uint256 _tokenId) external view returns (uint16) {
    require(_exists(_tokenId), "MyMemberToken.getGroupId: nonexistent token");
    return _groupIdsFromTokenId[_tokenId];
  }

  /**
   * @notice get a group ID that belong to the given address.
   */
  function getGroupIdFromAddress(address _owner) external view returns (uint16) {
    return _groupIdsFromAddress[_owner];
  }

  /**
   * @notice get a group ID that belong to the sender.
   */
  function getGroupId() external view returns (uint16) {
    return _groupIdsFromAddress[msg.sender];
  }

  /**
   * @notice generate a SVG with the given parameters.
   */
  function _generateSVG(
    string memory _color,
    string memory _groupName,
    uint256 _groupId,
    uint256 _tokenId
  ) internal pure returns (bytes memory) {
    bytes memory pack = abi.encodePacked(
      '<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n',
      '<rect x="10" y="10" rx="5" ry="5" width="400" height="220" style="fill:',
      _color,
      ';stroke:black;stroke-width:1;opacity:0.8" />\n',
      '<text fill="#ffffff" font-size="40" font-family="Verdana" x="30" y="100">',
      _groupName,
      "</text>\n",
      '<text fill="#ffffff" font-size="20" font-family="Verdana" x="30" y="200">Member # 000',
      _groupId.toString(),
      " 000",
      _tokenId.toString(),
      "</text>\n",
      "</svg>"
    );
    return pack;
  }

  /**
   * @notice A distinct Uniform Resource Identifier (URI) for a given token.
   */
  function tokenURI(uint256 _tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(_exists(_tokenId), "MyMemberToken.tokenURI: nonexistent token");
    uint16 groupId = _groupIdsFromTokenId[_tokenId];

    string memory groupName = string(
      abi.encodePacked(_props[groupId].groupName)
    );
    string memory description = string(
      abi.encodePacked(_props[groupId].description)
    );
    string memory image = Base64.encode(
      _generateSVG(
        _props[groupId].color,
        _props[groupId].groupName,
        groupId,
        _tokenId
      )
    );
    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                groupName,
                '", "description":"',
                description,
                '", "image": "',
                "data:image/svg+xml;base64,",
                image,
                '"}'
              )
            )
          )
        )
      );
  }

  /**
   * @notice Set the mint limit.
   * @dev Only callable by the Owner.
   */
  function setLimit(uint256 _limit) external onlyOwner {
    limit = _limit;
  }
}
