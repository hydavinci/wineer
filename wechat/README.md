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

`tests/native-wxml.test.js` 在本机有微信开发者工具原生 `wcc` 时，还会编译真实 WXML 并验证渲染树中的选项、年龄确认和折叠卡片风险提示。macOS 默认查找标准安装路径，其他环境可设置 `WINEER_WCC` 指向已安装的编译器；未安装时仅跳过这组原生渲染用例，不自动安装工具。渲染树检查不替代真机操作。

## 导入微信开发者工具

导入目录：

```text
/Users/yhe/Work/wineer/wechat
```

也就是仓库内的 `wineer/wechat` 目录。项目配置位于 `wechat/project.config.json`，当前已配置项目 AppID。使用自己的项目时，请替换为对应的正式 AppID；游客体验也可使用 `touristappid`。配置校验兼容这两种形式，不需要把可运行项目改回游客模式。

## 数据与生成文件

酒款数据只编辑仓库根目录的：

```text
data/baijiu.json
```

每款酒新增 `volumeMl`（容量）、`edition`（版本）、`source`（资料来源）、`priceSource`（价格来源）、`priceUpdated`（价格记录日期）。未核实的字段保持 `null`，页面会明确提示待核实，不能把数据集的更新时间当成价格日期。来源填写实际参考的 HTTPS 地址，日期使用 `YYYY-MM-DD`，非法容量、链接或日期会阻止构建。

查看资料缺口：`python3 scripts/collect.py quality`。逐款核对记录保存在 `data/catalog-provenance.json`，覆盖已补字段、实际资料依据、未解决的度数/版本冲突以及未采用的价格信息。补入产品规格不代表已核实该规格的售价。

运行 `python3 scripts/collect.py review` 可获得固定2,430组偏好的前三名曝光统计及优先复核清单；通过 `--as-of YYYY-MM-DD` 固定复核日期。先处理高曝光酒款的价格和规格缺口，超过90天的观察记录提醒人工重访，不冒充报价发布日期，也不将抽样未出现误写成不参与推荐。

资料核对日期为 2026-09-07。普通产品资料访问日期不作为价格日期；只有实际观察到并采用的报价才记录 `priceUpdated`，并说明挂牌价或其他口径。具体来源保存在酒款的 `source` 字段。最初六款资料的版本边界如下，其余记录见上述台账：

| 酒款 ID | 资料依据与边界 |
|---|---|
| `kouzijiao` | 苏宁口子窖官方旗舰店十年型 50 度、500mL 商品页；不是口子窖兼10，不把整箱展示当作单瓶报价 |
| `qinghua20` | 汾酒官网青花20，53 度、500mL；包装版本仍待核实 |
| `fenjiu-bofen` | 汾酒官网 53 度玻瓶汾酒，475mL；不混用 500mL 献礼版 |
| `fenjiu-laobaifen10` | 汾酒官网老白汾酒10，包含 53 度、475mL；包装版本仍待核实 |
| `fenjiu-laobaifen15` | 汾酒官网封坛15，包含 53 度、475mL |
| `shuanggou-shengfang` | 洋河官网圣坊21版，42 度；主瓶500mL，另附20mL小瓶，容量字段仅记录主瓶 |

这些来源仅支撑所列产品身份与规格，不代表种子库的口感描述、评分或参考价经过厂家背书。不能以网页访问日期替代报价日期；旧参考价依然只用于粗略预算筛选，实际成交价可能超出预算。

新增资料的注意事项：

- 扩容前的 `0.3.2` 基线：100款均有核对台账，63款已有产品来源、62款已有容量、16款已有版本标识；只采用1条有明确口径的挂牌价，其余99款价格仍待核实。台账覆盖不等于所有酒款或所有字段已获确认。
- 梦之蓝M6+、M3水晶版采用550mL，海之蓝42度与沱牌T68采用480mL，九江双蒸29.5度采用610mL；天之蓝官网同时列480/500mL，原条目容量仍留空。
- 宋河秘藏5号采用厂商展馆的480mL规格，红星43度蓝瓶采用自营商品的750mL规格；不要将其他容量价格直接套用。
- 衡水老白干1915的67度500mL礼盒采用景区官网商品页3318元挂牌价，替换无来源的400元旧估值；并同步归入超高端档。2026-09-07是这条挂牌信息的观察记录日，不是页面发布日期或成交日期；商城结算价与库存未确认，页面和卡片均保留风险说明。
- 厂家建议零售价、经销商招商价、礼盒/整箱价以及电商页面通用促销弹窗，不直接作为单瓶成交报价。没有采用的候选价格只保存在台账里，不进入推荐筛选。
- “蓝瓶绵柔8 56度”“董酒密钥1957”等身份存在疑问的原条目不擅改成相近商品；台账记录冲突，相关规格仍为待核实。
- 郎牌特曲T9的现官网香型与原记录冲突，暂不绑定现售版规格或来源；生肖茅台、经典五粮液、摘要等未明确版本的条目也不强行选版。两条普通玻汾记录可能重复，保留ID并记录待确认，未擅自合并。
- `appliedFields`只说明本次采用了哪些字段，不表示同一条目原有的香型、口感标签、推荐评分或价格均已经确认。台账不是运行时酒库，不额外打入小程序包体。

