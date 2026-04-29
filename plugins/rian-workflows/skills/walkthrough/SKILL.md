---
name: walkthrough
description: Use when the user wants a self-contained sprint review for Rian, especially to generate sprints/vN/WALKTHROUGH.md that explains the latest sprint's files, architecture, routing behavior, traceability, tests, limitations, and what phase should come next.
---

# WALKTHROUGH

Use this skill to generate a technical walkthrough for the latest Rian sprint.

The reader should be able to understand the sprint without opening the source files.

## Step 1: Identify the Sprint

Find the latest `sprints/vN/` directory and read:

- `PRD.md`
- `TASKS.md`

Also read the previous sprint's `WALKTHROUGH.md` if it helps explain continuity.

If no sprint directory exists, stop and tell the user the walkthrough cannot be
generated yet.

## Step 2: Inventory the Sprint Changes

Build the file list from the most trustworthy sources available:

1. completed task entries in `TASKS.md`
2. relevant git history
3. the source tree for files clearly tied to the sprint

Useful commands may include:

```bash
git log --oneline --name-only
git status --short
```

Be conservative. Do not imply that unrelated files were part of the sprint.

## Step 3: Read the Code and Tests

For every included file:

1. read the file
2. identify what it contributes to the Rian phase
3. identify the key functions, components, routes, prompts, or schemas
4. identify how it affects the core loop:
   `Speak -> live conversation -> critique -> practice challenge -> repeat`

When tests exist, explain what they prove about the behavior.

## Step 4: Write `WALKTHROUGH.md`

Write `sprints/vN/WALKTHROUGH.md` with this structure:

```markdown
# Sprint vN - Walkthrough

## Summary

## Architecture Overview

## Files Created/Modified

### path/to/file
**Purpose**: ...
**Key Functions/Components**:
- `name` - ...

**How it works**:
...

## Data Flow

## Test Coverage

## Security Measures

## Known Limitations

## What's Next
```

## Rian-Specific Content Expectations

### Summary

Explain what phase of the Rian POC moved forward and what user-visible capability now
exists.

### Architecture Overview

Use ASCII art.

When relevant, reflect components such as:

- web voice room
- orchestrator
- persona selection
- STT, LLM, and TTS boundaries
- Supabase or storage
- developer dashboard and traces

### File Sections

Every file gets its own section.

For each file include:

- one-sentence purpose
- key functions or components
- 2 to 3 paragraphs explaining how the file works and why it exists

Include small code snippets only for the most important or subtle logic.

### Data Flow

Describe how voice, transcript, persona routing, critique generation, and trace data
move through the system when relevant to the sprint.

### Test Coverage

Call out whether the sprint verifies:

- one-speaker routing
- session lifecycle
- transcript or audio persistence
- critique generation
- dashboard traces

If those are absent, say so plainly.

### Security Measures

Include both technical security and Rian-specific privacy safeguards, such as:

- deletion support
- explicit memory approval
- no hidden memory
- access controls if any
- validation and error handling

### Known Limitations

Be candid about missing voice realism, incomplete routing, missing evals, placeholder
providers, weak observability, or anything else still rough.

### What's Next

Recommend the next sprint based on the repo's implementation phases, not on a generic
wishlist.

## Example Prompt

- `Use $walkthrough to generate the latest Rian sprint walkthrough.`
