# 🍶 Wineer — 白酒推荐

回答几个维度的问题（场景 / 预算 / 香型 / 饮者），推荐一款对味的白酒，并给出推荐理由和选购避坑提示。

## 目录结构

```
Wineer/
├── data/
│   └── baijiu.json      # 白酒数据库（实际数量及资料缺口由 collect.py 输出）
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

同分时先比较偏好冲突数，再比较报价依据（有来源和观察日期的商家报价优先，其次官方指导价/挂牌价，估值最后），然后按参考价和稳定 ID 排序。选择备选时，仅在得分、冲突数和报价依据级别相同的候选中优先补充尚未出现的品牌，不牺牲匹配得分或突破预算。价格只用于参考筛选，实际成交价可能超出预算；不会根据观察日期把历史报价当作新报价。

经资料核实为同一产品的记录可标注 `identityGroup`，保留旧 ID，但每次推荐最多占一个名额。分组必须具备产品来源和容量，不允许合并已知品牌、度数、容量、香型或版本冲突的记录；疑似重复不能直接当作已确认同款。

## 数据库维护

```bash
python3 scripts/collect.py validate   # 校验字段合法性、查重
python3 scripts/collect.py stats      # 各维度分布统计
python3 scripts/collect.py stats --json # 六档预算的数量、占比、目标缺口和价格口径
python3 scripts/collect.py quality    # 规格、来源和价格日期的待核实清单
python3 scripts/collect.py review     # 2,430组固定偏好的曝光统计与优先复核清单
python3 scripts/collect.py review --as-of 2026-09-07 # 固定复核日期，便于比较
python3 scripts/collect.py template   # 打印新增酒款模板
bash scripts/build.sh                 # 生成 Web 与微信小程序全部运行时副本
bash scripts/check.sh                 # 完整本地校验
```

**数据说明**：酒库为手工整理并参考公开资料校对。价格区分未核实估值、商家报价、官方指导价和挂牌价，仅用于参考分档，**非实时成交报价**。不做无脑电商爬虫（反爬 + 版权风险）；扩库走"公开信息结构化 + 人工审核入库"。

`volumeMl`、`edition`、`source`、`priceSource`、`priceUpdated` 用于记录具体规格和资料依据，未知时显式保留 `null`，不推测容量、不伪造来源或更新时间。数据集更新时间不代表价格已核实。数据校验与构建共用 Node.js 校验入口，运行维护脚本需安装 Node.js 22 和 Python 3。

逐款资料核对记录在 `data/catalog-provenance.json`，包含采用字段、产品来源、身份冲突和价格口径；覆盖率通过 `python3 scripts/collect.py quality` 查看。大部分原参考价仍待核实，不能把产品页作为价格凭据。已采用的挂牌价会明确注明不等于商城结算价，资料边界见 `wechat/README.md`。

`review` 把资料存在缺口的酒款按前三名曝光次数、缺口数和 ID 排序，便于先核实最常被推荐的价格。输出未在抽样中出现的 ID 和同品牌前三名次数，不把抽样覆盖率当作满意度或强制曝光目标。超过90天的观察记录仅触发人工复核提醒，不说明报价已经失效；未来观察日期会单独标记。候选池不参与这项抽样。

扩容目标保存在 `data/catalog-targets.json`，六档分别计划35、40、55、35、20、15款，共200款。统计复用推荐核心的100/200/500/900/1500元预算边界，配额与边界不一致会报错。配额是研究目标，不是已入库数量；实际覆盖与缺口以 `stats` 输出为准，不用其他档位或重复包装凑数。

`0.4.2` 实际入库146条酒款资料（`0.4.0` 新增44条，`0.4.1`、`0.4.2`各新增1条），距200款目标仍差54条。六档当前为23、31、52、25、8、7条；另有68条缺少可采用单瓶报价或身份待核实的候选保存在 `data/catalog-candidates.json`，不计入推荐库。库内价格口径为98条未核实估值、22条商家报价、18条官方指导价、8条挂牌价；部分依据是明确注明日期的历史上市价格，不能视为当前成交价。

此前新增普通梦之蓝M9（52度500mL），采用官方商城1099元活动展示价而非1599元划线原价，明确不保证结算、库存或活动期限。口子窖十年型改用单瓶规格来源，但保留未核实估值。

本轮将黄盖玻汾53度475mL的无来源估值改为苏宁聚合页56.50元单瓶展示价，严格标为挂牌价，商家结算价及库存仍未核实。两条玻汾仍缺乏逐记录版本/条码映射，不设已确认分组、不互相复制价格。青花30复兴版页面的隐藏价格字段、京东页面的其他推荐商品报价均未采用；未采纳原因保存在证据台账，不把观察日期当作价格有效期。

新增泸州老窖1952（52度500mL单瓶），采用银行商城第三方供应商752元全额支付展示价，不用分期月供；购买资格、库存、运费及结算未核实，不能视为全国通用到手价。宝丰金标32元、限定2021至2022年出厂的红运郎2000元只保存为候选证据：前者仍有潜在重复身份，后者不能套给未限定年份的产品，均未加入推荐。

`priceBasis` 使用 `estimate`（未核实估值）、`retail`（商家报价）、`msrp`（官方指导价）、`listing`（挂牌价）。后三类必须同时有价格来源和观察记录日期；估值即使附有链接也不算已核实报价。旧数据未标注口径时按待核实处理。新增酒款没有实饮评价时，新手适应评分使用中性值，场景按价段作规则推断，并在选购提示和台账明确说明。

## 微信小程序 MVP

从仓库根目录生成运行时文件并执行完整校验：

```bash
bash scripts/build.sh
bash scripts/check.sh
```

在微信开发者工具中导入 `/Users/yhe/Work/wineer/wechat`（仓库内目录为 `wechat/`）。`wechat/project.config.json` 当前已配置项目 AppID；使用自己的项目时替换为对应正式 AppID，也兼容游客模式 `touristappid`。

酒款数据只编辑 `data/baijiu.json`。`web/data/baijiu.json`、`web/shared/recommender.js`、`wechat/miniprogram/data/baijiu.js` 和 `wechat/miniprogram/shared/recommender.js` 均由 `bash scripts/build.sh` 生成，不要直接修改。页面、功能范围和人工验收步骤见 [`wechat/README.md`](wechat/README.md)。

小程序首页和结果页提供独立“浏览酒库”入口，支持酒名/品牌/已知规格搜索、六个互不重叠的价格区间和香型筛选。每次先显示20条，可继续加载；浏览页不是推荐排名，保留成年确认、规格与价格风险提示，不需要登录或后端。

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

`docs/core-database-expansion.md` 保留早期长期设想。当前执行的是 `data/catalog-targets.json` 中的200款分档目标，优先补足薄弱价段的可靠资料，不按历史300款方案凑数。

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
