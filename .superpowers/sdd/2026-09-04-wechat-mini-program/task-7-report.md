# Task 7 Report: Local Analytics and Share Poster Generation

## Scope
Implemented bounded, local-only analytics and Mini Program poster sharing. No remote service, network analytics, or purchase integration was added.

## Implementation
- Added `utils/analytics.js` with the `wineer_events` Storage key, ISO timestamps, failure isolation, and newest-200 retention.
- Wired existing event names: `start_quiz`, `recommend`, `share_click`, `share_poster`, `buy_click`, and `restart`.
- Added deterministic `buildPosterModel()` and Canvas 2D `drawPoster()` utilities, including Top 3 cards, two-line wine-name wrapping, scores, details, and disclaimer.
- Added the result-page Canvas lifecycle: duplicate-click guard, node/size query, DPR sizing, drawing, PNG export, preview, path retention, album save, permission guidance, and explicit failures.
- Added result actions for generating, previewing, and saving the poster.

## Canvas API Choice
Used the current Canvas 2D node flow: `<canvas type="2d">`, selector fields `{ node: true, size: true }`, `wx.getWindowInfo().pixelRatio` with `getSystemInfoSync()` fallback, and `wx.canvasToTempFilePath({ canvas, fileType: "png" })`.

The official Canvas component documentation limits explicit Canvas 2D dimensions to `1365 × 1365`. The page therefore clamps the effective DPR so the hidden `300 × 480` logical canvas never exceeds either physical dimension, rather than blindly multiplying by the device DPR. The canvas remains rendered off-screen instead of using `display: none`, preserving measurable node dimensions.

## TDD Evidence
### Utility RED
```text
node --test tests/analytics.test.js tests/poster.test.js
Error: Cannot find module '../wechat/miniprogram/utils/analytics'
Error: Cannot find module '../wechat/miniprogram/utils/poster'
ℹ fail 2
```

### Page RED
```text
node --test tests/navigation.test.js tests/result-page.test.js
✖ quiz page encodes answers into the future result route
✖ home page starts the quiz route
✖ result page shares the top wine and the normalized answer query
✖ result page generates a DPR-scaled poster, previews it, and records the event
✖ result page requires a generated poster before saving
ℹ pass 11
ℹ fail 11
```

### Preview Failure RED
```text
node --test --test-name-pattern='poster preview failures' tests/result-page.test.js
TypeError: previewOptions.fail is not a function
ℹ fail 1
```

### GREEN
```text
node --test tests/analytics.test.js tests/poster.test.js tests/result-utils.test.js tests/navigation.test.js tests/result-page.test.js
ℹ tests 31
ℹ pass 31
ℹ fail 0
```

## Full Verification
```text
./scripts/check.sh
ℹ tests 52
ℹ pass 52
ℹ fail 0
✅ check passed
```

## Self-Review
- Confirmed Storage failures are logged and never interrupt navigation, sharing, copying, or poster flows.
- Confirmed analytics remain local and bounded to the newest 200 entries.
- Confirmed all recommendation/poster modeling and drawing stay in pure utilities while selector queries, Canvas export, preview, permissions, and album saving stay in the result page.
- Confirmed poster busy state resets on selector, drawing, export, and preview failures.
- Confirmed save success is shown only from the API success callback; denied permission opens settings only after modal confirmation.
- Confirmed the generated poster path remains available if preview fails, allowing a later save attempt.

## Commit
- `9a9609b` — `feat: add Mini Program sharing and analytics`

## Concerns
- Canvas output should receive one device-preview pass in WeChat DevTools/on-device because font metrics can vary across platforms; automated tests cover deterministic model content, drawing calls, DPR clamping, export/preview state, and failures.
