import { describe, expect, it } from 'vitest';
import {
  aggregateOracleQuotes,
  type OracleAdapter,
  type OracleQuote
} from '../src/oracle/adapters.js';

function createAdapter(sourceId: string, value: number): OracleAdapter {
  return {
    sourceId,
    async fetchQuote(metric: string): Promise<OracleQuote> {
      return {
        sourceId,
        metric,
        value,
        observedAt: '2026-02-16T00:00:00Z'
      };
    }
  };
}

describe('aggregateOracleQuotes', () => {
  it('aggregates median from multiple sources', async () => {
    const response = await aggregateOracleQuotes(
      [createAdapter('a', 12), createAdapter('b', 18), createAdapter('c', 15)],
      'weekly_tvl',
      { minSources: 2 }
    );

    expect(response.ok).toBe(true);
    expect(response.result?.median).toBe(15);
    expect(response.result?.min).toBe(12);
    expect(response.result?.max).toBe(18);
  });

  it('returns failure when valid quote count is below quorum', async () => {
    const brokenAdapter: OracleAdapter = {
      sourceId: 'broken',
      async fetchQuote() {
        throw new Error('upstream timeout');
      }
    };

    const response = await aggregateOracleQuotes(
      [createAdapter('a', 10), brokenAdapter],
      'incident_rate',
      { minSources: 2 }
    );

    expect(response.ok).toBe(false);
    expect(response.errors[0]).toContain('Insufficient valid quotes');
  });

  it('reports metric mismatch from adapter response', async () => {
    const mismatched: OracleAdapter = {
      sourceId: 'mismatch',
      async fetchQuote() {
        return {
          sourceId: 'mismatch',
          metric: 'wrong_metric',
          value: 42,
          observedAt: '2026-02-16T00:00:00Z'
        };
      }
    };

    const response = await aggregateOracleQuotes(
      [createAdapter('a', 10), mismatched],
      'target_metric',
      { minSources: 1 }
    );

    expect(response.ok).toBe(true);
    expect(response.errors.some((error) => error.includes('mismatched metric'))).toBe(true);
    expect(response.result?.quotes).toHaveLength(1);
  });

  it('rejects invalid minSources policy', async () => {
    const response = await aggregateOracleQuotes(
      [createAdapter('a', 10)],
      'weekly_users',
      { minSources: 0 }
    );

    expect(response.ok).toBe(false);
    expect(response.errors[0]).toContain('minSources must be an integer');
  });
});
