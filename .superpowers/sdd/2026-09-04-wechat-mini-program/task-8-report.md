# Task 8 Report: Documentation, CI Coverage, and Manual Acceptance

## Status

Implementation and every acceptance path available in this environment are complete. WeChat Developer Tools and a controllable GUI browser were unavailable, so no tool/device-only result is claimed.

## Changes

- Expanded `scripts/check.sh` with explicit syntax checks for every JavaScript file under `wechat/miniprogram/`.
- Preserved the single `node --test tests/*.test.js` invocation used by CI.
- Added an actionable missing-generated-file failure that instructs developers to run `bash scripts/build.sh`, resolving the Task 2 deferred minor.
- Documented root build/check, import, AppID, canonical-data, and generated-file workflows in `README.md`.
- Added `wechat/README.md` with prerequisites, page map, MVP scope, non-features, and the exact ten-item manual checklist.
- Added Web VM coverage for all four golden profiles, six-slider rendering/update, shared result URL copying, purchase links, and PNG poster download.
- Left `.github/workflows/ci.yml` unchanged because it already installs Node.js 22 and Python 3, then runs `bash scripts/build.sh` and `bash scripts/check.sh`.
- Left the root Mini Program todo unchecked because Developer Tools/device acceptance did not run.

## Commits

- `4ca811b` — `docs: document Wineer Mini Program workflow`
- `6fb961f` — `test: cover Web manual acceptance paths`

## Deterministic Build and Checks

```text
bash scripts/build.sh
✅ generated Web and WeChat runtime assets

bash scripts/check.sh
ℹ tests 57
ℹ pass 57
ℹ fail 0
✅ check passed

git diff --exit-code -- web/data/baijiu.json web/shared/recommender.js \
  wechat/miniprogram/data/baijiu.js wechat/miniprogram/shared/recommender.js
PASS
```

The missing-asset acceptance probe temporarily removed `web/shared/recommender.js`, verified the exact message below, and restored the file:

```text
❌ missing generated file: web/shared/recommender.js; run bash scripts/build.sh
```

## WeChat Mini Program Acceptance

### Tool availability

No WeChat Developer Tools application was found at the standard system/user application paths, and no Developer Tools `cli` executable was available. Automated tests therefore exercised page definitions and mocked WeChat API callbacks, but cannot establish rendering, platform clipboard, Canvas/font output, share reopening, or permission behavior in the actual tool/device runtime.

### Automated equivalents completed

1. Home-to-quiz navigation and the expected start copy are covered.
2. Six dimensions, default values, numeric updates, normalization, and refreshed hints are covered.
3. Default Top 3 order and uniqueness are covered.
4. Low-budget Top 3 order is covered.
5. Six-answer encode/decode and shared result path/ranking are covered.
6. Ranked card data and all required WXML fields are covered by result utilities plus markup review.
7. Exact purchase keyword and clipboard success/failure paths are covered.
8. Poster model/drawing, preview, save success, denied permission, settings, and failure paths are covered.
9. Restart redirect and fresh default quiz initialization are covered.
10. Invalid parameter normalization, malformed/invalid data error states, and non-recursive Web data fallback are covered.

### Exact remaining Developer Tools/device checks

- [ ] 1. Home renders and `我已满 18 岁，开始` opens the quiz.
- [ ] 2. All six sliders update their numeric value and explanatory text.
- [ ] 3. Default answers render exactly three different wines in this order: `kouzijiao`, `qinghua20`, `shuanggou-shengfang`.
- [ ] 4. The low-budget profile renders `jiujiang-shuangzheng`, `yubingshao`, `fenjiu-bofen`.
- [ ] 5. A shared result path reopens with the same six answers and ranking.
- [ ] 6. Every result card shows rank, recommendation percentage, tags, reason, taste, caution, and reference-price wording.
- [ ] 7. Copy purchase keyword places `<酒名> 京东搜索` on the clipboard and reports failure if clipboard access fails.
- [ ] 8. Poster generation displays a preview; saving handles success and denied album permission distinctly.
- [ ] 9. Restart returns to a fresh quiz.
- [ ] 10. Invalid result parameters normalize safely, and invalid wine data shows an error state without retry loops.

## Web Acceptance

Served `web/` at `http://127.0.0.1:8000/` with Python's existing HTTP server, verified the age-gate HTML, app bundle, shared recommender, and generated JSON over HTTP, then stopped exact PID `89590`.

The Node VM tests passed for the age-gate transition, six sliders, all four golden profiles, shared result URL, PNG poster download trigger, purchase URL, generated-data fallback, and retry termination. A real browser visual/click pass remains for layout, physical slider interaction, downloaded-file inspection, clipboard UX, and opening the JD target because no controllable GUI browser was available.

## Self-Review and Concerns

- Every current Mini Program `.js` file has an explicit `node --check` line.
- Documentation requirements and all ten checklist entries were mechanically verified.
- Generated files are reproducible and unchanged after the build.
- The Task 4 deferred exact-copy/class-name assertions were not added: copy and CSS class names are not stable interfaces, while route behavior, page registration, syntax, and the pending visual acceptance are covered.
- Local verification used Node.js `v26.7.0`; Node.js 22 was not installed locally. CI remains pinned to Node.js 22 and will execute the same build/check commands.
- Actual WeChat Developer Tools/device and GUI browser acceptance remain the only open checks.

## Round 1 Fix Evidence — CI generated-asset drift gate

### Finding addressed

CI built generated assets and then ran checks, but it never failed on committed drift for the four generated files. This round adds an explicit post-build drift gate before the main checks.

### Changes

- Added `.github/workflows/ci.yml` step: `bash scripts/check-generated-drift.sh` immediately after `bash scripts/build.sh`.
- Added `scripts/check-generated-drift.sh` to fail on drift in:
  - `web/data/baijiu.json`
  - `web/shared/recommender.js`
  - `wechat/miniprogram/data/baijiu.js`
  - `wechat/miniprogram/shared/recommender.js`
- Added `tests/ci-workflow.test.js` using only Node built-ins:
  - verifies workflow run-step order is build → drift gate → checks
  - verifies the drift gate fails when a committed generated asset is modified in an isolated scratch Git repo

### Root cause note

The first version of the new test mutated `web/shared/recommender.js` in-place and raced with the parallel Node test runner. The fix moved drift-gate mutation coverage into an isolated scratch Git repo under the worktree so the test no longer pollutes concurrent test files.

### Command evidence

```text
$ node --test tests/ci-workflow.test.js
✔ CI runs the generated-asset drift gate after build and before checks
✔ generated-asset drift gate fails when a committed build output changes
ℹ tests 2
ℹ pass 2
ℹ fail 0
```

```text
$ bash scripts/build.sh
generated wechat/miniprogram/data/baijiu.js
✅ generated Web and WeChat runtime assets
```

```text
$ bash scripts/check-generated-drift.sh
✅ generated assets are in sync
```

```text
$ bash scripts/check.sh
✅ 校验通过：100 款，全部字段合法，无重复 id
ℹ tests 59
ℹ pass 59
ℹ fail 0
✅ check passed
```
