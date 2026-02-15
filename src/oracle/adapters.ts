export interface OracleQuote {
  sourceId: string;
  metric: string;
  value: number;
  observedAt: string;
}

export interface OracleAdapter {
  sourceId: string;
  fetchQuote(metric: string): Promise<OracleQuote>;
}

export interface OracleAggregateResult {
  metric: string;
  quotes: OracleQuote[];
  median: number;
  min: number;
  max: number;
}

export interface OracleAggregationPolicy {
  minSources: number;
}

export interface OracleAggregationResponse {
  ok: boolean;
  result?: OracleAggregateResult;
  errors: string[];
}

function sortNumbers(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function median(values: number[]): number {
  const sorted = sortNumbers(values);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

/**
 * Runs all adapters in parallel and only keeps successful quote responses.
 * Failed sources are returned in `errors` for settlement transparency.
 */
export async function collectOracleQuotes(
  adapters: OracleAdapter[],
  metric: string
): Promise<{ quotes: OracleQuote[]; errors: string[] }> {
  const settled = await Promise.allSettled(
    adapters.map((adapter) => adapter.fetchQuote(metric))
  );

  const quotes: OracleQuote[] = [];
  const errors: string[] = [];

  for (let i = 0; i < settled.length; i += 1) {
    const outcome = settled[i];
    const adapter = adapters[i];

    if (outcome.status === 'fulfilled') {
      const quote = outcome.value;
      if (quote.metric !== metric) {
        errors.push(
          `Adapter ${adapter.sourceId} returned mismatched metric '${quote.metric}'.`
        );
        continue;
      }
      quotes.push(quote);
      continue;
    }

    errors.push(`Adapter ${adapter.sourceId} failed: ${String(outcome.reason)}`);
  }

  return { quotes, errors };
}

export async function aggregateOracleQuotes(
  adapters: OracleAdapter[],
  metric: string,
  policy: OracleAggregationPolicy
): Promise<OracleAggregationResponse> {
  if (!Number.isInteger(policy.minSources) || policy.minSources < 1) {
    return {
      ok: false,
      errors: ['minSources must be an integer greater than or equal to 1.']
    };
  }

  const { quotes, errors } = await collectOracleQuotes(adapters, metric);

  if (quotes.length < policy.minSources) {
    return {
      ok: false,
      errors: [
        `Insufficient valid quotes: required ${policy.minSources}, got ${quotes.length}.`,
        ...errors
      ]
    };
  }

  const values = quotes.map((quote) => quote.value);

  return {
    ok: true,
    result: {
      metric,
      quotes,
      median: median(values),
      min: Math.min(...values),
      max: Math.max(...values)
    },
    errors
  };
}
