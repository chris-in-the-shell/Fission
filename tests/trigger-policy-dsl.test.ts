import { describe, expect, it } from 'vitest';
import {
  listSupportedTriggerActions,
  parseTriggerPolicyDsl,
  validateTriggerPolicyDsl
} from '../src/trigger/policyDsl.js';

describe('parseTriggerPolicyDsl', () => {
  it('parses a valid trigger policy DSL string', () => {
    const ast = parseTriggerPolicyDsl(
      'when price >= 0.68 for 72h and depth >= 100000 and volatility <= 0.12 and confidence >= 0.7 then queued'
    );

    expect(ast.persistenceHours).toBe(72);
    expect(ast.action).toBe('queued');
    expect(ast.conditions).toHaveLength(4);
  });

  it('throws on malformed DSL', () => {
    expect(() => parseTriggerPolicyDsl('price >= 0.68 then queued')).toThrow(
      'Invalid DSL format'
    );
  });
});

describe('validateTriggerPolicyDsl', () => {
  it('accepts a valid bounded-auto policy with confidence gate', () => {
    const result = validateTriggerPolicyDsl(
      'when price >= 0.8 for 48h and depth >= 50000 and confidence >= 0.9 then bounded-auto'
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects bounded-auto policy missing confidence condition', () => {
    const result = validateTriggerPolicyDsl(
      'when price >= 0.8 for 48h and depth >= 50000 then bounded-auto'
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'bounded-auto action requires an explicit confidence condition.'
    );
  });

  it('returns warning for short persistence windows', () => {
    const result = validateTriggerPolicyDsl('when price >= 0.7 for 12h then advisory');

    expect(result.valid).toBe(true);
    expect(
      result.warnings.some((warning) => warning.includes('under 24h'))
    ).toBe(true);
  });

  it('exposes supported actions', () => {
    expect(listSupportedTriggerActions()).toEqual(['advisory', 'queued', 'bounded-auto']);
  });
});
