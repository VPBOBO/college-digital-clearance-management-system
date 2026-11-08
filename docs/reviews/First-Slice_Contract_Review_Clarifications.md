# First-Slice Contract Review Clarifications — Pilot Disposition

**Applies to:** First-Slice Technical Contract Draft 0.3  
**Recorded:** 2026-11-07  
**Status:** Implemented as provisional first-slice behavior; not a new contract revision and not a formal closure of open baseline decisions.

The project owner is the sole author/decision-maker for the project foundation. These points do not require a team meeting to maintain the baseline or MVP documents. They are recorded here so the implementation behavior is explicit. The owner may revise these pilot choices as evidence or implementation experience warrants.

1. **Response codes and remarks**
   - Missing or whitespace-only `REQUIRED` rejection remark returns `422`.
   - Office Staff B acting on Office A's record returns `403`.
   - A student attempting a staff decision returns `403`.
   - Whitespace-only remarks are empty after trimming.
   - Current state is checked before remark validation. A second decision returns `409`, even if its remark is also missing.

2. **Record-existence disclosure**
   - Pilot accepts `403` for an existing record outside a reviewer's office and `404` for a nonexistent record. This can reveal existence; it is a documented demonstration trade-off, not a universal security recommendation.
   - Student access returns identical `404` response bodies for nonexistent and not-owned requests.

3. **Review-list behavior**
   - Default filter: Pending only.
   - Supported filters: Pending, Approved, Rejected, All.
   - Every view remains limited to the reviewer's active office assignment and active office.

4. **Inactive authorization data**
   - An inactive account cannot use its session.
   - An inactive role assignment does not authorize a protected route.
   - An inactive OfficeStaffAssignment or inactive office does not authorize review or processing.
   - Inactive templates/requirements are excluded from new assignment; inactive template requirements/definitions are not exposed in the active review queue or decision path.

5. **Real concurrency**
   - FS-13 issues two decision requests in parallel; exactly one must succeed and one return `409`.
   - FS-16 issues two assignment service calls in parallel; one creates and one reuses the request, with no duplicate rows.

6. **History assertions**
   - Verify actor, timestamp, remark, `previousStatus`, and `newStatus`.

7. **Password assertions**
   - Stored Argon2id hash begins with `$argon2id$` and has `m=19456,t=2,p=1` for this pilot fixture.
   - API responses do not expose password hashes. Test output must never print hashes or passwords.
   - Final Argon2id parameters remain subject to benchmarking and owner decision; the seed password is random and printed once locally.

8. **Duplicate-assignment response behavior**
   - A future assignment endpoint should return `201 Created` for a newly created request and `200 OK` when reusing an existing request.
   - The present first slice exercises the assignment service from the seed and integration tests; there is not yet a public admin assignment endpoint.

9. **TD-011 exact wording**
   - Use the baseline text: “Evaluate the compatibility and suitability of the established stack before implementation starts.”
   - TD-011 is broader than M3 environment checks. It includes project fit and developer hardware suitability. M3 is evidence for the evaluation, not its entire scope.

10. **Execution-plan reference**
    - The contract implementation sequence expands P0–P7 from plan v0.3. P0 is requirements/scope, P1 repository/application shells/environment readiness, P2 data/API design, then later product increments.

11. **Login hardening exclusions**
    - Login lockout and rate limiting are deferred from this pilot.
    - The authentication implementation is for local academic demonstration, not a production-ready deployment.

## Implementation status

The provisional behaviors above are reflected in backend source and tests where relevant. They have not all been executed against the owner's PostgreSQL/Android environment yet. See `../implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md` and `../development-progress.md` for evidence limits.


## Follow-up clarifications incorporated into implementation pilot

- Required rejection remarks return `422` when missing or whitespace-only; remarks are trimmed and limited to 1,000 characters.
- Wrong staff office assignment and wrong role return `403`; student-owned and nonexistent clearance requests return the same `404` body.
- Review queue defaults to Pending and supports `status=Pending|Approved|Rejected|All`.
- Reviewer detail retrieval is office-scoped and returns `404` for an unassigned record.
- Two competing decisions are tested concurrently; exactly one should succeed and one should receive `409`.
- Concurrent duplicate assignment attempts must result in one created request and one reuse.
- Decision history tests verify actor, previous status, new status, timestamp, and remark.
- Missing login returns `401`; lockout and rate limiting remain deferred.
- FS-04 and FS-09 now have integration-test cases; the Android FS-12 view remains a manual emulator test.
- FS-02 includes a backend-service test rejecting a template with zero applicable mandatory requirements.

- Existence disclosure is an explicit pilot choice: decision action returns 403 for an existing item outside the reviewer’s office and 404 for a nonexistent item; the reviewer detail route hides both as 404. Student ownership/nonexistence 404 bodies are identical. This trade-off is not recommended as a production security policy without review.
