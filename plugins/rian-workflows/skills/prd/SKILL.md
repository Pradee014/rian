---
name: prd
description: Use when the user wants to plan the next Rian sprint and generate sprints/vN/PRD.md plus sprints/vN/TASKS.md. Tailor the sprint to Rian's voice-first POC, phased roadmap, one-active-speaker rule, provider boundaries, traceability, and privacy-first constraints.
---

# PRD

Use this skill to plan a sprint specifically for Rian, not a generic app.

Rian is a personal, voice-first communication training POC. Sprint planning should stay
aligned with these repository rules:

- keep the implementation phase-driven
- build the voice room before advanced memory
- preserve provider-swappable STT, LLM, and TTS boundaries
- enforce one active AI speaker at a time
- keep the developer dashboard and traceability in mind
- optimize for a private personal POC, not a public product

## Outputs

Create:

- `sprints/vN/PRD.md`
- `sprints/vN/TASKS.md`

If the user explicitly wants brainstorming only, discuss first and wait before writing
files.

## Context to Read First

Always read project context before planning:

1. `AGENTS.md`
2. `rian_voice_poc_pitch.md`
3. any existing `sprints/v*/PRD.md`
4. the latest `sprints/v*/WALKTHROUGH.md` if present

## Step 1: Understand the Project State

If there is no `sprints/` directory yet:

- ask 3 to 5 focused questions only where the repo docs still leave uncertainty
- bias toward the earliest realistic Rian phase, not an ambitious roadmap sprint

Important planning defaults for this repo:

- `v1` should usually focus on product behavior spec, a simple voice-room skeleton, or
  whichever smallest slice best proves the core loop
- do not jump to memory, advanced analytics, or broad multi-mode expansion too early
- do not plan both complex infrastructure and rich UX polish in the same first sprint

If sprints already exist:

1. identify the latest sprint version
2. read its `PRD.md`
3. read its `WALKTHROUGH.md` if present
4. ask what the user wants to add, change, validate, or fix next

## Step 2: Choose the Right Slice

For Rian, favor sprint slices that map cleanly onto the implementation phases in
`AGENTS.md`, such as:

1. product and behavior spec
2. single voice room
3. two voices with one speaker at a time
4. post-call critique report
5. interruption handling
6. voice analytics
7. memory and personal playbook
8. developer dashboard and evals

If the user asks for a sprint that spans multiple phases, compress it into one realistic
phase and push the rest into `Out of Scope`.

## Step 3: Write the PRD

The PRD must include:

1. `Sprint Overview`
2. `Goals`
3. `User Stories`
4. `Technical Architecture`
5. `Out of Scope`
6. `Dependencies`

Rian-specific expectations:

- `Sprint Overview`: describe which POC phase this sprint advances
- `Goals`: define user-visible proof points and engineering proof points
- `User Stories`: tie them to live practice, critique, routing, or observability
- `Technical Architecture`: reflect the recommended stack unless the user overrides it
- `Out of Scope`: explicitly reject tempting extras like memory, public product work,
  3D avatars, fine-tuning, or multi-agent debate when not in scope
- `Dependencies`: name provider credentials, LiveKit setup, Supabase, or prior sprint
  outputs when relevant

When architecture is included, prefer the repo's default path:

- frontend: Next.js
- voice runtime: LiveKit Agents
- storage and DB: Supabase
- STT, LLM, and TTS behind swappable boundaries

## Step 4: Write Atomic Tasks

Create `TASKS.md` with ordered, testable tasks:

```text
- [ ] Task N: [Clear description] (P0/P1/P2)
  - Acceptance: [What done looks like]
  - Files: [Expected files to create or modify]
```

Rules:

- `v1` should have at most 10 tasks
- each task should be small enough for one focused agent pass
- always include a project setup or project scaffolding task as `Task 1`
- put all `P0` tasks before `P1`, then `P2`
- include observability and trace logging early when relevant
- include deterministic tests for rules like one-speaker routing when the sprint reaches
  that area
- do not front-load broad security hardening or advanced eval work before the core loop
  exists

For this repo, tasks should usually mention real file targets and preserve inspectable
architecture rather than hiding logic behind oversized abstractions.

## Quality Bar

Before finishing:

1. check that the sprint moves Rian one phase forward
2. check that scope still feels personal-POC sized
3. check that tasks support the voice-first core loop
4. check that provider boundaries and traceability are preserved where relevant
5. check that `Out of Scope` clearly protects against over-building

## Example Prompt

- `Use $prd to plan the next Rian sprint and create the sprint files.`
