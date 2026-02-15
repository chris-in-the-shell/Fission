import { MarketCountCard } from './components/MarketCountCard';

export default function App() {
  return (
    <main
      style={{
        maxWidth: 880,
        margin: '40px auto',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        padding: '0 16px'
      }}
    >
      <h1>Fission dApp Scaffold</h1>
      <p>
        This web client is the initial integration surface for the Fission market protocol.
      </p>
      <MarketCountCard />
    </main>
  );
}
