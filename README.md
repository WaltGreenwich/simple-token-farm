# 🧑‍🌾 Simple Token Farm (DeFi Yield Farming)

Este es un proyecto educativo de una plataforma DeFi simple que simula un sistema de **staking con recompensas** al estilo Yield Farming, basado en el modelo de PancakeSwap.

## 📝 Descripción

Este contrato inteligente permite a los usuarios:

- Hacer **staking** de un token LP (liquidity provider).
- Acumular **recompensas proporcionales** en tokens DAPP.
- Reclamar recompensas en cualquier momento.
- Retirar completamente sus tokens stakeados.

## 🧱 Estructura de Contratos

- **DappToken.sol**: Token de recompensa (ERC20).
- **LPToken.sol**: Token LP (ERC20), simula un par de liquidez.
- **TokenFarm.sol**: Lógica de staking, cálculo de recompensas y administración del sistema.

## 🛠 Requisitos

- Node.js v16+
- Hardhat
- NPM

## 🚀 Instalación

```bash
git clone https://github.com/tu_usuario/simple-token-farm.git
cd simple-token-farm
npm install
```

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## 🔨 Compilar contratos

```bash
npx hardhat compile

```

## 🧪 Ejecutar nodo local

```bash
npx hardhat node

```

## 🚀 Desplegar en red local

En una segunda terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost

```

## 📜 Licencia

MIT © Walter Greenwich

---
