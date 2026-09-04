# Wineer WeChat Mini Program Final Fix Report

Date: 2026-09-04
Branch: `feature/wechat-mini-program`
Worktree: `/Users/yhe/Work/wineer/.worktrees/wechat-mini-program`

## Status

The complete final-review finding list was addressed in one fix wave. The automated baseline started at 59 passing tests and now has 69 passing tests. The four approved recommendation golden vectors are unchanged.

No WeChat Developer Tools, device, or GUI-browser acceptance was attempted or claimed.

## Method

Each important finding followed the requested systematic-debugging and test-first sequence:

1. Read the current implementation and traced the relevant data or navigation flow.
2. Confirmed the root cause in the production code.
3. Added the smallest automated reproduction before changing production code.
4. Ran the focused test and confirmed that it failed for the expected missing behavior.
5. Applied the minimum production change.
6. Re-ran the focused test to GREEN.
7. Ran the complete build, generated-asset drift gate, semantic checks, JavaScript syntax checks, and full Node test suite.

## Baseline

Command:

```bash
bash scripts/check.sh
```

Baseline output summary:

```text
✅ 校验通过：100 款，全部字段合法，无重复 id
ℹ tests 59
ℹ pass 59
ℹ fail 0
✅ check passed
```

The worktree was clean before the fix wave.

## Important 1 — Generated Asset Integrity

### Root-cause confirmation

Three independent defects existed:

1. `scripts/check-generated-drift.sh` used `git diff`. That reports tracked working-tree differences, but it does not report an output that has been removed from `HEAD` and then recreated as an untracked file by the build.
2. `scripts/build.sh` copied the canonical JSON and both shared recommender copies directly over runtime outputs before `generate-wechat-data.js` parsed the canonical JSON. A parse failure or later generation failure therefore left a mixed partial runtime state.
3. `generate-wechat-data.js` parsed JSON but did not validate the dataset semantics. Parseable data with invalid required display fields, ranges, arrays, enum values, or duplicate IDs could be emitted successfully.

### RED evidence

Command:

```bash
node --test --test-reporter=spec \
  tests/ci-workflow.test.js \
  tests/build-integrity.test.js
```

Pre-fix result:

```text
ℹ tests 7
ℹ pass 3
ℹ fail 4
```

Expected failures confirmed the separate causes:

- Invalid JSON changed `web/data/baijiu.json` before the generator failed.
- A parseable dataset with `items[0].taste = []` returned status `0` instead of being rejected.
- A forced late generator failure found that `web/data/baijiu.json` had already changed.
- A generated output omitted from `HEAD` and recreated untracked returned drift-gate status `0`.

The tracked-deletion case already failed correctly under the old gate and was retained as explicit regression coverage alongside modified and untracked cases.

### Fix

- `scripts/generate-wechat-data.js`
  - Accepts explicit source and output paths so the build can target a staged file.
  - Validates the top-level shape and non-empty dataset.
  - Validates required non-empty string fields.
  - Validates non-empty string arrays for `taste` and `scene`.
  - Validates aroma and price-tier enums.
  - Validates finite positive ABV, finite non-negative price, and `beginner` range `1..5`.
  - Rejects duplicate IDs.
  - Writes through a sibling temporary file and atomically renames it to the requested output.
- `scripts/build.sh`
  - Creates four PID-scoped staged outputs in the destination filesystems.
  - Completes semantic validation and all generation/copies before replacing any runtime output.
  - Replaces each runtime target with a same-filesystem atomic rename only after every staged operation succeeds.
  - Removes staged files through an `EXIT` trap.
- `scripts/check-generated-drift.sh`
  - Uses `git status --porcelain=v1 --untracked-files=all` for the four generated paths.
  - Reports modified, deleted, staged, and untracked generated outputs, including the offending path.
- Tests
  - Added invalid-JSON, semantic-invalidity, and later-staged-copy failure probes.
  - Added tracked-deletion and omitted-from-`HEAD`/untracked drift probes.

### GREEN evidence

```text
✔ build rejects invalid JSON without replacing any runtime output
✔ build rejects semantically invalid data without replacing any runtime output
✔ build leaves runtime outputs untouched when a later staged copy fails
✔ generated-asset drift gate fails when a committed build output changes
✔ generated-asset drift gate fails when a committed build output is deleted
✔ generated-asset drift gate fails when build recreates an output omitted from HEAD
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

The normal build then completed with no staged or temporary files left behind, and the drift gate reported:

```text
✅ generated assets are in sync
```

## Important 2 — Restart Page Stack

### Root-cause confirmation

The original native navigation sequence was:

```text
home --navigateTo--> quiz
quiz --navigateTo--> result
result --redirectTo--> new quiz
```

The first restart replaced only the result layer, leaving the old quiz underneath. Every later quiz-to-result `navigateTo` added another layer, and every result-to-quiz redirect replaced only the top layer. Repeating restart therefore retained stale quiz pages and grew the stack.

### RED evidence

Command:

```bash
node --test --test-reporter=spec \
  tests/navigation.test.js \
  tests/result-page.test.js
