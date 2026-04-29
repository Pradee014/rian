---
name: dev
description: Use when the user wants Codex to implement exactly one highest-priority Rian sprint task from sprints/vN/TASKS.md. Follow test-first development where practical, keep changes phase-appropriate, preserve one-speaker routing and provider boundaries, and verify the specific behavior that the sprint introduces.
---

# DEV

Use this skill to execute one Rian sprint task at a time.

This skill is intentionally stricter about project fit than about ceremony. The goal is
not to perform a generic enterprise checklist. The goal is to move Rian forward in a
clean, inspectable way.

## Core Rules

- do exactly one sprint task per invocation
- prefer the latest sprint's highest-priority unchecked task
- read the sprint plan before changing code
- write a test first when the task can support one
- preserve provider-swappable boundaries for STT, LLM, and TTS
- enforce one active AI speaker at a time where routing behavior is involved
- log routing and trace information when the feature touches orchestration or latency
- do not widen scope to unrelated cleanup

## Step 1: Find the Current Task

Read the latest `sprints/vN/TASKS.md` and select the highest-priority open task.

Prefer:

1. latest sprint number
2. first unchecked task
3. `P0` before `P1` before `P2`

Announce the selected task in this form:

```text
Working on Task N: [description]
```

## Step 2: Gather Rian Context

Before editing:

1. read the sprint's `PRD.md`
2. read `AGENTS.md` if the task touches product behavior, routing, privacy, or
   architecture
3. read the prior sprint's `WALKTHROUGH.md` if it exists
4. read the files that will likely change
5. read nearby tests

If the task conflicts with Rian's project rules, follow the project rules and note the
conflict rather than blindly implementing the task.

## Step 3: Test First When Practical

Write tests before implementation whenever the task supports it.

Choose the smallest useful verification:

- pure logic: unit tests
- APIs and server actions: integration-style tests
- UI behavior: component tests or browser tests
- routing invariants: deterministic tests that prove only one persona speaks unless both
  are explicitly allowed

For Rian, especially prioritize tests for:

- session start and stop behavior
- transcript and audio attachment
- persona routing rules
- post-call critique generation
- deletion behavior
- trace and dashboard event emission

When the repo is too early-stage for full TDD, add the smallest reasonable test harness
first instead of pretending the full workflow already exists.

## Step 4: Browser and UI Verification

For UI tasks, use browser-based verification when it materially helps.

Rules:

- prefer Playwright if the repo already uses it or if the sprint explicitly calls for
  E2E coverage
- use the in-app browser plugin for localhost checks when interactive inspection helps
- add `data-testid` only where stable selectors are genuinely useful
- capture screenshots for key UI states when running Playwright

Do not force Playwright setup for tiny non-UI tasks.

## Step 5: Implement the Smallest Viable Change

After the initial failing test or planned verification is in place:

1. implement the minimum code needed
2. follow existing repo patterns
3. keep logic inspectable
4. add error handling for user-facing flows
5. avoid speculative abstractions

For Rian-specific implementation:

- keep live conversation responses concise if working near runtime prompts
- preserve the hidden orchestrator model instead of exposing it as a third persona
- avoid hidden memory or creepy persistence
- keep deletion possible
- favor low-latency flow over heavy architecture

## Step 6: Verify

Run the most specific relevant verification first, then broaden only if needed.

Examples:

```bash
npx vitest run [test-file]
python -m pytest tests/[file].py
npx playwright test [test-file]
```

If the repo does not yet have those tools, use the project's actual runner or create the
smallest testable path for the task.

## Step 7: Security and Safety Checks

Use security checks when they fit the stack and the task.

Examples:

```bash
npx semgrep --config auto src/ --quiet
npm audit
```

For this repo, also treat these as security and safety requirements:

- no hidden memory writes
- no bypass of deletion flows
- no accidental multi-speaker behavior where one-speaker routing is required
- no logging that drops the traceability needed for the developer dashboard

If a tool-based scan is not set up yet, say so plainly and still review the change for
obvious security and privacy issues.

## Step 8: Update the Task

When the task is truly done, update `TASKS.md`:

```text
- [x] Task N: [description] (P0)
  - Acceptance: [criteria]
  - Files: [files]
  - Completed: [date] - [brief note]
```

Do not mark it done if verification is still failing.

## Step 9: Commit Carefully

Create a commit only when the user wants commits or when the repo workflow clearly
expects it.

Use a focused message such as:

```text
feat(vN): Task N - [description]
```

If you do not commit, say so in the final summary.

## Example Prompt

- `Use $dev to implement the next Rian sprint task.`
