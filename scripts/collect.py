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
    python3 collect.py template      # 打印一条新增酒款模板
"""
import json, sys, os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "baijiu.json")
REQUIRED = ["id","name","brand","aroma","abv","price","priceTier",
            "taste","scene","beginner","region","highlight","caution"]
AROMAS = {"酱香","浓香","清香","兼香","米香","凤香","其他"}
TIERS = {"口粮","中端","高端","超高端"}


def load():
    with open(DB_PATH, encoding="utf-8") as f:
        return json.load(f)


def validate():
    data = load(); items = data["items"]; errs = []; ids = set()
    for i, it in enumerate(items):
        tag = it.get("name", f"#{i}")
        for k in REQUIRED:
            if k not in it:
                errs.append(f"[{tag}] 缺字段: {k}")
        if it.get("id") in ids:
            errs.append(f"[{tag}] 重复 id: {it['id']}")
        ids.add(it.get("id"))
        if it.get("aroma") not in AROMAS:
            errs.append(f"[{tag}] 非法香型: {it.get('aroma')}")
        if it.get("priceTier") not in TIERS:
            errs.append(f"[{tag}] 非法价位档: {it.get('priceTier')}")
        b = it.get("beginner")
        if not (isinstance(b, int) and 1 <= b <= 5):
            errs.append(f"[{tag}] beginner 应为 1-5 整数")
    if errs:
        print("❌ 校验失败:"); [print("  "+e) for e in errs]; sys.exit(1)
    print(f"✅ 校验通过：{len(items)} 款，全部字段合法，无重复 id")


def stats():
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


def template():
    tpl = {
        "id":"brand-model","name":"品牌 型号 度数","brand":"品牌",
        "aroma":"浓香","abv":52,"price":300,"priceTier":"中端",
        "taste":["口感标签1","口感标签2"],
        "scene":["家庭聚餐","朋友小聚"],"beginner":4,
        "region":"产区","highlight":"一句话亮点","caution":"避坑提示"
    }
    print(json.dumps(tpl, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "validate"
    {"validate":validate, "stats":stats, "template":template}.get(cmd, validate)()
