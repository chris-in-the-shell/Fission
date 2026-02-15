import { ethers } from 'hardhat';

async function main(): Promise<void> {
  const contractFactory = await ethers.getContractFactory('FissionMarket');
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  console.log('FissionMarket deployed at:', await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
