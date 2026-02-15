import { z } from 'zod';

const isoDate = z
  .string()
  // Accept ISO-like date strings while rejecting invalid date payloads early.
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date string');

const nonEmptyString = z.string().trim().min(1);

const quantitativeDataSchema = z.object({
  budgetUsd: z.number().nonnegative().optional(),
  durationDays: z.number().int().positive().optional(),
  kpis: z.array(nonEmptyString).default([]),
  dependencies: z.array(nonEmptyString).default([])
});

const stakeholderSentimentSchema = z.object({
  supportSummary: nonEmptyString,
  oppositionSummary: nonEmptyString,
  unresolvedQuestions: z.array(nonEmptyString).default([])
});

export const proposalSchema = z.object({
  proposalId: nonEmptyString,
  title: nonEmptyString,
  proposer: nonEmptyString,
  createdAt: isoDate,
  source: z.object({
    type: z.enum(['forum_url', 'markdown', 'json_payload']),
    value: nonEmptyString
  }),
  domain: z.enum([
    'governance',
    'treasury',
    'protocol_upgrade',
    'grants',
    'operations',
    'other'
  ]),
  content: nonEmptyString,
  tags: z.array(nonEmptyString).default([])
});

export const proposalDigestSchema = z.object({
  proposalId: nonEmptyString,
  generatedAt: isoDate,
  summary: nonEmptyString,
  quantitativeData: quantitativeDataSchema,
  stakeholderSentiment: stakeholderSentimentSchema,
  risks: z.array(nonEmptyString).default([]),
  actionability: z.enum(['informational', 'advisory-triggered', 'bounded-auto'])
});

export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalDigest = z.infer<typeof proposalDigestSchema>;

export function validateProposal(input: unknown): Proposal {
  return proposalSchema.parse(input);
}

export function validateProposalDigest(input: unknown): ProposalDigest {
  return proposalDigestSchema.parse(input);
}
