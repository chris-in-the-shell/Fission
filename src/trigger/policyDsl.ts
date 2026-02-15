const SUPPORTED_ACTIONS = ['advisory', 'queued', 'bounded-auto'] as const;

type SupportedAction = (typeof SUPPORTED_ACTIONS)[number];

type Comparator = '>=' | '<=' | '>' | '<' | '=';

export interface TriggerCondition {
  field: 'price' | 'depth' | 'volatility' | 'confidence';
  comparator: Comparator;
  value: number;
}

export interface TriggerPolicyAst {
  raw: string;
  conditions: TriggerCondition[];
  persistenceHours: number;
  action: SupportedAction;
}

export interface TriggerPolicyValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  ast?: TriggerPolicyAst;
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function parseComparator(token: string): Comparator {
  const match = token.match(/(>=|<=|>|<|=)/);
  if (!match) {
    throw new Error(`Unsupported comparator in token '${token}'.`);
  }

  return match[1] as Comparator;
}

function parseCondition(token: string): TriggerCondition {
  const cleaned = token.trim();
  const comparator = parseComparator(cleaned);
  const [fieldRaw, valueRaw] = cleaned.split(comparator).map((part) => part.trim());

  const allowedFields: TriggerCondition['field'][] = [
    'price',
    'depth',
    'volatility',
    'confidence'
  ];

  if (!allowedFields.includes(fieldRaw as TriggerCondition['field'])) {
    throw new Error(`Unsupported condition field '${fieldRaw}'.`);
  }

  const numericValue = Number(valueRaw);
  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid numeric value '${valueRaw}' for field '${fieldRaw}'.`);
  }

  return {
    field: fieldRaw as TriggerCondition['field'],
    comparator,
    value: numericValue
  };
}

/**
 * DSL format:
 * when <cond> for <hours>h and <cond> and <cond> then <action>
 *
 * Example:
 * when price >= 0.68 for 72h and depth >= 100000 and volatility <= 0.12 and confidence >= 0.7 then queued
 */
export function parseTriggerPolicyDsl(input: string): TriggerPolicyAst {
  const normalized = normalizeWhitespace(input);

  const regex = /^when (.+) for (\d+)h(?: and (.+))? then (advisory|queued|bounded-auto)$/i;
  const match = normalized.match(regex);

  if (!match) {
    throw new Error('Invalid DSL format. Expected: when <cond> for <hours>h and <cond> then <action>.');
  }

  const firstConditionToken = match[1];
  const persistenceHours = Number(match[2]);
  const extraConditionBlock = match[3];
  const action = match[4].toLowerCase() as SupportedAction;

  const conditionTokens = [firstConditionToken];
  if (extraConditionBlock) {
    conditionTokens.push(...extraConditionBlock.split(' and ').map((token) => token.trim()));
  }

  const conditions = conditionTokens.map(parseCondition);

  return {
    raw: input,
    conditions,
    persistenceHours,
    action
  };
}

export function validateTriggerPolicyDsl(input: string): TriggerPolicyValidationResult {
  let ast: TriggerPolicyAst;

  try {
    ast = parseTriggerPolicyDsl(input);
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Failed to parse trigger DSL.'],
      warnings: []
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (ast.persistenceHours < 1) {
    errors.push('Persistence window must be at least 1 hour.');
  }

  const conditionByField = new Map(ast.conditions.map((condition) => [condition.field, condition]));

  const priceCondition = conditionByField.get('price');
  if (!priceCondition) {
    errors.push('Price condition is required.');
  }

  if (priceCondition && (priceCondition.value < 0 || priceCondition.value > 1)) {
    errors.push('Price threshold must be between 0 and 1.');
  }

  const confidenceCondition = conditionByField.get('confidence');
  if (confidenceCondition && (confidenceCondition.value < 0 || confidenceCondition.value > 1)) {
    errors.push('Confidence threshold must be between 0 and 1.');
  }

  const depthCondition = conditionByField.get('depth');
  if (depthCondition && depthCondition.value <= 0) {
    errors.push('Depth threshold must be greater than 0.');
  }

  const volatilityCondition = conditionByField.get('volatility');
  if (volatilityCondition && volatilityCondition.value < 0) {
    errors.push('Volatility threshold cannot be negative.');
  }

  if (ast.action === 'bounded-auto' && !confidenceCondition) {
    errors.push('bounded-auto action requires an explicit confidence condition.');
  }

  if (ast.persistenceHours < 24) {
    warnings.push('Persistence windows under 24h may be more sensitive to short-term noise.');
  }

  if (ast.conditions.length < 2) {
    warnings.push('Use at least 2 conditions to reduce single-signal trigger risk.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    ast
  };
}

export function listSupportedTriggerActions(): readonly SupportedAction[] {
  return SUPPORTED_ACTIONS;
}
