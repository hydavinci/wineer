# Wineer 微信小程序

Wineer 微信小程序 MVP 复用 Web 版酒款数据和推荐核心，提供六维偏好问答、Top 3 白酒推荐、结果分享与本地海报。

## 前置条件

- 微信开发者工具
- Node.js 22
- Python 3

## 构建与校验

在仓库根目录执行：

```bash
bash scripts/build.sh
bash scripts/check.sh
```

`build.sh` 会从唯一数据源和共享推荐核心生成 Web 与小程序运行时文件；`check.sh` 会校验数据、全部小程序 JavaScript 语法以及完整 Node.js 测试集。

## 导入微信开发者工具

导入目录：

```text
/Users/yhe/Work/wineer/wechat
```

也就是仓库内的 `wineer/wechat` 目录。项目配置位于 `wechat/project.config.json`，其中 `appid` 默认为占位值 `touristappid`。获得可用 AppID 后，将该字段替换为自己的 AppID，再重新导入或编译。

## 数据与生成文件

酒款数据只编辑仓库根目录的：

```text
data/baijiu.json
```

以下文件由 `bash scripts/build.sh` 生成，**不要直接修改**：

- `miniprogram/data/baijiu.js`
- `miniprogram/shared/recommender.js`

如果生成文件缺失或已过期，重新运行构建命令；`bash scripts/check.sh` 会对缺失文件给出明确提示。

## 页面地图

| 页面 | 路径 | 用途 |
|---|---|---|
| 首页 | `pages/home/home` | 展示 18 岁提示并开始问答 |
| 问答 | `pages/quiz/quiz` | 调整预算、场景、柔和度、风味浓度、品牌体面和尝新程度六个维度 |
| 结果 | `pages/result/result` | 展示 Top 3、复制购买搜索词、转发结果、生成/预览/保存海报和重新选择 |

## MVP 支持范围

- 18 岁提示与问答入口
- 六个 0–10 滑块及实时数值、解释文案
- 与 Web 版共享的确定性 Top 3 推荐
- 携带六维答案的结果分享路径
- 排名、推荐指数、标签、理由、口感、选购提示和参考价格展示
- 复制 `<酒名> 京东搜索` 购买关键词
- 本地 Canvas 海报生成、预览与保存权限处理
- 本地最近 200 条行为事件记录
- 重新选择和无效参数、无效数据错误状态

## 明确不支持

- 登录
- 云后端
- 收藏
- 电商跳转
- 支付
- 实时价格

## 微信开发者工具人工验收

导入并编译项目后，逐项验证。未实际完成开发者工具或真机操作时，不要勾选：

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
