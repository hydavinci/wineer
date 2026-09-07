# 🍶 Wineer — 白酒推荐

回答几个维度的问题（场景 / 预算 / 香型 / 饮者），推荐一款对味的白酒，并给出推荐理由和选购避坑提示。

## 目录结构

```
Wineer/
├── data/
│   └── baijiu.json      # 白酒数据库（种子库，100 款，覆盖主流香型、价位与区域名酒）
├── shared/
│   └── recommender.js   # 环境无关的推荐核心（CommonJS/浏览器全局）
├── tests/
│   └── recommender.test.js # 推荐核心黄金向量与校验测试
├── web/                 # 前端（纯静态，部署根目录）
│   ├── index.html       # 引导式问答 + 结果页
│   ├── style.css
│   ├── app.js           # Web 交互、分享与埋点（调用共享推荐核心）
│   └── data/baijiu.json # 部署用数据副本，由 scripts/build.sh 生成
├── scripts/
│   ├── collect.py       # 数据校验 / 统计 / 维护脚本
│   ├── build.sh         # 校验并生成 Web/小程序运行时数据与共享核心副本
│   └── check.sh         # 本地校验脚本
├── docs/
│   └── core-database-expansion.md # 300 款核心酒库扩容方案
└── README.md
```

## 推荐逻辑

推荐打分模型统一实现在 `shared/recommender.js`，Web 与微信小程序共同使用：
- **预算上限** 文案、金额上限和打分档位由同一份配置生成；预算是每瓶最高金额，合适的低价款也会推荐
- **场景匹配** +24
- **香型偏好** 对味 +22
- **柔和度 / 酒劲承受** 新手加权 beginner 分，低刺激偏好惩罚高度数；老酒客奖励高度数/个性款
- **品牌/面子需求** 根据品牌知名度、价位档、宴请/送礼场景加权
- **尝新程度** 稳妥偏好奖励大众香型，尝新偏好奖励酱香/凤香/其他等个性风味

结果只从静态参考价不超预算的候选中取最多三款，候选不足不强行凑数。界面使用“优先推荐 / 备选”而不是概率百分比，推荐理由基于酒款实际属性，并展示偏好上的取舍。核心保留 `matchPercent` 供旧调用方兼容，不用于当前界面或作为满意概率。

同分时依次优先偏好冲突更少、参考价更低的酒款，最后按稳定 ID 排序，不再依赖数据文件中的先后顺序。价格只用于参考筛选，实际成交价可能超出预算。

## 数据库维护

```bash
python3 scripts/collect.py validate   # 校验字段合法性、查重
python3 scripts/collect.py stats      # 各维度分布统计
python3 scripts/collect.py stats --json # 六档预算的数量、占比、目标缺口和价格口径
python3 scripts/collect.py quality    # 规格、来源和价格日期的待核实清单
python3 scripts/collect.py template   # 打印新增酒款模板
bash scripts/build.sh                 # 生成 Web 与微信小程序全部运行时副本
bash scripts/check.sh                 # 完整本地校验
```

**数据说明**：酒库为手工整理并参考公开资料校对。价格区分未核实估值、商家报价、官方指导价和挂牌价，仅用于参考分档，**非实时成交报价**。不做无脑电商爬虫（反爬 + 版权风险）；扩库走"公开信息结构化 + 人工审核入库"。

`volumeMl`、`edition`、`source`、`priceSource`、`priceUpdated` 用于记录具体规格和资料依据，未知时显式保留 `null`，不推测容量、不伪造来源或更新时间。数据集更新时间不代表价格已核实。数据校验与构建共用 Node.js 校验入口，运行维护脚本需安装 Node.js 22 和 Python 3。

逐款资料核对记录在 `data/catalog-provenance.json`，包含采用字段、产品来源、身份冲突和价格口径；覆盖率通过 `python3 scripts/collect.py quality` 查看。大部分原参考价仍待核实，不能把产品页作为价格凭据。已采用的挂牌价会明确注明不等于商城结算价，资料边界见 `wechat/README.md`。

