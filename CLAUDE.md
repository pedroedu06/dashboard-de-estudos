@AGENTS.md

# CLAUDE.md — Development Rules

> These rules apply to **every task** in this project, without exception.
> Read them before acting. Internalize them. Follow them strictly.

---

## Rule 1 — Think Before You Implement

Before writing a single line of code, declare your assumptions explicitly.

- State what you believe the task requires.
- If anything is ambiguous or unclear, **ask first** — do not assume and proceed.
- Unverified assumptions are bugs waiting to happen.

```
❌ Assume → Implement → Discover you were wrong
✅ Declare → Confirm → Implement
```

---

## Rule 2 — Simplicity First

Write the **minimum amount of code** that correctly solves the problem.

- Prefer the boring, obvious solution over the clever one.
- Do not abstract prematurely. Do not over-engineer.
- If a function, file, or abstraction isn't needed right now, don't create it.
- Complexity is a liability. Every line you don't write is a line you don't have to maintain.

> *"The best code is no code at all."*

---

## Rule 3 — Surgical Changes

Touch only what is necessary to accomplish the task.

- Do not refactor surrounding code unless explicitly asked.
- Do not rename, reorganize, or "clean up" files that are not part of the task scope.
- Isolate your diff. The smaller and more focused the change, the safer it is.
- If you identify something unrelated that could be improved, **flag it** — don't fix it silently.

---

## Rule 4 — Goal-Driven Execution

Every action must be traceable to the stated goal.

- Before implementing anything, ask: *"Does this directly serve the task objective?"*
- Avoid gold-plating, scope creep, or adding features "while you're at it."
- If a subtask feels unrelated to the goal, stop and verify before continuing.
- Deliver exactly what was asked — no more, no less.

---

## Rule 5 — Never Use `any` in TypeScript

The use of `any` is **forbidden** in this codebase.

- `any` disables the type system and defeats the purpose of TypeScript.
- If you're tempted to use `any`, it means the type needs to be properly modeled.
- Acceptable alternatives: `unknown` (with proper narrowing), explicit union types, generics.
- This rule has no exceptions — not for speed, not for "temporary" fixes.

```ts
// ❌ Forbidden
function process(data: any) { ... }

// ✅ Correct
function process(data: unknown) { ... }
function process<T extends SomeConstraint>(data: T) { ... }
```

---

## Rule 6 — Read Before You Write

Understand the existing code before modifying it.

- Read the relevant files, functions, and interfaces before making any change.
- Trace data flow. Understand the context of what you're editing.
- Never modify code you haven't fully read and understood.
- Duplicate logic or missed side-effects are symptoms of writing without reading first.

---

## Rule 7 — Token Budgets Are Not Advisory

Token budgets and constraints are **hard limits**, not suggestions.

- If a budget is defined, your output must stay within it — period.
- Do not rationalize overruns with "just a little more."
- Trim ruthlessly. Cut verbosity. Be precise.
- If the task genuinely cannot fit the budget, say so explicitly and propose a scoped alternative.

---

## Rule 8 — Tests Must Verify Intent, Not Just Behavior

Tests must validate **why** the code exists, not only **what** it does.

- A test that checks incidental implementation details is a brittle test.
- Ask: *"What is this code supposed to guarantee?"* — test that guarantee.
- Cover edge cases, failure modes, and invariants — not just the happy path.
- Prefer meaningful test names that describe intent:

```ts
// ❌ Tests behavior without communicating intent
it('returns false', () => { ... })

// ✅ Tests intent
it('rejects unauthenticated users from accessing protected routes', () => { ... })
```

---

## Rule 9 — Fail Loud

Errors must be **visible, explicit, and informative**.

- Never swallow exceptions silently.
- Never return `null`, `undefined`, or a default value to mask a real error.
- Log with context: what happened, where, and why it matters.
- Prefer crashing early and loudly over propagating silent corruption.
- An error that is hidden is ten times harder to debug than one that screams immediately.

```ts
// ❌ Silent failure
try {
  doSomething();
} catch (_) {}

// ✅ Loud failure
try {
  doSomething();
} catch (error) {
  logger.error('Failed to execute doSomething', { error, context });
  throw error;
}
```

---