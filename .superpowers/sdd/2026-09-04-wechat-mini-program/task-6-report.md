# Task 6 Report: Render Results, Share Answers, and Copy Purchase Keywords

## Requirement Clarity
The brief was specific enough to implement directly as a bounded change. I kept scope limited to the native result route, a presentation-only wine card component, explicit result error states, WeChat share metadata, restart behavior, and clipboard-based purchase keywords without adding analytics, poster generation, or remote services.

## Implementation Details
- Added `wechat/miniprogram/utils/result.js` to convert ranked recommender output into page-friendly cards, produce the exact `"<wine name> 京东搜索"` purchase keyword, and build the share title from the top-ranked wine.
- Added `tests/result-utils.test.js` first to lock the ranking-preserving card model, purchase keyword format, and share-title behavior.
- Added `tests/result-page.test.js` first to cover result-page loading, explicit data/generic error messages, restart routing, share metadata, clipboard success/failure handling, missing-item handling, and `wine-card` event emission.
- Added `wechat/miniprogram/components/wine-card/*` as a presentation-only custom component that renders rank, recommendation score, reasons, tags, highlight, taste, caution, and emits `buy` with the wine identity.
- Added `wechat/miniprogram/pages/result/*` so the page decodes shared answers, recomputes Top 3 from local data exactly once on load, renders separate loading/content/error states, exposes native share metadata, and keeps the purchase action copy-only.
- Registered `pages/result/result` in `wechat/miniprogram/app.json` and updated `tests/wechat-config.test.js` to enforce the final page order.

## Files Changed
- `tests/result-page.test.js`
- `tests/result-utils.test.js`
- `tests/wechat-config.test.js`
- `wechat/miniprogram/app.json`
- `wechat/miniprogram/components/wine-card/wine-card.js`
- `wechat/miniprogram/components/wine-card/wine-card.json`
- `wechat/miniprogram/components/wine-card/wine-card.wxml`
- `wechat/miniprogram/components/wine-card/wine-card.wxss`
- `wechat/miniprogram/pages/result/result.js`
- `wechat/miniprogram/pages/result/result.json`
- `wechat/miniprogram/pages/result/result.wxml`
- `wechat/miniprogram/pages/result/result.wxss`
- `wechat/miniprogram/utils/result.js`

## RED TDD Evidence
### Command
```bash
cd /Users/yhe/Work/wineer/.worktrees/wechat-mini-program && node --test tests/result-utils.test.js tests/result-page.test.js tests/wechat-config.test.js
```

### Relevant Output
```text
Error: Cannot find module '../wechat/miniprogram/utils/result'
Error: Cannot find module '../wechat/miniprogram/pages/result/result'
Error: Cannot find module '../wechat/miniprogram/components/wine-card/wine-card'
✖ app config starts with the home page and shell styling
```

This failed for the expected reasons: the result utility, result page, wine-card component, and final route registration did not exist yet.

## GREEN TDD Evidence
### Command
```bash
cd /Users/yhe/Work/wineer/.worktrees/wechat-mini-program && node --test tests/result-utils.test.js tests/result-page.test.js tests/wechat-config.test.js
```

### Relevant Output
```text
✔ result page restores answers and builds ranked result cards
✔ result page shows an explicit message when recommendation data is invalid
✔ result page shares the top wine and the normalized answer query
✔ result page copies the exact purchase keyword and explains the next step
✔ wine card emits a buy event with the wine identity
✔ builds cards without changing ranking
✔ app config starts with the home page and shell styling
ℹ fail 0
```

## Focused + Full Check Evidence
### Command
```bash
cd /Users/yhe/Work/wineer/.worktrees/wechat-mini-program && node --test tests/result-utils.test.js tests/result-page.test.js tests/navigation.test.js tests/recommender.test.js tests/wechat-config.test.js && node --check wechat/miniprogram/utils/result.js && node --check wechat/miniprogram/components/wine-card/wine-card.js && node --check wechat/miniprogram/pages/result/result.js && git diff --check HEAD~1 HEAD && bash scripts/check.sh
```

### Relevant Output
```text
ℹ tests 30
ℹ pass 30
ℹ fail 0
ℹ tests 39
ℹ pass 39
ℹ fail 0
✅ check passed
```

## Commit
- `e799e71` — `feat: add Mini Program result flow`

## Self-Review
- Reviewed the result-page orchestration to keep answer decoding, recommendation recomputation, clipboard behavior, restart routing, and share metadata in the page instead of the card component.
- Reviewed the wine-card component to keep it presentation-only: it renders supplied data and emits `buy`, but does not load data, navigate, or score anything.
- Reviewed the share path and copy flow against the brief/spec so only the six answers are shared, the purchase action stays copy-only, and data failures surface as explicit on-page errors rather than silent fallbacks.

## Concerns
- None.

---

## Round 1 Fix: Explicit result-view data validation

## Requirement
Address the review finding where malformed local data could bypass recommender validation, crash inside `buildResultView()`, and surface the generic `生成推荐失败` path instead of the explicit recommendation data error.

## Root Cause
- `shared/recommender.js` validates only fields needed for scoring.
- `wechat/miniprogram/utils/result.js` assumed presentation fields were always valid and called `item.taste.join("、")` directly while also passing through `region`, `highlight`, and `caution` without validation.
- If local data omitted `taste`, `recommend()` still succeeded, `buildResultView()` threw a plain `TypeError`, and `pages/result/result.js` classified it as a generic failure.

## Minimal Fix
- Added explicit result-view validation in `wechat/miniprogram/utils/result.js`.
- `buildResultView()` now throws `RecommendationDataError` when `taste`, `region`, `highlight`, or `caution` is malformed or missing, so the page keeps using the existing data-error path.

## Tests Added First
- `tests/result-utils.test.js`
  - Added coverage that a missing required display field throws `RecommendationDataError`.
- `tests/result-page.test.js`
  - Added coverage that malformed local result-view data is shown as `推荐数据异常，请稍后重试`.

## RED TDD Evidence
### Command
```bash
cd /Users/yhe/Work/wineer/.worktrees/wechat-mini-program && node --test tests/result-utils.test.js tests/result-page.test.js
```

### Relevant Output
```text
✖ result page classifies malformed result view data as a recommendation data error
+ actual - expected
+ '生成推荐失败，请稍后重试'
- '推荐数据异常，请稍后重试'

✖ throws a data error when a required display field is missing
Caught error:
TypeError: Cannot read properties of undefined (reading 'join')
ℹ pass 12
ℹ fail 2
```

This failed for the expected reason: missing `taste` still reached `buildResultView()`, which threw `TypeError` instead of a classified recommendation-data error.

## Focused Verification
### Command
```bash
cd /Users/yhe/Work/wineer/.worktrees/wechat-mini-program && node --test tests/result-utils.test.js tests/result-page.test.js && node --check wechat/miniprogram/utils/result.js
```

### Relevant Output
```text
✔ result page classifies malformed result view data as a recommendation data error
✔ throws a data error when a required display field is missing
ℹ tests 14
ℹ pass 14
ℹ fail 0
```

`node --check wechat/miniprogram/utils/result.js` completed successfully with no output.

## Files Changed
- `tests/result-page.test.js`
- `tests/result-utils.test.js`
- `wechat/miniprogram/utils/result.js`

## Self-Review
- Kept the fix scoped to result-view validation instead of broadening recommender scoring rules.
- Reused `RecommendationDataError` so the existing page classification logic stays unchanged.
- Validated only the presentation fields this renderer requires, avoiding silent fallbacks for required content.

## Concerns
- None.