扩容按200款目标推进，单瓶参考价区间为：≤100元35款、>100–200元40款、>200–500元55款、>500–900元35款、>900–1500元20款、>1500元15款。区间不重叠，沿用现有六档预算；目标和实际数量分开记录。运行 `python3 scripts/collect.py stats` 查看数量、占比、配额缺口及价格待核实数，追加 `--json` 获取机器可读结果。

`0.4.1` 实际为145条酒款资料，六档分别为23、31、52、24、8、7条，距200款目标仍差55条；未用估价凑齐新增配额。自100条基线新增的45条均有具体容量、产品资料和独立记录的价格依据。当前全库容量覆盖107条、产品来源108条、版本标识46条、价格依据46条；原99条无依据价格仍标为未核实估值。其余69条候选保存于 `data/catalog-candidates.json`，不打入运行时包，也不参与推荐。

本次将普通梦之蓝M9（52度500mL、非金M9）从候选移入900–1500元档，采用官方商城1099元活动展示价，1599元是划线原价；活动截止日、库存与结算未核实。商务送礼示例中，它与国窖1573等同分，因已有报价依据进入备选，不代表实饮评价优于其他酒。口子窖十年型改用匹配50度500mL单瓶来源，但仍无可采用的报价。两条53度475mL玻汾仅新增“疑似同款”可见提示，没有强行设置 `identityGroup`；未采用报价及阻塞原因保存在台账。

卡片通过 `priceBasis` 区分商家报价、官方指导价、挂牌价和未核实估值。指导价和挂牌价不等于成交价，报价观察日也不证明价格刚刚更新；具体历史时间与来源限制见逐款台账。新增酒款的场景和新手适应评分如仅为规则推断，会明确提示“未做实饮评测”，不会包装成厂家背书或体验结论。

以下文件由 `bash scripts/build.sh` 生成，**不要直接修改**：

- `miniprogram/data/baijiu.js`
- `miniprogram/shared/recommender.js`

如果生成文件缺失或已过期，重新运行构建命令；`bash scripts/check.sh` 会对缺失文件给出明确提示。

## 页面地图

| 页面 | 路径 | 用途 |
|---|---|---|
| 首页 | `pages/home/home` | 确认已满 18 岁并开始问答 |
| 问答 | `pages/quiz/quiz` | 金额档位和场景单选；按需展开其余四维偏好；恢复默认 |
| 结果 | `pages/result/result` | 首选与精简备选、按需展开口感资料、保留当前选择调整偏好、分享及辅助海报 |
| 酒库 | `pages/catalog/catalog` | 成年确认后按酒名/品牌/规格搜索，按价格区间和香型筛选，分批浏览资料 |

## MVP 支持范围

- 首页、问答直达与分享直达均覆盖 18 岁确认；确认只保存在当前设备
- 六维 0–10 参数保持兼容；预算为六个金额档位，场景为五个用途选项，其余四维使用可展开滑块；不再提供重复的场景预设，选择场景不会修改预算或其他偏好
- 旧分享或调整链接保留原始六维值，不因映射为选项而改写；仅用户选择新选项时写入对应档位值
- 与 Web 版共享的确定性推荐，最多三款；按静态参考价严格排除超预算款，候选不足不凑数
- 同一预算文案使用同一打分档位；预算指每瓶上限，不强制花满
- 携带六维答案和 `from=share` 来源标记的分享路径；酒库更新后重新计算，不冻结历史排名
- 使用“优先推荐 / 备选”标签，不显示概率百分比；同时展示实际匹配理由和需要权衡的条件
- 得分相同时，先比较偏好冲突数量和报价依据级别，再按参考价、稳定酒款 ID 排序；备选仅在得分、冲突数和报价依据均相同时优先补充不同品牌，不降低匹配得分
- 报价依据仅区分有来源和观察日期的商家报价、指导价/挂牌价及估值，不保证可购买或实时有效；不按访问日期把旧报价升为新报价
- 已确认同款可标注 `identityGroup`，保留旧 ID，但推荐只占一个名额；来源和容量必需，已知规格冲突会阻止构建，疑似重复不直接合并
- 去掉重复对比区；卡片收起时仍展示理由、权衡、选购提醒、规格和价格风险，口感与资料依据按需展开
- 规格和价格来源透明展示，缺少资料时提示待核实
- 复制酒名及已知容量、版本作为购买搜索关键词；未知字段不会拼入
- 本地 Canvas 海报生成、预览与保存权限处理
- 本地最近 200 条行为事件；可选、需用户同意的 HTTPS 上报
- 首页与结果页可进入酒库浏览，返回不丢失原推荐；搜索支持多词、大小写及全角字符归一化，价格区间独立于问答的预算上限
- 酒库按静态参考价由低到高展示，每批20条，空结果可清除筛选；不显示推荐排名或偏好理由，不收录未定价候选，也不新增满意度询问
- 调整偏好保留答案，全部重选恢复默认；无效参数和无效数据有独立处理

