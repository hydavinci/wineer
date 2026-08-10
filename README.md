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
│   └── data -> ../data  # 软链，供网页 fetch data/baijiu.json
├── scripts/
│   └── collect.py       # 数据校验 / 统计 / 维护脚本
└── README.md
```

## 推荐逻辑

前端打分模型（`app.js` 的 `scoreItem`）：
- **场景匹配** +30
- **预算档位** 同档 +30 / 相邻 +12 / 差远 -10
- **香型偏好** 对味 +22（"清淡"映射清香+米香；"不限"给保底分）
- **饮者经验** 新手加权 beginner 分、惩罚高度数；老酒客奖励高度数/个性款

取总分最高为主推，其后 3 款为"你也可以考虑"。

## 数据库维护

```bash
python3 scripts/collect.py validate   # 校验字段合法性、查重
python3 scripts/collect.py stats      # 各维度分布统计
python3 scripts/collect.py template   # 打印新增酒款模板
```

**数据说明**：种子库为手工整理并参考公开榜单校对。价格为市场参考价（会随行情波动），仅用于推荐分档，**非实时报价**。不做无脑电商爬虫（反爬 + 版权风险）；扩库走"公开信息结构化 + 人工审核入库"。

## 部署

静态站，部署到 `wineer.graymammoth.com`：
- **Nginx** 站点配置见 `/tmp/wineer-nginx.conf`（root 指向 `/home/Wineer/web`）
- **DNS**：Cloudflare 加 `wineer` 子域记录指向本机
- 入口卡片已加到 GrayMammoth 首页（`/home/GrayMammoth/index.html`）

## 变现路线（规划）

1. **导购返佣**：结果页"去看看/比价"按钮 → 京东联盟/淘客链接（当前为京东搜索占位）
2. **流量主广告**：补充
3. **私域**：导流微信卖酒/团购（利润池）

## 待办

- [x] 扩充数据库到 100 款
- [ ] "去购买"按钮接入联盟返佣链接
- [ ] 结果分享（生成图片/海报）
- [ ] 埋点统计各维度选择分布，优化推荐权重
- [ ] 微信小程序版（同一份 baijiu.json 复用）
