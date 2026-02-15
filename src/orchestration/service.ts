import { createHash } from 'node:crypto';

export type ExpertId = 'finance' | 'technology' | 'governance';

export interface DeliberationContext {
  proposalId: string;
  summary: string;
  constraints?: string[];
}

export interface AgentMessage {
  expertId: ExpertId;
  turn: number;
  content: string;
  confidence: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface AgentExecutionInput {
  expertId: ExpertId;
  turn: number;
  context: DeliberationContext;
  transcriptSoFar: AgentMessage[];
}

export interface AgentExecutionOutput {
  content: string;
  confidence: AgentMessage['confidence'];
}

export type ExpertAgent = (
  input: AgentExecutionInput
) => Promise<AgentExecutionOutput> | AgentExecutionOutput;

export interface DeliberationRunConfig {
  turns: number;
  expertOrder?: ExpertId[];
  clock?: () => string;
}

export interface DeliberationResult {
  transcript: AgentMessage[];
  transcriptHash: string;
}

const DEFAULT_ORDER: ExpertId[] = ['finance', 'technology', 'governance'];

function validateRunConfig(config: DeliberationRunConfig): void {
  if (!Number.isInteger(config.turns) || config.turns < 1) {
    throw new Error('turns must be an integer greater than or equal to 1.');
  }
}

function buildTranscriptHash(transcript: AgentMessage[]): string {
  // Hash normalized transcript content so replay checks can detect mutation.
  const canonical = transcript.map((msg) => ({
    expertId: msg.expertId,
    turn: msg.turn,
    content: msg.content,
    confidence: msg.confidence,
    timestamp: msg.timestamp
  }));

  return createHash('sha256')
    .update(JSON.stringify(canonical))
    .digest('hex');
}

export async function runDeliberation(
  agents: Record<ExpertId, ExpertAgent>,
  context: DeliberationContext,
  config: DeliberationRunConfig
): Promise<DeliberationResult> {
  validateRunConfig(config);

  const order = config.expertOrder ?? DEFAULT_ORDER;
  const clock = config.clock ?? (() => new Date().toISOString());
  const transcript: AgentMessage[] = [];

  for (let turn = 1; turn <= config.turns; turn += 1) {
    for (const expertId of order) {
      const agent = agents[expertId];
      if (!agent) {
        throw new Error(`Missing agent implementation for expert: ${expertId}`);
      }

      const output = await agent({
        expertId,
        turn,
        context,
        transcriptSoFar: transcript
      });

      transcript.push({
        expertId,
        turn,
        content: output.content,
        confidence: output.confidence,
        timestamp: clock()
      });
    }
  }

  return {
    transcript,
    transcriptHash: buildTranscriptHash(transcript)
  };
}
