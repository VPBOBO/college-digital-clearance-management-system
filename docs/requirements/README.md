# Requirements Baseline: College Digital Clearance Management System

**Baseline:** 0.1 (DRAFT) · **Created:** 2026-11-04 · **Change history:** [../change-log.md](../change-log.md)

This folder is the editable requirements baseline. It is deliberately **modular**: each file owns one subject, so one requirement can be added, replaced, updated or removed without touching unrelated files.

It contains **no database schema and no application code**. Those wait for the actual clearance form (see [form-dependent-decisions.md](form-dependent-decisions.md)).

## 1. Module index

| File | ID prefix | Owns | Replace or update when |
|---|---|---|---|
| [00-sources.md](00-sources.md) | SRC | Register of information sources | A new source arrives |
| [academic-structure.md](academic-structure.md) | AS | Colleges, departments, programs, terms, subjects, sections | College terminology is confirmed |
| [student-classifications.md](student-classifications.md) | SC | Regular/irregular and any other classifications | Classification rules are confirmed |
| [offices.md](offices.md) | OF | Administrative offices and what they do | The form's signatories are known |
| [instructor-responsibilities.md](instructor-responsibilities.md) | IR | What instructors sign and for whom | Instructor participation is confirmed |
| [clearance-requirements.md](clearance-requirements.md) | CR | Requirement templates, applicability, mandatory/optional | The form's requirement list is known |
| [approval-workflow.md](approval-workflow.md) | AW | Statuses, completion rule, sequencing, rejection handling | Real approval procedure is known |
| [roles-permissions.md](roles-permissions.md) | RP | Roles and the permission matrix | Real roles are confirmed |
| [academic-policies.md](academic-policies.md) | AP | Clearance period, who is cleared, retention, privacy | College policies are obtained |
| [records-and-history.md](records-and-history.md) | RH | Preservation of historical clearance records | Retention policy is confirmed |
| [mvp-scope.md](mvp-scope.md) | MVP, MAC | MVP features, prioritization, acceptance criteria | Scope changes |
| [non-functional-requirements.md](non-functional-requirements.md) | NFR | Security, portability, quality targets | Targets are set |
| [open-questions.md](open-questions.md) | OQ | Consolidated unresolved questions | Any question is answered |
| [form-dependent-decisions.md](form-dependent-decisions.md) | FD | Decisions blocked on the clearance form | The form arrives |
| [form-integration-checklist.md](form-integration-checklist.md) | n/a | Step-by-step procedure for adopting the form | Procedure changes |
| [../decisions.md](../decisions.md) | TD | Technical decisions (established vs recommended) | A decision is made or changed |
| [../change-log.md](../change-log.md) | CHG | Every change to any requirement or decision | Every change |

## 2. Information status

Every entry carries exactly one of these (definitions from SRC-02 §1):

| Status | Meaning |
|---|---|
| CONFIRMED | Verified. See the scope note below. |
| PROVISIONAL | Temporary assumption or proposal awaiting confirmation. |
| UNKNOWN | Information not yet obtained. A placeholder such as `[OFFICE_LIST]` marks the gap. |
| NOT APPLICABLE | Confirmed as irrelevant to the project. |

**Scope of CONFIRMED (please check this interpretation).**

- In **section A (system requirements)** of each module and in `decisions.md`, CONFIRMED means *explicitly specified by the project owner* in the cited source (SRC-01, SRC-02, SRC-04). It says "this is a project requirement", not "the college confirmed it".
- In **section B (institutional information register)**, CONFIRMED means *verified from actual institutional information* (the clearance form, a policy document, or an interview). At baseline 0.1 **no section B item is CONFIRMED**.

Anything proposed by an AI assistant (including items documented in SRC-05 and SRC-07) is at most PROVISIONAL until the project owner or college accepts it.

## 3. Requirement class

| Class | Meaning |
|---|---|
| REQUIRED | Essential for the applicable workflow. |
| OPTIONAL | Can be enabled or disabled depending on institutional needs. |
| CONDITIONAL | Applies only when stated conditions are met. |
| UNDECIDED | Awaiting confirmation. |

Do not confuse this documentation class with the *mandatory* flag a clearance requirement carries inside the finished application (CR-008). The class describes how sure we are that the **system** needs something. The flag describes whether a **student** must satisfy a requirement to be cleared.

## 4. Decision basis (used only in decisions.md)

| Basis | Meaning |
|---|---|
| ESTABLISHED | Explicitly specified by the project owner. |
| SUGGESTED | Proposed in the project brief as a starting point, to be adapted. |
| RECOMMENDED | Proposed by an AI assistant as advice. Not a decision. The specific assistant and supporting source are recorded in the Source field and source register. |
| OPEN | Not decided. No recommendation yet. |

## 5. Entry format and IDs

Every requirement row has: **ID, description, information status, class, source, last-updated date, notes**.

- `PREFIX-NNN` is a system requirement (section A). `PREFIX-INNN` is an item in the institutional information register (section B).
- IDs are **never reused or renumbered**. To remove an entry, delete its row and record the removal in [../change-log.md](../change-log.md), including the previous text.
- Examples quoted from the source documents (for instance "Library" or "BSIT") appear only in the Notes column, labelled as examples and not confirmed.
- Placeholders use the form `[UPPER_SNAKE_CASE]`. To list every unresolved placeholder:
  - Ubuntu: `grep -rnoE "\[[A-Z][A-Z0-9_]+\]" docs/requirements`
  - Windows PowerShell: `Get-ChildItem docs\requirements -Recurse -Filter *.md | Select-String -Pattern "\[[A-Z][A-Z0-9_]+\]"`

## 6. How to update when real information arrives

1. Find the item (by ID or placeholder) in its module.
2. Replace the placeholder, change the status (for section B only with a cited institutional source), and update the **Updated** date.
3. Add an entry to [../change-log.md](../change-log.md): previous value, new value, reason, source, affected components, documents updated.
4. Check the "Related" links at the top of the module for other modules that cite the item.
5. Update [open-questions.md](open-questions.md) and [form-dependent-decisions.md](form-dependent-decisions.md) if a question is now answered.

Do not edit unrelated modules, and do not change a status silently.
