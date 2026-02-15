import { describe, expect, it } from 'vitest';
import {
  runDeliberation,
  type ExpertAgent,
  type ExpertId
} from '../src/orchestration/service.js';

function buildMockAgents(): Record<ExpertId, ExpertAgent> {
  return {
    finance: ({ turn, context }) => ({
      content: `Finance turn ${turn} for ${context.proposalId}`,
      confidence: 'high'
    }),
    technology: ({ turn, transcriptSoFar }) => ({
      content: `Tech turn ${turn}, seen ${transcriptSoFar.length} messages`,
      confidence: 'medium'
    }),
    governance: ({ turn, context }) => ({
      content: `Governance turn ${turn}, summary length ${context.summary.length}`,
      confidence: 'medium'
    })
  };
}

describe('runDeliberation', () => {
  it('runs in deterministic order and returns expected transcript length', async () => {
    const result = await runDeliberation(
      buildMockAgents(),
      {
        proposalId: 'PROP-500',
        summary: 'Improve governance velocity'
      },
      {
        turns: 2,
        clock: () => '2026-02-16T00:00:00.000Z'
      }
    );

    expect(result.transcript).toHaveLength(6);
    expect(result.transcript[0].expertId).toBe('finance');
    expect(result.transcript[1].expertId).toBe('technology');
    expect(result.transcript[2].expertId).toBe('governance');
  });

  it('produces stable transcript hash for identical input and clock', async () => {
    const args = [
      buildMockAgents(),
      {
        proposalId: 'PROP-501',
        summary: 'Stable replay check'
      },
      {
        turns: 1,
        clock: () => '2026-02-16T00:00:00.000Z'
      }
    ] as const;

    const first = await runDeliberation(...args);
    const second = await runDeliberation(...args);

    expect(first.transcriptHash).toBe(second.transcriptHash);
    expect(first.transcript).toEqual(second.transcript);
  });

  it('throws when an agent implementation is missing', async () => {
    const agents = buildMockAgents();
    delete (agents as Partial<Record<ExpertId, ExpertAgent>>).governance;

    await expect(() =>
      runDeliberation(
        agents as Record<ExpertId, ExpertAgent>,
        { proposalId: 'PROP-502', summary: 'x' },
        { turns: 1 }
      )
    ).rejects.toThrow('Missing agent implementation');
  });

  it('rejects invalid turn configuration', async () => {
    await expect(() =>
      runDeliberation(
        buildMockAgents(),
        { proposalId: 'PROP-503', summary: 'x' },
        { turns: 0 }
      )
    ).rejects.toThrow('turns must be an integer');
  });
});