扩容目标保存在 `data/catalog-targets.json`，六档分别计划35、40、55、35、20、15款，共200款。统计复用推荐核心的100/200/500/900/1500元预算边界，配额与边界不一致会报错。配额是研究目标，不是已入库数量；实际覆盖与缺口以 `stats` 输出为准，不用其他档位或重复包装凑数。

`0.4.0` 实际入库144款（本轮新增44款），尚未达到200款目标。六档当前为23、31、52、24、7、7款；另有70条缺少可采用单瓶价格的候选保存在 `data/catalog-candidates.json`，不计入推荐库。库内价格口径为99条未核实估值、22条商家报价、18条官方指导价、5条挂牌价；部分依据是明确注明日期的历史上市价格，不能视为当前成交价。

`priceBasis` 使用 `estimate`（未核实估值）、`retail`（商家报价）、`msrp`（官方指导价）、`listing`（挂牌价）。后三类必须同时有价格来源和观察记录日期；估值即使附有链接也不算已核实报价。旧数据未标注口径时按待核实处理。新增酒款没有实饮评价时，新手适应评分使用中性值，场景按价段作规则推断，并在选购提示和台账明确说明。

## 微信小程序 MVP

从仓库根目录生成运行时文件并执行完整校验：

```bash
bash scripts/build.sh
bash scripts/check.sh
```

在微信开发者工具中导入 `/Users/yhe/Work/wineer/wechat`（仓库内目录为 `wechat/`）。`wechat/project.config.json` 当前已配置项目 AppID；使用自己的项目时替换为对应正式 AppID，也兼容游客模式 `touristappid`。

酒款数据只编辑 `data/baijiu.json`。`web/data/baijiu.json`、`web/shared/recommender.js`、`wechat/miniprogram/data/baijiu.js` 和 `wechat/miniprogram/shared/recommender.js` 均由 `bash scripts/build.sh` 生成，不要直接修改。页面、功能范围和人工验收步骤见 [`wechat/README.md`](wechat/README.md)。

## 部署

静态站，部署前先运行：

```bash
bash scripts/build.sh
bash scripts/check.sh
```

部署到 `wineer.graymammoth.com`：
- **Nginx** 站点配置见 `/tmp/wineer-nginx.conf`（root 指向 `/home/Wineer/web`）
- **DNS**：Cloudflare 加 `wineer` 子域记录指向本机
- 入口卡片已加到 GrayMammoth 首页（`/home/GrayMammoth/index.html`）

## 分享与埋点

结果页支持：

- **分享结果链接**：生成带偏好参数的 URL，其他人打开后可复现同一组选择
- **生成分享海报**：本地 Canvas 生成 PNG，不依赖后端

简单埋点：

- 默认写入浏览器 `localStorage.wineer_events`，仅保留最近 200 条
- 如需上报到后端，在页面中配置 `window.WINEER_ANALYTICS_ENDPOINT = "/api/events"`
- 当前事件：`start_quiz`、`recommend`、`share_click`、`share_poster`、`buy_click`、`restart`

## 扩库规划

见 `docs/core-database-expansion.md`：建议先从 100 款扩到 300 款核心推荐库，再做 800–1500 款增强库，最后单独建设电商 SKU 库。

## 变现路线（规划）

1. **导购返佣**：结果页"去看看/比价"按钮 → 电商平台联盟/淘客链接（当前为搜索占位）
2. **流量主广告**：补充
3. **私域**：导流微信卖酒/团购（利润池）

## 待办

- [x] 扩充数据库到 100 款
- [ ] "去购买"按钮接入联盟返佣链接
- [x] 结果分享（链接 + 本地海报）
- [x] 简单埋点统计推荐/分享/购买点击
- [ ] 接入真实 analytics endpoint
- [ ] 微信小程序版（代码与自动化校验已完成；待微信开发者工具/真机人工验收）
