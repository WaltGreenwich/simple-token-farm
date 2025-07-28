const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("TokenFarm", function () {
  let owner, user, user1;
  let dappToken, lpToken, tokenFarm;

  beforeEach(async () => {
    [owner, user, user1] = await ethers.getSigners();

    // ✅ Desplegar contratos
    const DappToken = await ethers.getContractFactory("DappToken", owner);
    dappToken = await DappToken.deploy(owner.address);
    await dappToken.waitForDeployment();

    const LPToken = await ethers.getContractFactory("LPToken", owner);
    lpToken = await LPToken.deploy(owner.address);
    await lpToken.waitForDeployment();

    const TokenFarm = await ethers.getContractFactory("TokenFarm", owner);
    tokenFarm = await TokenFarm.deploy(
      await dappToken.getAddress(),
      await lpToken.getAddress()
    );
    await tokenFarm.waitForDeployment();

    // ✅ Transfer ownership del DappToken al TokenFarm
    await dappToken
      .connect(owner)
      .transferOwnership(await tokenFarm.getAddress());

    // ✅ Mint LP tokens para user y user1
    await lpToken.connect(owner).mint(user.address, ethers.parseEther("100"));
    await lpToken.connect(owner).mint(user1.address, ethers.parseEther("100"));

    // ✅ Aprobar que TokenFarm pueda mover LP tokens
    await lpToken
      .connect(user)
      .approve(await tokenFarm.getAddress(), ethers.parseEther("100"));
    await lpToken
      .connect(user1)
      .approve(await tokenFarm.getAddress(), ethers.parseEther("100"));
  });

  it("Permite hacer staking y actualiza balance", async function () {
    await tokenFarm.connect(user).deposit(ethers.parseEther("50"));
    const balance = await tokenFarm.stakingBalance(user.address);
    expect(balance).to.equal(ethers.parseEther("50"));
  });

  it("Permite reclamar recompensas después de depositar", async function () {
    await tokenFarm.connect(user).deposit(ethers.parseEther("50"));

    // Simular avance de bloques
    await network.provider.send("evm_mine");
    await network.provider.send("evm_mine");
    await network.provider.send("evm_mine");

    await tokenFarm.connect(user).claimRewards();

    const rewardBalance = await dappToken.balanceOf(user.address);
    expect(rewardBalance).to.be.gt(0n);
  });

  it("Solo el owner puede llamar a distributeRewardsAll", async function () {
    await expect(
      tokenFarm.connect(user).distributeRewardsAll()
    ).to.be.revertedWith("Only owner");

    await expect(tokenFarm.connect(owner).distributeRewardsAll()).to.not.be
      .reverted;
  });

  it("No permite reclamar recompensas si no ha hecho staking", async function () {
    await expect(tokenFarm.connect(user1).claimRewards()).to.be.revertedWith(
      "No rewards"
    );
  });

  it("No permite depositar 0 tokens", async function () {
    await expect(tokenFarm.connect(user1).deposit(0)).to.be.revertedWith(
      "Amount must be > 0"
    ); // Ajusta si tu contrato usa otro mensaje
  });

  it("Permite distribuir recompensas como owner después de depósitos", async function () {
    await tokenFarm.connect(user).deposit(ethers.parseEther("10"));
    await tokenFarm.connect(user1).deposit(ethers.parseEther("20"));

    await expect(tokenFarm.connect(owner).distributeRewardsAll()).to.not.be
      .reverted;
  });
});
