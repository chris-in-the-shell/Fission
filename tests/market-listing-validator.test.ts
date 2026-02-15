import { describe, expect, it } from 'vitest';
import { validateMarketListing } from '../src/market/listingValidator.js';

describe('validateMarketListing', () => {
  it('accepts a valid binary listing', () => {
    const result = validateMarketListing({
      marketId: 'MKT-100',
      title: 'Will protocol launch before Q3?',
      contractType: 'binary',
      settlement: {
        metricName: 'launch_date',
        metricDescription: 'Official launch timestamp',
        dataSources: [
          { name: 'Gov forum', uri: 'https://forum.example.com/post/1' },
          { name: 'Release registry', uri: 'https://registry.example.com/releases' }
        ],
        disputeWindowHours: 48,
        challengeBondUsd: 1500
      },
      manipulationMitigations: ['commit-reveal', 'minimum stake'],
      actionMapping: 'advisory-triggered'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects low dispute window', () => {
    const result = validateMarketListing({
      marketId: 'MKT-101',
      title: 'Low window market',
      contractType: 'binary',
      settlement: {
        metricName: 'x',
        metricDescription: 'x',
        dataSources: [
          { name: 'A', uri: 'https://a.example.com' },
          { name: 'B', uri: 'https://b.example.com' }
        ],
        disputeWindowHours: 6,
        challengeBondUsd: 100
      },
      manipulationMitigations: ['commit-reveal'],
      actionMapping: 'informational'
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Dispute window must be at least 24 hours for safe settlement review.'
    );
  });

  it('rejects conditional listing with insufficient source diversity', () => {
    const result = validateMarketListing({
      marketId: 'MKT-102',
      title: 'Policy A vs B',
      contractType: 'conditional',
      settlement: {
        metricName: 'kpi_delta',
        metricDescription: 'KPI difference',
        dataSources: [
          { name: 'A', uri: 'https://same.example.com' },
          { name: 'A mirror', uri: 'https://same.example.com' }
        ],
        disputeWindowHours: 48,
        challengeBondUsd: 1200
      },
      manipulationMitigations: ['commit-reveal', 'stake minimum'],
      actionMapping: 'bounded-auto'
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Settlement requires at least 2 unique data sources.');
    expect(result.errors).toContain('Conditional markets require at least 3 unique data sources.');
  });

  it('returns warning for weak mitigation set', () => {
    const result = validateMarketListing({
      marketId: 'MKT-103',
      title: 'Weak mitigations',
      contractType: 'scalar',
      settlement: {
        metricName: 'weekly_tvl',
        metricDescription: 'Weekly TVL',
        dataSources: [
          { name: 'A', uri: 'https://a.example.com' },
          { name: 'B', uri: 'https://b.example.com' }
        ],
        disputeWindowHours: 24,
        challengeBondUsd: 100
      },
      manipulationMitigations: ['cooldown'],
      actionMapping: 'bounded-auto'
    });

    expect(result.valid).toBe(true);
    expect(result.warnings).toContain(
      'Provide at least 2 manipulation mitigations for stronger listing quality.'
    );
    expect(result.warnings).toContain(
      'Bounded-auto markets should use a higher challenge bond (>= 1000 USD suggested).'
    );
  });
});
