import { describe, expect, it } from 'vitest';
import {
  ingestFromForumUrl,
  ingestFromJsonPayload,
  ingestFromMarkdown
} from '../src/ingestion/adapters.js';

describe('ingestFromForumUrl', () => {
  it('normalizes valid forum URL input', () => {
    const result = ingestFromForumUrl({
      proposalId: 'P-100',
      proposer: 'ops-team',
      createdAt: '2026-02-16T00:00:00Z',
      domain: 'governance',
      url: 'https://forum.example.com/t/p-100',
      content: '  governance content  '
    });

    expect(result.source.type).toBe('forum_url');
    expect(result.source.value).toBe('https://forum.example.com/t/p-100');
    expect(result.content).toBe('governance content');
  });

  it('rejects non-http URL', () => {
    expect(() =>
      ingestFromForumUrl({
        proposalId: 'P-101',
        proposer: 'ops-team',
        createdAt: '2026-02-16T00:00:00Z',
        domain: 'governance',
        url: 'ftp://forum.example.com/p-101',
        content: 'x'
      })
    ).toThrow();
  });
});

describe('ingestFromMarkdown', () => {
  it('extracts title from markdown heading when title missing', () => {
    const result = ingestFromMarkdown({
      proposalId: 'P-200',
      proposer: 'research',
      createdAt: '2026-02-16T00:00:00Z',
      domain: 'operations',
      markdown: '# Reliability Initiative\n\nImprove SLOs by 15%'
    });

    expect(result.title).toBe('Reliability Initiative');
    expect(result.source.type).toBe('markdown');
  });
});

describe('ingestFromJsonPayload', () => {
  it('accepts a JSON string payload', () => {
    const result = ingestFromJsonPayload({
      payload: JSON.stringify({
        proposalId: 'P-300',
        title: 'Payload Proposal',
        proposer: 'automation',
        createdAt: '2026-02-16T00:00:00Z',
        domain: 'treasury',
        content: 'Allocate budget',
        tags: ['budget']
      })
    });

    expect(result.proposalId).toBe('P-300');
    expect(result.source.type).toBe('json_payload');
  });

  it('throws when payload is not object-like', () => {
    expect(() => ingestFromJsonPayload({ payload: '"not-object"' })).toThrow();
  });
});
