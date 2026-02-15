import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('FissionMarket', function () {
  it('creates a market and accepts positions', async function () {
    const [owner, user] = await ethers.getSigners();
    const factory = await ethers.getContractFactory('FissionMarket');
    const market = await factory.deploy();
    await market.waitForDeployment();

    const now = (await ethers.provider.getBlock('latest'))!.timestamp;
    const closeTime = now + 3600;

    await expect(market.createMarket('Will launch ship on time?', closeTime))
      .to.emit(market, 'MarketCreated');

    await expect(market.connect(user).buy(0, true, { value: ethers.parseEther('1') }))
      .to.emit(market, 'PositionTaken');
  });
});
