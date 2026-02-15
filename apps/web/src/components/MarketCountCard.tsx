import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import { fissionMarketAbi, FISSION_MARKET_ADDRESS } from '../lib/fissionContract';

export function MarketCountCard() {
  const { data, isLoading, error } = useReadContract({
    abi: fissionMarketAbi,
    address: FISSION_MARKET_ADDRESS,
    functionName: 'marketCount'
  });

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Fission Market Overview</h2>
      <p style={{ marginBottom: 8 }}>
        Contract: <code>{FISSION_MARKET_ADDRESS}</code>
      </p>
      {isLoading && <p>Loading market count...</p>}
      {error && <p>Unable to read contract. Deploy and set <code>VITE_FISSION_MARKET_ADDRESS</code>.</p>}
      {data !== undefined && <p>Total markets: {Number(data)}</p>}
      <p style={{ fontSize: 12, color: '#555' }}>
        Scaffold note: wallet write flow and richer market views are next steps.
      </p>
      <p style={{ fontSize: 12, color: '#777' }}>
        Utility check (1 wei in ETH): {formatEther(1n)}
      </p>
    </section>
  );
}
