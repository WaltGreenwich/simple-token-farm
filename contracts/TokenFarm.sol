// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./DappToken.sol";
import "./LPToken.sol";

/**
 * @title Proportional Token Farm
 * @notice Una granja de staking donde las recompensas se distribuyen proporcionalmente al total stakeado.
 */
contract TokenFarm {
    //
    // Variables de estado
    //
    string public name = "Proportional Token Farm";
    address public owner;
    DappToken public dappToken;
    LPToken public lpToken;

    uint256 public constant REWARD_PER_BLOCK = 1e18; // 1 DAPP por bloque
    uint256 public totalStakingBalance; // Total de tokens en staking

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public checkpoints;
    mapping(address => uint256) public pendingRewards;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    //
    // Eventos
    //
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsDistributed(uint256 blockNumber);

    //
    // Constructor
    //
    constructor(DappToken _dappToken, LPToken _lpToken) {
        dappToken = _dappToken;
        lpToken = _lpToken;
        owner = msg.sender;
    }

    //
    // Función para depositar LP tokens y hacer staking
    //
    function deposit(uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");
        distributeRewards(msg.sender);

        lpToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        totalStakingBalance += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        isStaking[msg.sender] = true;

        if (checkpoints[msg.sender] == 0) {
            checkpoints[msg.sender] = block.number;
        }

        emit Deposit(msg.sender, _amount);
    }

    //
    // Función para retirar tokens LP en staking
    //
    function withdraw() external {
        require(isStaking[msg.sender], "You are not staking");

        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "Nothing to withdraw");

        distributeRewards(msg.sender);

        stakingBalance[msg.sender] = 0;
        totalStakingBalance -= balance;
        isStaking[msg.sender] = false;

        lpToken.transfer(msg.sender, balance);

        emit Withdraw(msg.sender, balance);
    }

    //
    // Función para reclamar recompensas acumuladas
    //
    function claimRewards() external {
        uint256 pendingAmount = pendingRewards[msg.sender];
        require(pendingAmount > 0, "No rewards");

        pendingRewards[msg.sender] = 0;
        dappToken.mint(msg.sender, pendingAmount);

        emit RewardsClaimed(msg.sender, pendingAmount);
    }

    //
    // Función que solo el owner puede usar para distribuir recompensas a todos los stakers
    //
    function distributeRewardsAll() external {
        require(msg.sender == owner, "Only owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address user = stakers[i];
            if (isStaking[user]) {
                distributeRewards(user);
            }
        }

        emit RewardsDistributed(block.number);
    }

    //
    // Cálculo proporcional de recompensas por bloque
    //
    function distributeRewards(address beneficiary) private {
        uint256 lastCheckpoint = checkpoints[beneficiary];
        if (block.number <= lastCheckpoint || totalStakingBalance == 0) {
            return;
        }

        uint256 blocksPassed = block.number - lastCheckpoint;
        uint256 share = (stakingBalance[beneficiary] * 1e18) / totalStakingBalance;
        uint256 reward = (REWARD_PER_BLOCK * blocksPassed * share) / 1e18;

        pendingRewards[beneficiary] += reward;
        checkpoints[beneficiary] = block.number;
    }
}
