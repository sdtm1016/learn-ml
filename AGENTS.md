# CLAUDE.md

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes

Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets and context management
- **Target**: ~120k tokens/task, ~600k tokens/session.
- **Approaching Limit**: When hitting ~80% of the session budget, proactively generate a `## Session Checkpoint` containing: 1) Current progress, 2) Unfinished items, 3) Key variables/context needed for continuation.
- **Overflow Handling**: If a single task forces an overrun, finish the current logical block (e.g., close the code block), then stop. Provide a "To be continued" prompt with the exact prompt the user can use to resume.
- **No Silent Truncation**: Never drop earlier context silently to save tokens; instead, ask the user to summarize or start a fresh session.

## Rule 7 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 8 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 9 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 11 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Rule 13 — 添加注释

代码尽量要有中文注释，解释代码意图，java定义的表实体映射，方法要有注释

## Rule 14 — 复杂任务落盘分解

复杂任务（涉及3个以上步骤或跨模块改动）必须在 `docs/` 目录下落盘任务分解文档。
文档命名：`docs/task-<简短描述>-<日期>.md`，内容包含：目标、步骤列表、每步验收标准。
按文档步骤逐一执行，每完成一步更新文档状态。简单任务无需落盘。

## Shell (PowerShell on Windows)

- Use single quotes for arguments (no variable expansion)
- $ in strings → single-quote wrap
- JSON / {} / @ → single-quote wrap
- If string contains single quote → double-quote with escaped double-quotes inside
- cmd /c does NOT inherit PowerShell variables; expand before passing

### cmd.exe 安全规则（参考 CVE-2024-24576）

- **优先直接调用可执行文件**：调用 python/node/powershell 等直接用可执行文件路径，不必通过 cmd /c 中转；但 cmd /c 仍然可用，不是禁止
- **cmd /c 完整危险字符**：`& | < > ^` + `%`（变量展开）+ `!`（延迟展开），遇到时注意转义而非拒绝执行
- **cmd /c 转义规则**：`&` → `^&`、`|` → `^|`、`<` → `^<`、`>` → `^>`、`^` → `^^`
- **不要套用 Unix 转义习惯**：cmd.exe 不认 `\` 转义、不支持单引号原样包裹
- **用户输入拼接命令时保持警惕**：如果用户提供的文件名/路径包含 `& | < >` 等字符且要拼进 cmd /c，先转义再执行；实在转义不了再报错
- If escaping fails → cmd /c "command" as fallback

## File Editing (Windows CRLF)

- Always read_file first to get actual content (including line endings)
- old_str = direct copy from read_file output, never manually construct
- Do NOT assume line endings; trust read_file output only
- Never force-convert line endings (CRLF↔LF) unless explicitly asked
- Same file fails 3 times → re-read_file then retry, or fallback to write_to_file whole-file rewrite
- Failure = old_str not found OR multiple matches OR line-ending mismatch
- Whole-file rewrite must preserve original line-ending type (unless user requests change)