import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);

const sourceSchema = z.object({
  name: nonEmptyString,
  uri: nonEmptyString
});

const settlementSchema = z.object({
  metricName: nonEmptyString,
  metricDescription: nonEmptyString,
  dataSources: z.array(sourceSchema).min(1),
  disputeWindowHours: z.number().int().positive(),
  challengeBondUsd: z.number().nonnegative()
});

const marketListingSchema = z.object({
  marketId: nonEmptyString,
  title: nonEmptyString,
  contractType: z.enum(['binary', 'scalar', 'conditional']),
  settlement: settlementSchema,
  manipulationMitigations: z.array(nonEmptyString).min(1),
  actionMapping: z.enum(['informational', 'advisory-triggered', 'bounded-auto'])
});

export type MarketListingCandidate = z.infer<typeof marketListingSchema>;

export interface ListingValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalized?: MarketListingCandidate;
}

function countUniqueSourceUris(dataSources: MarketListingCandidate['settlement']['dataSources']): number {
  const uniqueUris = new Set(dataSources.map((source) => source.uri.trim().toLowerCase()));
  return uniqueUris.size;
}

export function validateMarketListing(input: unknown): ListingValidationResult {
  const parsed = marketListingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => issue.message),
      warnings: []
    };
  }

  const candidate = parsed.data;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (candidate.settlement.disputeWindowHours < 24) {
    errors.push('Dispute window must be at least 24 hours for safe settlement review.');
  }

  if (countUniqueSourceUris(candidate.settlement.dataSources) < 2) {
    errors.push('Settlement requires at least 2 unique data sources.');
  }

  // Conditional markets are expected to compare policy paths and should use stronger source diversity.
  if (
    candidate.contractType === 'conditional' &&
    countUniqueSourceUris(candidate.settlement.dataSources) < 3
  ) {
    errors.push('Conditional markets require at least 3 unique data sources.');
  }

  if (candidate.manipulationMitigations.length < 2) {
    warnings.push('Provide at least 2 manipulation mitigations for stronger listing quality.');
  }

  if (
    candidate.actionMapping === 'bounded-auto' &&
    candidate.settlement.challengeBondUsd < 1000
  ) {
    warnings.push('Bounded-auto markets should use a higher challenge bond (>= 1000 USD suggested).');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalized: candidate
  };
}
