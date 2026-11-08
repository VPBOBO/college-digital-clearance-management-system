import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCompletion, normalizeRemark, validateDecision } from '../src/domain.js';
import { AppError } from '../src/errors.js';

function expectAppError(fn, status, code) {
  assert.throws(fn, (error) => error instanceof AppError && error.status === status && error.code === code);
}

test('completion is true only when every mandatory requirement is Approved', () => {
  const result = calculateCompletion([
    { isMandatory: true, status: 'Approved' },
    { isMandatory: true, status: 'Approved' },
    { isMandatory: false, status: 'Pending' }
  ]);
  assert.equal(result.isComplete, true);
  assert.equal(result.configurationValid, true);
  assert.equal(result.mandatoryTotal, 2);
  assert.equal(result.mandatoryApproved, 2);
});

test('a pending or rejected mandatory requirement prevents completion', () => {
  assert.equal(calculateCompletion([
    { isMandatory: true, status: 'Approved' },
    { isMandatory: true, status: 'Pending' }
  ]).isComplete, false);
  assert.equal(calculateCompletion([
    { isMandatory: true, status: 'Rejected' }
  ]).displayLabel, 'Needs Attention');
});

test('zero mandatory requirements is invalid and not complete', () => {
  const result = calculateCompletion([{ isMandatory: false, status: 'Pending' }]);
  assert.equal(result.isComplete, false);
  assert.equal(result.configurationValid, false);
  assert.equal(result.warning, 'NO_MANDATORY_REQUIREMENTS');
});

test('whitespace-only remarks normalize to null', () => {
  assert.equal(normalizeRemark('   \n\t  '), null);
  assert.equal(normalizeRemark('  note  '), 'note');
});

test('REQUIRED reject remarks return 422 when missing or whitespace only', () => {
  expectAppError(() => validateDecision({
    currentStatus: 'Pending', decision: 'Rejected', remarkFlag: 'REQUIRED', remark: '   '
  }), 422, 'REMARK_REQUIRED');
});

test('OPTIONAL reject remarks may be omitted', () => {
  const result = validateDecision({
    currentStatus: 'Pending', decision: 'Rejected', remarkFlag: 'OPTIONAL', remark: '  '
  });
  assert.equal(result.remark, null);
});

test('already-processed state is checked before remark validation and returns 409', () => {
  expectAppError(() => validateDecision({
    currentStatus: 'Approved', decision: 'Rejected', remarkFlag: 'REQUIRED', remark: ''
  }), 409, 'DECISION_CONFLICT');
});

test('unsupported decision returns 422', () => {
  expectAppError(() => validateDecision({
    currentStatus: 'Pending', decision: 'Pending', remarkFlag: 'OPTIONAL'
  }), 422, 'INVALID_DECISION');
});

test('remarks longer than 1000 characters are rejected', () => {
  expectAppError(() => normalizeRemark('x'.repeat(1001)), 422, 'REMARK_TOO_LONG');
});