```

Pre-fix result:

```text
ℹ tests 26
ℹ pass 22
ℹ fail 4
```

The stack-specific failure showed the exact wrong API:

```text
actual:   ["navigateTo", "/pages/result/result?..."]
expected: ["redirectTo", "/pages/result/result?..."]
```

The same run also reproduced the missing duplicate-tap guard and failure reset:

```text
navigation calls: actual 2, expected 1
failure toast: actual [], expected [{ title: "跳转失败，请重试", icon: "none" }]
```

### Fix

- Quiz-to-result now uses `wx.redirectTo`.
- Result-to-quiz continues to use `wx.redirectTo`.
- Home-to-quiz continues to use `wx.navigateTo`, preserving native Back behavior to the home page.
- The stable stack is therefore:

```text
[home, quiz] -> [home, result] -> [home, fresh quiz]
```

- The focused page tests assert both the API and exact target. Their comments document that the paired redirects replace the current non-home layer, keep the stack bounded at two layers, and preserve Back-to-home behavior.

### GREEN evidence

```text
✔ quiz redirects to the encoded result route so restart keeps the page stack bounded
✔ result page redirects to a fresh quiz, completing the bounded restart pair
ℹ tests 26
ℹ pass 26
ℹ fail 0
```

## Important 3 — Real-Time Native Sliders

### Root-cause confirmation

`quiz.wxml` bound only `bindchange="onSliderChange"`. The native `change` event fires after the drag completes, so the displayed value and hint could not update continuously while the slider was moving.

### RED evidence

The navigation/WXML focused run failed with:

```text
The input did not match /\bbindchanging="onSliderChange"/
```

The captured slider markup contained only:

```text
bindchange="onSliderChange"
```

### Fix

The slider now binds both:

```xml
bindchanging="onSliderChange"
bindchange="onSliderChange"
```

`bindchanging` drives continuous value and hint refreshes during dragging. Retaining `bindchange` also applies the final native value at drag completion through the same existing normalized handler.

### GREEN evidence

```text
✔ quiz WXML wires continuous slider updates and disables a busy submit
```

## Minor Findings

### Analytics page path

Root cause: stored Mini Program analytics records contained only `event`, `payload`, and `ts`.

RED:

```text
expected "/pages/quiz/quiz"
actual undefined
```

Fix:

- `track` resolves the active page through an optional `getCurrentPages` provider.
- The record now has a top-level `path`.
- Routes are normalized to `/pages/...`.
- Existing injected `wx` mocks remain valid because page resolution is a separate optional fifth argument and never requires a new method on the injected `wxApi`.
- A page-path resolution failure is diagnosed and falls back to an empty path without blocking Storage.

GREEN:

```text
✔ records the active page path without requiring it on the injected wx API
```

### Poster Mini Program sharing prompt

Root cause: the poster model and Canvas drawing contained title, subtitle, wines, and disclaimer, but no Mini Program sharing instruction.

RED:

```text
model.sharePrompt was undefined
no fillText call drew model.sharePrompt
```

Fix:

- Added `sharePrompt: "打开 Wineer 小程序，分享给朋友一起选酒"` to the model.
- Drew the prompt above the disclaimer.
- Added model and Canvas-call assertions.

GREEN:

```text
✔ poster model contains Top 3, a Mini Program sharing prompt, and disclaimer
✔ drawPoster uses the supplied canvas context
```

### Quiz result-navigation busy/disabled guard

Root cause: every submit tap emitted analytics and initiated a navigation, with no in-flight state or failure recovery.

Fix:

- Added `resultBusy`.
- Duplicate taps return before tracking or navigation.
- The submit button uses `loading` and `disabled` bindings.
- Redirect failure logs the underlying error, resets `resultBusy`, and shows `跳转失败，请重试`.

GREEN:

```text
✔ quiz ignores duplicate result taps while redirect navigation is in flight
✔ quiz resets the result busy state and reports redirect failures
✔ quiz WXML wires continuous slider updates and disables a busy submit
```

### Private WeChat Developer Tools config

RED:

```text
git check-ignore --quiet wechat/project.private.config.json
exit status: 1
```

Fix:

```text
wechat/project.private.config.json
```

was added to `.gitignore`.

GREEN:

```text
✔ private WeChat Developer Tools config is ignored
```

### Root README

Corrected statements that still described:

- scoring as living in `web/app.js#scoreItem`; and
- `build.sh` as copying only Web data.

