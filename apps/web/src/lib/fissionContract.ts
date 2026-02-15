export const FISSION_MARKET_ADDRESS =
  (import.meta.env.VITE_FISSION_MARKET_ADDRESS as `0x${string}` | undefined) ??
  '0x0000000000000000000000000000000000000000';

export const fissionMarketAbi = [
  {
    type: 'function',
    name: 'marketCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'createMarket',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'closeTime', type: 'uint256' }
    ],
    outputs: [{ type: 'uint256' }]
  }
] as const;
