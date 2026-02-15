import { describe, expect, it } from 'vitest';
import {
  validateProposal,
  validateProposalDigest,
  proposalSchema,
  proposalDigestSchema
} from '../src/index.js';

describe('proposalSchema', () => {
  it('accepts a valid proposal object', () => {
    const input = {
      proposalId: 'PROP-001',
      title: 'Treasury Budget Reallocation Q2',
      proposer: 'governance-ops',
      createdAt: '2026-02-15T00:00:00Z',
      source: {
        type: 'forum_url',
        value: 'https://forum.example.com/t/prop-001'
      },
      domain: 'treasury',
      content: 'Reallocate 15% budget to reliability initiatives',
      tags: ['budget', 'reliability']
    };

    const parsed = validateProposal(input);
    expect(parsed.proposalId).toBe('PROP-001');
    expect(parsed.source.type).toBe('forum_url');
  });

  it('rejects a proposal with invalid date', () => {
    const input = {
      proposalId: 'PROP-002',
      title: 'Invalid Date Proposal',
      proposer: 'ops',
      createdAt: 'not-a-date',
      source: {
        type: 'json_payload',
        value: 'payload-id-1'
      },
      domain: 'operations',
      content: 'content'
    };

    expect(() => validateProposal(input)).toThrow();
  });

  it('applies default tags as empty array', () => {
    const input = {
      proposalId: 'PROP-003',
      title: 'No Tags',
      proposer: 'ops',
      createdAt: '2026-02-15',
      source: {
        type: 'markdown',
        value: '# Proposal'
      },
      domain: 'governance',
      content: 'desc'
    };

    const parsed = proposalSchema.parse(input);
    expect(parsed.tags).toEqual([]);
  });
});

describe('proposalDigestSchema', () => {
  it('accepts a valid proposal digest', () => {
    const input = {
      proposalId: 'PROP-001',
      generatedAt: '2026-02-16T00:00:00Z',
      summary: 'Proposal improves reliability metrics with moderate cost.',
      quantitativeData: {
        budgetUsd: 250000,
        durationDays: 60,
        kpis: ['error_rate', 'incident_count'],
        dependencies: ['team-availability']
      },
      stakeholderSentiment: {
        supportSummary: 'Most delegates support phased rollout.',
        oppositionSummary: 'Some oppose timeline compression.',
        unresolvedQuestions: ['How to backfill staffing?']
      },
      risks: ['timeline risk'],
      actionability: 'advisory-triggered'
    };

    const parsed = validateProposalDigest(input);
    expect(parsed.quantitativeData.budgetUsd).toBe(250000);
    expect(parsed.actionability).toBe('advisory-triggered');
  });

  it('rejects digest without stakeholder sentiment summaries', () => {
    const input = {
      proposalId: 'PROP-001',
      generatedAt: '2026-02-16',
      summary: 'summary',
      quantitativeData: {},
      stakeholderSentiment: {
        supportSummary: '',
        oppositionSummary: 'none'
      },
      actionability: 'informational'
    };

    expect(() => proposalDigestSchema.parse(input)).toThrow();
  });

  it('applies defaults for optional arrays', () => {
    const input = {
      proposalId: 'PROP-004',
      generatedAt: '2026-02-16',
      summary: 'summary',
      quantitativeData: {},
      stakeholderSentiment: {
        supportSummary: 'support',
        oppositionSummary: 'opposition'
      },
      actionability: 'bounded-auto'
    };

    const parsed = validateProposalDigest(input);
    expect(parsed.quantitativeData.kpis).toEqual([]);
    expect(parsed.quantitativeData.dependencies).toEqual([]);
    expect(parsed.stakeholderSentiment.unresolvedQuestions).toEqual([]);
    expect(parsed.risks).toEqual([]);
  });
});
