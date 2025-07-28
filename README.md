# 🪙 TokenFarm - Sistema de Staking en Solidity

Este es un proyecto educativo de una plataforma DeFi simple que simula un sistema de **staking con recompensas** al estilo Yield Farming, basado en el modelo de PancakeSwap.

## 📝 Descripción

Este proyecto implementa un **sistema básico de staking** donde los usuarios pueden depositar tokens y obtener recompensas en base al tiempo que mantienen sus tokens bloqueados. Desarrollado en **Solidity** con **Hardhat**.
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

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio:

```bash
git clone https://github.com/tu_usuario/simple-token-farm.git
cd simple-token-farm
npm install
```

### 2. Instalar dependencias:

```bash
npm install
```

### 3. Configurar variables de entorno:

```ini
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/TU_API_KEY
PRIVATE_KEY=TU_CLAVE_PRIVADA
ETHERSCAN_API_KEY=TU_API_KEY_ETHERSCAN
```

⚠️ Importante: No subas .env a GitHub. Agrega en .gitignore:

```
.env
node_modules/
```

## 🔨 Comandos básicos

### **Compilar contratos**:

```bash
npx hardhat compile

```

### 🧪 Ejecutar pruebas

```bash
npx hardhat test

```

## 🚀 Deployment en Testnet Sepolia

Usa tu API Key de Alchemy o Infura:

```bash
npx hardhat run scripts/deploy.ts --network sepolia

```

Ejemplo de salida:

```yaml
Deploying contracts...
TokenFarm deployed at: 0x1234abcd...

```

## 📜 Scripts de Interacción

- Hacer staking
- Reclamar recompensas
- Retirar tokens
  Ejecutar scripts:

```bash
npx hardhat run scripts/stake.ts --network sepolia
```

## ✅ Tests incluidos

Los tests en `test/TokenFarm.ts` cubren:

- Stake de tokens y verificación de balance.

- Reclamo de recompensas.

- Restricciones de solo owner en funciones críticas.

## 🔒 Seguridad implementada

- Validación onlyOwner en funciones administrativas.

- Uso de eventos para auditoría.

## ✅ Contrato desplegado (ejemplo)

Ver en [Etherscan](https://sepolia.etherscan.io)

## Autor

MIT © Walter Greenwich Chaca
