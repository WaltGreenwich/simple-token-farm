const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // LP Token
  const LPToken = await hre.ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy(deployer.address);
  await lpToken.waitForDeployment(); // 👈 reemplaza deployed()
  console.log("LPToken deployed to:", await lpToken.getAddress());

  // Dapp Token
  const DappToken = await hre.ethers.getContractFactory("DappToken");
  const dappToken = await DappToken.deploy(deployer.address);
  await dappToken.waitForDeployment();
  console.log("DappToken deployed to:", await dappToken.getAddress());

  // TokenFarm
  const TokenFarm = await hre.ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(
    await dappToken.getAddress(),
    await lpToken.getAddress()
  );
  await tokenFarm.waitForDeployment();
  console.log("TokenFarm deployed to:", await tokenFarm.getAddress());
}

main().catch((error) => {
  console.error("🚨 Error:", error);
  process.exit(1);
});
