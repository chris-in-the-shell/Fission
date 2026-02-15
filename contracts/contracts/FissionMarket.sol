// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FissionMarket
/// @notice Minimal prediction market contract used to bootstrap dApp integration.
contract FissionMarket {
    struct Market {
        string question;
        uint256 closeTime;
        bool resolved;
        bool outcome;
        uint256 yesPool;
        uint256 noPool;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesShares;
    mapping(uint256 => mapping(address => uint256)) public noShares;
    uint256 public marketCount;

    event MarketCreated(uint256 indexed marketId, string question, uint256 closeTime);
    event PositionTaken(uint256 indexed marketId, address indexed user, bool side, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 payout);

    function createMarket(string calldata question, uint256 closeTime) external returns (uint256 marketId) {
        require(bytes(question).length > 0, 'Question required');
        require(closeTime > block.timestamp, 'Close time must be in the future');

        marketId = marketCount;
        marketCount += 1;

        markets[marketId] = Market({
            question: question,
            closeTime: closeTime,
            resolved: false,
            outcome: false,
            yesPool: 0,
            noPool: 0
        });

        emit MarketCreated(marketId, question, closeTime);
    }

    /// @notice Buys shares on one side of a market with ETH.
    function buy(uint256 marketId, bool side) external payable {
        Market storage market = markets[marketId];
        require(bytes(market.question).length > 0, 'Market does not exist');
        require(block.timestamp < market.closeTime, 'Market closed');
        require(msg.value > 0, 'Amount must be positive');

        if (side) {
            yesShares[marketId][msg.sender] += msg.value;
            market.yesPool += msg.value;
        } else {
            noShares[marketId][msg.sender] += msg.value;
            market.noPool += msg.value;
        }

        emit PositionTaken(marketId, msg.sender, side, msg.value);
    }

    /// @notice Demo-only resolver; production version should be controlled by oracle/dispute flow.
    function resolve(uint256 marketId, bool outcome) external {
        Market storage market = markets[marketId];
        require(bytes(market.question).length > 0, 'Market does not exist');
        require(block.timestamp >= market.closeTime, 'Market not closed');
        require(!market.resolved, 'Already resolved');

        market.resolved = true;
        market.outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    function claim(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.resolved, 'Market not resolved');

        uint256 winnerPool = market.outcome ? market.yesPool : market.noPool;
        uint256 loserPool = market.outcome ? market.noPool : market.yesPool;

        uint256 userShares;
        if (market.outcome) {
            userShares = yesShares[marketId][msg.sender];
            yesShares[marketId][msg.sender] = 0;
        } else {
            userShares = noShares[marketId][msg.sender];
            noShares[marketId][msg.sender] = 0;
        }

        require(userShares > 0, 'No winnings to claim');

        // Payout distributes the full pool proportionally across winning shares.
        uint256 payout = userShares + ((userShares * loserPool) / winnerPool);
        (bool sent, ) = msg.sender.call{value: payout}('');
        require(sent, 'Transfer failed');

        emit Claimed(marketId, msg.sender, payout);
    }
}
