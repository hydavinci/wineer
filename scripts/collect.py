#!/usr/bin/env python3
"""
Wineer 白酒数据采集/维护脚本 (半自动)

设计原则：
- 不做无脑爬虫。大规模爬电商实时数据有反爬和版权风险，不适合公开产品。
- 本脚本用于「结构化维护」种子库：校验字段、去重、统计、导出。
- 后续可扩展 fetch_* 函数从公开页面补充字段，但抓取结果需人工审核后入库。

用法:
    python3 collect.py validate      # 校验数据库完整性
    python3 collect.py stats         # 统计各维度分布
    python3 collect.py stats --json  # 按问答预算分档，输出配额及价格依据统计
    python3 collect.py quality       # 输出逐款资料缺口（JSON）
    python3 collect.py template      # 打印一条新增酒款模板
"""
import json, sys, os, subprocess

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "baijiu.json")
QUALITY_FIELDS = ["volumeMl", "edition", "source", "priceBasis", "priceSource", "priceUpdated"]


def load():
    with open(DB_PATH, encoding="utf-8") as f:
        return json.load(f)


def validate():
    script = os.path.join(os.path.dirname(__file__), "generate-wechat-data.js")
    result = subprocess.run(["node", script, DB_PATH, "--validate"], check=False)
    if result.returncode:
        sys.exit(result.returncode)


def quality():
    items = load()["items"]
    missing = {field: sum(item.get(field) is None for item in items) for field in QUALITY_FIELDS}
    needs_review = [
        item["id"] for item in items
        if any(item.get(field) is None for field in QUALITY_FIELDS)
    ]
    print(json.dumps({
        "total": len(items), "missing": missing, "needsReview": needs_review
    }, ensure_ascii=False, indent=2))


def stats():
    script = os.path.join(os.path.dirname(__file__), "catalog-stats.js")
    result = subprocess.run(["node", script, DB_PATH], check=False, capture_output=True, text=True)
    if result.returncode:
        print(result.stderr, file=sys.stderr, end="")
        sys.exit(result.returncode)
    report = json.loads(result.stdout)
    if "--json" in sys.argv[2:]:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return
    items = load()["items"]
    def dist(key):
        d = {}
        for it in items: d[it[key]] = d.get(it[key], 0) + 1
        return dict(sorted(d.items(), key=lambda x:-x[1]))
    print(f"总计: {len(items)} 款\n")
    print("香型分布:", dist("aroma"))
    print("价位分布:", dist("priceTier"))
    prices = [it["price"] for it in items]
    print(f"价格区间: ¥{min(prices)} - ¥{max(prices)}")
    print(f"\n扩容目标: {report['targetTotal']} 款；总量缺口: {report['gap']} 款")
    print("单瓶参考价区间 | 数量 | 占比 | 目标 | 缺口 | 价格待核实")
    for band in report["bands"]:
        print(f"{band['label']} | {band['count']} | {band['percent']}% | "
              f"{band['target']} | {band['gap']} | {band['unverifiedPrices']}")
    labels = {
        "estimate": "未核实估值", "retail": "商家报价", "msrp": "官方指导价",
        "listing": "挂牌价", "unspecified": "口径未标注"
    }
    print("\n价格口径:", {labels[key]: count for key, count in report["priceBasisCounts"].items()})
    print("分布按库内参考价计算；有价格来源不等于成交价，价格变动会影响归档。")


def template():
    tpl = {
        "id":"brand-model","name":"品牌 型号 度数","brand":"品牌",
        "aroma":"浓香","abv":52,"price":300,"priceTier":"中端",
        "taste":["口感标签1","口感标签2"],
        "scene":["家庭聚餐","朋友小聚"],"beginner":4,
        "region":"产区","highlight":"一句话亮点","caution":"避坑提示",
        "volumeMl":None,"edition":None,"source":None,
        "priceBasis":"estimate",
        "priceSource":None,"priceUpdated":None
    }
    print(json.dumps(tpl, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "validate"
    {"validate":validate, "stats":stats, "quality":quality, "template":template}.get(cmd, validate)()
