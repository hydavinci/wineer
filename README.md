# 🍶 Wineer — 白酒推荐

回答几个维度的问题（场景 / 预算 / 香型 / 饮者），推荐一款对味的白酒，并给出推荐理由和选购避坑提示。

## 目录结构

```
Wineer/
├── data/
│   └── baijiu.json      # 白酒数据库（种子库，100 款，覆盖主流香型、价位与区域名酒）
├── web/                 # 前端（纯静态，部署根目录）
│   ├── index.html       # 引导式问答 + 结果页
│   ├── style.css
│   ├── app.js           # 推荐引擎（前端打分匹配）
│   └── data/baijiu.json # 部署用数据副本，由 scripts/build.sh 生成
├── scripts/
│   ├── collect.py       # 数据校验 / 统计 / 维护脚本
│   ├── build.sh         # 复制 data/baijiu.json 到 web/data/
│   └── check.sh         # 本地校验脚本
├── docs/
│   └── core-database-expansion.md # 300 款核心酒库扩容方案
└── README.md
```

## 推荐逻辑

前端打分模型（`app.js` 的 `scoreItem`）：
- **预算档位** 同档 +30 / 相邻 +12 / 差远扣分，并对明显超预算款做强惩罚
- **场景匹配** +24
- **香型偏好** 对味 +22
- **柔和度 / 酒劲承受** 新手加权 beginner 分，低刺激偏好惩罚高度数；老酒客奖励高度数/个性款
- **品牌/面子需求** 根据品牌知名度、价位档、宴请/送礼场景加权
- **尝新程度** 稳妥偏好奖励大众香型，尝新偏好奖励酱香/凤香/其他等个性风味

结果优先从不明显超预算的候选中取 Top 3；匹配展示为相对推荐指数。

## 数据库维护

```bash
python3 scripts/collect.py validate   # 校验字段合法性、查重
python3 scripts/collect.py stats      # 各维度分布统计
python3 scripts/collect.py template   # 打印新增酒款模板
bash scripts/build.sh                 # 生成 web/data/baijiu.json 部署副本
bash scripts/check.sh                 # 完整本地校验
```

**数据说明**：种子库为手工整理并参考公开榜单校对。价格为市场参考价（会随行情波动），仅用于推荐分档，**非实时报价**。不做无脑电商爬虫（反爬 + 版权风险）；扩库走"公开信息结构化 + 人工审核入库"。

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

1. **导购返佣**：结果页"去看看/比价"按钮 → 京东联盟/淘客链接（当前为京东搜索占位）
2. **流量主广告**：补充
3. **私域**：导流微信卖酒/团购（利润池）

## 待办

- [x] 扩充数据库到 100 款
- [ ] "去购买"按钮接入联盟返佣链接
- [x] 结果分享（链接 + 本地海报）
- [x] 简单埋点统计推荐/分享/购买点击
- [ ] 接入真实 analytics endpoint
- [ ] 微信小程序版（同一份 baijiu.json 复用）