## 行为记录

默认没有网络上报。记录键为 `wineer_events`；事件带 `id`、`schemaVersion`、`event`、`payload`、`path`、`ts`。结果页不再询问推荐是否有帮助，也不再收集正负反馈或原因；历史本机反馈不主动删除。

主要事件：

| 事件 | 含义 |
|---|---|
| `start_quiz` / `quiz_view` | 首页开始 / 问答进入；`quiz_view.source` 为 `home`、`adjust`、`restart`、`feedback` 或 `direct`，仅 `adjust` / `feedback` 标记编辑 |
| `recommend_attempt` | 点击生成，尚未代表推荐成功 |
| `result_view` | 推荐结果进入展示状态，包含答案、酒款 ID、分享来源和酒库版本 |
| `copy_keyword_attempt` / `copy_keyword_success` / `copy_keyword_failed` | 搜索词复制开始 / 成功 / 失败，均不代表购买 |
| `poster_generation_attempt` / `poster_generated` / `poster_generation_failed` | 海报生成开始 / 成功 / 失败 |
| `poster_saved` / `share_click` | 相册保存成功 / 调用转发，后者不代表接收者已打开 |
| `adjust_preferences` / `restart` | 保留偏好调整 / 全部重选 |

“调整偏好”始终保留原始答案，用户自行调整后再生成推荐；旧版带 `from=feedback` 和 `focus` 的链接仍兼容。未配置接口时，不显示上报设置或本机记录提示卡片；已配置接口时保留独立的授权开关，方便用户关闭既有授权。

启用可选上报需完成以下配置，仓库不包含接收服务：

1. 在 `miniprogram/config.js` 的 `analyticsEndpoint` 填写自己维护的 HTTPS 接口，并配置小程序 request 合法域名。
2. 接口接收 `POST` JSON：`{"events":[{"id":"...","schemaVersion":1,"event":"result_view","payload":{},"path":"/pages/result/result","ts":"..."}]}`。按 `id` 去重，持久化后再返回 2xx；其他状态视为未确认，客户端保留记录供重试。
3. 用户在结果页明确同意后才发送最近 200 条新版记录（可能包含此前保存的历史反馈）。之后在小程序重新进入前台时尝试发送，也可手动上报或重试。

上传超时为 10 秒，无循环重试。同一时间只发一个批次；成功仅标记该批次，不丢弃上传期间新增的记录。关闭开关会中止进行中的请求并阻止后续上报，已经送达服务端的记录不会撤回。旧版没有事件 ID 的本机记录不参与上传；本地日志超过 200 条时淘汰最早记录，这不是保证送达的业务队列。

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
- [ ] 2. Budget and occasion use labeled radio options; expanding advanced preferences reveals four sliders. Changing the scene preserves the budget and other preferences; reset restores defaults. No scene presets are shown. Old links retain all six values even within a shared budget band.
- [ ] 3. Default answers render exactly three different wines in this order: `kouzijiao`, `fenjiu-laobaifen10`, `shuanggou-shengfang`.
- [ ] 4. The low-budget profile renders `jiujiang-shuangzheng`, `yubingshao`, `fenjiu-huanggaibofen`.
- [ ] 5. On a fresh device, a shared result stays hidden until age confirmation, then restores the same six answers. Declining returns home without showing wines.
- [ ] 6. Every collapsed card shows a ranking label, reasons, tradeoffs, purchase cautions, specifications and price-risk notices; expanding reveals taste and source details. There is no duplicate comparison or probability percentage.
- [ ] 7. Copy purchase keyword includes the wine name and known specifications, omits unknown fields, and reports clipboard failures.
- [ ] 8. Poster generation displays a preview; saving handles success and denied album permission distinctly.
- [ ] 9. Adjust preferences retains all six answers; restart returns to a fresh quiz. Rapid navigation taps and failures have explicit handling.
- [ ] 10. Invalid result parameters normalize safely, and invalid wine data shows an error state without retry loops.
- [ ] 11. No recommendation helpfulness question, feedback buttons or reason picker appears. Adjustment preserves answers, and legacy focused adjustment links remain usable.
- [ ] 12. With no endpoint or no user consent, no analytics request is sent. With both enabled, HTTP failures retain records; retry succeeds; disabling stops reporting.
- [ ] 13. The save button appears only after a poster exists. Card sharing opens the result; the auxiliary poster does not claim to contain a scannable entry.
- [ ] 14. Home and result can open the catalog. Direct catalog entry requires adult confirmation; declining returns home. Returning to a result preserves its answers and allows navigation again.
- [ ] 15. Catalog search, price and aroma filters combine correctly. Exact upper price boundaries belong to one band only. Empty searches offer reset; additional batches do not duplicate rows. Catalog cards retain warnings without recommendation ranks.
- [ ] 16. On both Android and iOS, check loading/disabled button colors, long names and source links, keyboard input, catalog scrolling, share return and poster permissions. Native rendering and browser checks do not replace device acceptance.
