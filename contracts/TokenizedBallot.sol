// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
        mapping(address => bool) hasVoted; // Mapping to track whether an address has voted for a proposal
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        require(
            _targetBlockNumber <= block.number,
            "TokenizedBallot: Target block number must be in the past"
        );

        targetBlockNumber = _targetBlockNumber;
        // TODO: Validate if targetBlockNumber is in the past
        for (uint i = 0; i < _proposalNames.length; i++) {
            Proposal storage newProposal = proposals.push();
            newProposal.name = _proposalNames[i];
            newProposal.voteCount = 0;

            // Initialize the mapping for each proposal
            newProposal.hasVoted[msg.sender] = false;
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(
            votingPower(msg.sender) >= amount,
            "TokenizedBallot: trying to vote more than allowed"
        );
        require(
            !proposals[proposal].hasVoted[msg.sender],
            "TokenizedBallot: address has already voted for this proposal"
        );

        proposals[proposal].hasVoted[msg.sender] = true;
        proposals[proposal].voteCount += amount;
    }

    function votingPower(address account) public view returns (uint256) {
        return tokenContract.getPastVotes(account, targetBlockNumber);
        // todo check if this is enough for protecting the contract
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
