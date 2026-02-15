import { QueryClient } from '@tanstack/react-query';
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// Wallet connect is intentionally omitted in this scaffold to keep setup dependency-free.
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
});

export const queryClient = new QueryClient();
