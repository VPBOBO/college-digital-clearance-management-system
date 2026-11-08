import { AppError } from './errors.js';

export const DECISIONS = Object.freeze(['Approved', 'Rejected']);
export const INDIVIDUAL_STATUSES = Object.freeze(['Pending', ...DECISIONS]);

export function normalizeRemark(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new AppError(400, 'INVALID_REMARK', 'Remark must be a string.');
  }
  const trimmed = value.trim();
  if ([...trimmed].length > 1000) {
    throw new AppError(422, 'REMARK_TOO_LONG', 'Remark must not exceed 1000 characters.');
  }
  return trimmed.length ? trimmed : null;
}

/**
 * Validate in the contract's order: reject a second decision first (409),
 * then validate the requested action and remark (422).
 */
export function validateDecision({ currentStatus, decision, remarkFlag, remark }) {
  if (currentStatus !== 'Pending') {
    throw new AppError(409, 'DECISION_CONFLICT', 'This requirement has already been processed.');
  }

  if (!DECISIONS.includes(decision)) {
    throw new AppError(422, 'INVALID_DECISION', 'Decision must be Approved or Rejected.');
  }

  const normalizedRemark = normalizeRemark(remark);
  if (decision === 'Rejected' && remarkFlag === 'REQUIRED' && !normalizedRemark) {
    throw new AppError(422, 'REMARK_REQUIRED', 'A non-empty remark is required to reject this requirement.');
  }

  return { decision, remark: normalizedRemark };
}

export function calculateCompletion(requirements) {
  if (!Array.isArray(requirements)) {
    throw new TypeError('requirements must be an array');
  }

  const mandatory = requirements.filter((item) => item.isMandatory === true);
  const total = mandatory.length;
  const approved = mandatory.filter((item) => item.status === 'Approved').length;
  const rejected = mandatory.filter((item) => item.status === 'Rejected').length;
  const valid = total > 0;
  const isComplete = valid && approved === total;

  let displayLabel = 'In Progress';
  if (!valid) displayLabel = 'Needs Attention';
  else if (isComplete) displayLabel = 'Requirements Complete';
  else if (rejected > 0) displayLabel = 'Needs Attention';

  return {
    isComplete,
    configurationValid: valid,
    mandatoryTotal: total,
    mandatoryApproved: approved,
    mandatoryRejected: rejected,
    displayLabel,
    warning: valid ? null : 'NO_MANDATORY_REQUIREMENTS'
  };
}
