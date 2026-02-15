export {
  proposalSchema,
  proposalDigestSchema,
  validateProposal,
  validateProposalDigest
} from './schemas/proposal.js';
export type { Proposal, ProposalDigest } from './schemas/proposal.js';
export {
  ingestFromForumUrl,
  ingestFromMarkdown,
  ingestFromJsonPayload
} from './ingestion/index.js';