The README now identifies `shared/recommender.js` as the single recommendation implementation and describes the build as validating and generating all Web and Mini Program runtime data/shared-core copies.

### Web six-slider smoke coverage

The Web smoke test now verifies the common `oninput` handler wiring and value/hint refresh for all six dimensions:

```text
budget=0
occasion=2
softness=4
flavorWeight=6
brandFace=8
adventure=10
```

The existing implementation already handled all six correctly; the strengthened test passed when added.

## Final Verification

Focused RED/GREEN commands were run before the complete verification. The final pre-commit command was:

```bash
bash scripts/build.sh &&
bash scripts/check-generated-drift.sh &&
bash scripts/check.sh &&
git diff --check
```

Output summary:

```text
generated wechat/miniprogram/data/baijiu.js.stage-95601
✅ generated Web and WeChat runtime assets
✅ generated assets are in sync
✅ 校验通过：100 款，全部字段合法，无重复 id
ℹ tests 69
ℹ pass 69
ℹ fail 0
✅ check passed
```

The full suite includes:

- generated-output failure atomicity;
- modified, deleted, and untracked drift detection;
- all four recommendation golden vectors;
- bounded Mini Program navigation;
- continuous slider wiring;
- result navigation busy/failure handling;
- analytics path storage;
- poster model/drawing;
- runtime asset deep equality;
- all six Web sliders;
- Mini Program config and JavaScript syntax checks.

Tool versions used locally:

```text
Node.js v26.7.0
Python 3.14.7
GNU bash 3.2.57
```

CI remains configured for Node.js 22 and Python 3 and runs the same build, drift, and check scripts.

## Files Changed

### Build and drift integrity

- `scripts/build.sh`
- `scripts/check-generated-drift.sh`
- `scripts/generate-wechat-data.js`
- `tests/build-integrity.test.js`
- `tests/ci-workflow.test.js`

### Mini Program navigation, sliders, analytics, and poster

- `wechat/miniprogram/pages/quiz/quiz.js`
- `wechat/miniprogram/pages/quiz/quiz.wxml`
- `wechat/miniprogram/utils/analytics.js`
- `wechat/miniprogram/utils/poster.js`
- `tests/navigation.test.js`
- `tests/result-page.test.js`
- `tests/analytics.test.js`
- `tests/poster.test.js`

### Configuration, documentation, and Web coverage

- `.gitignore`
- `README.md`
- `tests/wechat-config.test.js`
- `tests/web-smoke.test.js`

### Report

- `.superpowers/sdd/2026-09-04-wechat-mini-program/final-fix-report.md`

## Commits

- `68bc2a5be6c8c3e18025e218ee38d4248a6777cf` — `fix: address Mini Program final review`
- `docs: add Mini Program final fix report` — follow-up commit containing this report; its hash is listed in the final status response.

## Self-Review

- Every final-review finding maps to a production change or explicit coverage change above.
- Generated runtime files remained byte/deep-equal to canonical sources after the staged build.
- No generated runtime file changed in the fix commit.
- The default, low-budget, business-gift, and adventurous rankings remain unchanged.
- Navigation keeps one home layer and one current flow layer; no stale result/quiz layer is retained by restart.
- Busy state is set before analytics/navigation and reset only on navigation failure.
- Analytics path resolution does not add requirements to the existing injected `wxApi` mocks.
- Poster text fits in the existing gap below the third card and above the disclaimer at the current fixed Canvas aspect ratio.
- `git diff --check` reported no whitespace errors.
- The worktree was clean immediately after the code commit.

## Residual Concerns

- WeChat Developer Tools/device rendering, physical drag behavior, native share reopening, Canvas font/layout fidelity, clipboard behavior, and album permission UX still require the already-documented manual acceptance. They were not available in this environment and are not claimed.
- The build prepares every output before replacement and uses an atomic rename for each target. As with any multi-file build spanning multiple directories, the four replacements are not one global filesystem transaction; however, validation or generation failure cannot start replacement, which addresses the reviewed partial-write failure modes.
- Local verification used Node.js 26 rather than the CI-pinned Node.js 22. The implementation and tests use only stable Node built-ins, but the CI job remains the authoritative Node.js 22 execution.
