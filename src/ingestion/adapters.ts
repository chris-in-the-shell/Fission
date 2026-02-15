import { Proposal, validateProposal } from '../schemas/proposal.js';

interface ProposalMeta {
  proposalId: string;
  title?: string;
  proposer: string;
  createdAt: string;
  domain: Proposal['domain'];
  tags?: string[];
}

interface ForumUrlInput extends ProposalMeta {
  url: string;
  content: string;
}

interface MarkdownInput extends ProposalMeta {
  markdown: string;
}

interface JsonPayloadInput {
  payload: string | unknown;
}

function ensureHttpUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Forum URL must use http or https.');
  }

  return parsed.toString();
}

function extractMarkdownTitle(markdown: string): string | undefined {
  const firstHeading = markdown
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('# '));

  return firstHeading?.replace(/^#\s+/, '').trim();
}

function sanitizeContent(value: string): string {
  return value.trim();
}

export function ingestFromForumUrl(input: ForumUrlInput): Proposal {
  const normalizedUrl = ensureHttpUrl(input.url);
  const normalizedContent = sanitizeContent(input.content);

  return validateProposal({
    proposalId: input.proposalId,
    title: input.title ?? `Proposal ${input.proposalId}`,
    proposer: input.proposer,
    createdAt: input.createdAt,
    source: {
      type: 'forum_url',
      value: normalizedUrl
    },
    domain: input.domain,
    content: normalizedContent,
    tags: input.tags ?? []
  });
}

export function ingestFromMarkdown(input: MarkdownInput): Proposal {
  const normalizedContent = sanitizeContent(input.markdown);
  const extractedTitle = extractMarkdownTitle(normalizedContent);

  return validateProposal({
    proposalId: input.proposalId,
    title: input.title ?? extractedTitle ?? `Proposal ${input.proposalId}`,
    proposer: input.proposer,
    createdAt: input.createdAt,
    source: {
      type: 'markdown',
      value: extractedTitle ?? 'inline-markdown'
    },
    domain: input.domain,
    content: normalizedContent,
    tags: input.tags ?? []
  });
}

export function ingestFromJsonPayload(input: JsonPayloadInput): Proposal {
  const parsed =
    typeof input.payload === 'string' ? JSON.parse(input.payload) : input.payload;

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('JSON payload must parse into an object.');
  }

  const candidate = parsed as Record<string, unknown>;
  const fallbackId = String(candidate.proposalId ?? candidate.id ?? 'payload-proposal');

  return validateProposal({
    proposalId: candidate.proposalId ?? fallbackId,
    title: candidate.title ?? `Proposal ${fallbackId}`,
    proposer: candidate.proposer ?? 'unknown',
    createdAt: candidate.createdAt ?? new Date().toISOString(),
    source: {
      type: 'json_payload',
      value: fallbackId
    },
    domain: candidate.domain ?? 'other',
    content: candidate.content ?? JSON.stringify(candidate),
    tags: Array.isArray(candidate.tags) ? candidate.tags : []
  });
}
