"use strict";

module.exports = {
  "meta": {
    "name": "Wineer 白酒数据库",
    "version": "0.4.1",
    "updated": "2026-09-07",
    "note": "共145条酒款资料，扩容目标200款。价格区分未核实估值、商家报价、官方指导价和挂牌价，仅作预算参考，非实时成交报价。逐款证据及身份冲突见catalog-provenance.json；分档目标见catalog-targets.json。",
    "schema": {
      "id": "唯一标识",
      "identityGroup": "可选：经核实同一产品的分组，保留旧ID但推荐只占一席；疑似同款不填写",
      "name": "酒款全名",
      "brand": "品牌",
      "aroma": "香型: 酱香/浓香/清香/兼香/米香/凤香/其他",
      "abv": "酒精度数",
      "price": "参考价(元)",
      "priceTier": "价位档: 口粮(<150)/中端(150-600)/高端(600-1500)/超高端(>1500)",
      "taste": "口感标签数组",
      "scene": "适用场景数组: 自饮/朋友小聚/家庭聚餐/商务宴请/送礼/收藏",
      "beginner": "是否适合新手 (1-5, 5最友好)",
      "region": "产区",
      "highlight": "亮点一句话",
      "caution": "避坑/注意提示",
      "volumeMl": "容量(mL)，未核实为 null",
      "edition": "具体版本，未核实为 null",
      "source": "酒款资料的 HTTPS 来源地址，未核实为 null",
      "priceSource": "参考价格的 HTTPS 来源地址，未核实为 null",
      "priceUpdated": "该规格价格记录日期 YYYY-MM-DD，未核实为 null；不使用数据集更新日期代替",
      "priceBasis": "价格口径: estimate未核实估值/retail商家报价/msrp官方指导价/listing挂牌价；后3项必须附来源和观察日期"
    }
  },
  "items": [
    {
      "id": "maotai-feitian",
      "name": "贵州茅台 飞天53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 2500,
      "priceTier": "超高端",
      "taste": [
        "醇厚",
        "酱香突出",
        "回味悠长",
        "不辣喉"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 2,
      "region": "贵州茅台镇",
      "highlight": "酱香标杆，硬通货，送礼撑场面",
      "caution": "假货重灾区，认准正规渠道防伪；新手可能喝不惯酱味",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.moutai.com.cn/mtgf/2023-10/31/article_2023103117423682414.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "wuliangye-pujing",
      "name": "五粮液 普五第八代52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 1050,
      "priceTier": "高端",
      "taste": [
        "香气浓郁",
        "甘冽",
        "层次丰富",
        "窖香"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川宜宾",
      "highlight": "浓香型标杆，接受度高",
      "caution": "注意区分老版新版，防贴牌开发酒",
      "volumeMl": 500,
      "edition": "第八代",
      "source": "https://www.wuliangye.com.cn/zh/main/main.html#/g=PRODUCT&id=38&dId=4",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guojiao1573",
      "name": "泸州老窖 国窖1573 52度",
      "brand": "泸州老窖",
      "aroma": "浓香",
      "abv": 52,
      "price": 900,
      "priceTier": "高端",
      "taste": [
        "窖香浓郁",
        "绵甜",
        "净爽"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州",
      "highlight": "浓香高端代表，窖池历史悠久",
      "caution": "防低价开发酒冒充",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "qinghua20",
      "name": "汾酒 青花20 53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 420,
      "priceTier": "中端",
      "taste": [
        "清爽",
        "干净",
        "入口柔和",
        "无杂味"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "清香型代表之一，口感偏清爽，接受程度因人而异",
      "caution": "清香型香气较淡，喜欢浓郁口感的人可能觉得寡",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.fenjiu.com.cn/gf/qinghua/2023-02-08/988.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "qinghua30",
      "name": "汾酒 青花30复兴版53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 900,
      "priceTier": "高端",
      "taste": [
        "优雅",
        "绵柔",
        "清雅花果香",
        "层次好"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "高端清香，优雅细腻，礼盒体面",
      "caution": "价格偏高，日常自饮不划算",
      "volumeMl": 500,
      "edition": "复兴版",
      "source": "https://product.suning.com/0000000000/12284042270.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jiannanchun",
      "name": "剑南春 水晶剑52度",
      "brand": "剑南春",
      "aroma": "浓香",
      "abv": 52,
      "price": 420,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "甘甜",
        "协调",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "四川绵竹",
      "highlight": "名酒里的中端口粮之王，宴请自饮都合适",
      "caution": "热门款假货多，认准渠道",
      "volumeMl": 500,
      "edition": null,
      "source": "https://product.suning.com/0030001198/12431666343.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yanghe-mengzhilan-m6",
      "name": "洋河 梦之蓝M6+ 52度",
      "brand": "洋河",
      "aroma": "浓香",
      "abv": 52,
      "price": 600,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "顺滑",
        "低刺激"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 4,
      "region": "江苏宿迁",
      "highlight": "绵柔浓香代表，喝着顺、不冲",
      "caution": "绵柔派偏甜，喜欢劲道的人可能觉得平",
      "volumeMl": 550,
      "edition": null,
      "source": "https://www.chinayanghe.com/product/yanghe/lsjdxl/2.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yanghe-haizhilan",
      "name": "洋河 海之蓝42度",
      "brand": "洋河",
      "aroma": "浓香",
      "abv": 42,
      "price": 140,
      "priceTier": "口粮",
      "taste": [
        "绵柔",
        "清淡",
        "易入口",
        "低度"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "江苏宿迁",
      "highlight": "国民口粮，低度绵柔，新手无压力",
      "caution": "度数低、酒体偏淡，老酒鬼嫌不过瘾",
      "volumeMl": 480,
      "edition": null,
      "source": "https://www.chinayanghe.com/product/yanghe/lsjdxl/19.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "gujing-gu8",
      "name": "古井贡酒 年份原浆古8 50度",
      "brand": "古井贡",
      "aroma": "浓香",
      "abv": 50,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "协调",
        "净爽",
        "有回甘"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "安徽亳州",
      "highlight": "徽酒代表，中端浓香高性价比",
      "caution": "年份原浆系列版本多，别买错档",
      "volumeMl": 500,
      "edition": null,
      "source": "https://detail.youzan.com/show/goods?alias=3f44l672fgmb9c9&from_source=gbox_seo",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "langjiu-honghualang",
      "name": "郎酒 红花郎15 53度",
      "brand": "郎酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 650,
      "priceTier": "高端",
      "taste": [
        "酱香",
        "醇厚",
        "焦香",
        "协调"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川古蔺",
      "highlight": "酱香里的次高端，茅台平替之一",
      "caution": "酱味重，新手过渡着喝",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.langjiu.cn/product?categoryId=6",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "qinghualang",
      "name": "郎酒 青花郎53度",
      "brand": "郎酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 900,
      "priceTier": "高端",
      "taste": [
        "酱香浓郁",
        "醇厚",
        "陈香",
        "回味长"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 2,
      "region": "四川古蔺",
      "highlight": "高端酱香，两大酱香白酒之一自居",
      "caution": "价格波动大，酱味厚新手慎入",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.langjiu.cn/product?categoryId=3",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xijiu-junpin",
      "name": "习酒 君品习酒53度",
      "brand": "习酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 900,
      "priceTier": "高端",
      "taste": [
        "酱香细腻",
        "醇厚",
        "优雅",
        "协调"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 3,
      "region": "贵州习水",
      "highlight": "茅台镇周边优质酱香，品质稳",
      "caution": "礼盒溢价，自饮选窖藏系列更值",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.gzxijiu.com/product/detail?menuId=Wds3VhamjqkrJ4TCRFJY5&id=55%E4%BA%A7%E5%93%81%E4%B8%AD%E5%BF%83",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xijiu-yaozhi",
      "name": "习酒 窖藏1988 53度",
      "brand": "习酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 550,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "醇和",
        "协调",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州习水",
      "highlight": "中端酱香口碑款，性价比高",
      "caution": "热销易有假，走正规渠道",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinshahuijiu",
      "name": "金沙回沙 摘要53度",
      "brand": "金沙",
      "aroma": "酱香",
      "abv": 53,
      "price": 600,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "丰满",
        "焦香",
        "醇厚"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "贵州金沙",
      "highlight": "贵州第二大酱香产区，中端有性价比",
      "caution": "品牌力弱于茅习郎，送礼认知度一般",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guotai",
      "name": "国台 国标酒53度",
      "brand": "国台",
      "aroma": "酱香",
      "abv": 53,
      "price": 500,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "协调",
        "醇厚"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "茅台镇新势力，中端酱香选择",
      "caution": "品牌年轻，收藏价值有限",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.guotaijiu.com/?products_81/724.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "niulanshan-baipai",
      "name": "牛栏山 白牌陈酿52度",
      "brand": "牛栏山",
      "aroma": "浓香",
      "abv": 52,
      "price": 25,
      "priceTier": "口粮",
      "taste": [
        "清淡",
        "略冲",
        "简单"
      ],
      "scene": [
        "自饮"
      ],
      "beginner": 3,
      "region": "北京",
      "highlight": "极致低价口粮，量大管饱",
      "caution": "液态法/固液法为主，非纯粮，别拿来待客送礼",
      "volumeMl": 500,
      "edition": "白瓶陈酿（52度）",
      "source": "https://www.suning.com/item/0000000000/10015173415.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "hongxing-erguotou",
      "name": "红星 二锅头蓝瓶绵柔8年56度",
      "brand": "红星",
      "aroma": "清香",
      "abv": 56,
      "price": 60,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "爽净",
        "有劲",
        "略辣"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "北京",
      "highlight": "高度清香口粮，京味十足，实惠",
      "caution": "56度偏烈，不胜酒力者慎",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "laobaigan",
      "name": "衡水老白干 1915 67度",
      "brand": "老白干",
      "aroma": "其他",
      "abv": 67,
      "price": 3318,
      "priceTier": "超高端",
      "taste": [
        "醇厚",
        "净爽",
        "高烈",
        "老白干香"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 2,
      "region": "河北衡水",
      "highlight": "老白干香型代表，度数猛，老酒客最爱",
      "caution": "参考价采用景区官网挂牌价，不代表商城结算价；67度极烈，新手绝对不建议上手",
      "volumeMl": 500,
      "edition": "1915（67度礼盒装）",
      "source": "https://www.hslbgjq.com/oderCenter/21.cshtml",
      "priceSource": "https://www.hslbgjq.com/oderCenter/21.cshtml",
      "priceUpdated": "2026-09-07",
      "priceBasis": "listing"
    },
    {
      "id": "xifeng",
      "name": "西凤酒 六年陈酿凤香型52度",
      "brand": "西凤",
      "aroma": "凤香",
      "abv": 52,
      "price": 150,
      "priceTier": "中端",
      "taste": [
        "凤香",
        "醇香",
        "甘润",
        "略带清浓兼具"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "自饮"
      ],
      "beginner": 4,
      "region": "陕西宝鸡",
      "highlight": "四大名酒之一，凤香型独树一帜，性价比高",
      "caution": "凤香型认知度低，送礼不占优",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "dongjiu",
      "name": "董酒 密钥1957 54度",
      "brand": "董酒",
      "aroma": "其他",
      "abv": 54,
      "price": 400,
      "priceTier": "中端",
      "taste": [
        "董香",
        "药香",
        "独特",
        "复杂"
      ],
      "scene": [
        "自饮",
        "收藏"
      ],
      "beginner": 1,
      "region": "贵州遵义",
      "highlight": "董香型孤品，带百草药香，风味极独特",
      "caution": "药香味小众，新手大概率喝不惯",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "kouzijiao",
      "name": "口子窖 10年兼香型50度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 50,
      "price": 180,
      "priceTier": "中端",
      "taste": [
        "兼香",
        "醇和",
        "协调",
        "柔顺"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "安徽淮北",
      "highlight": "兼香型代表，浓酱兼具，接受面广",
      "caution": "兼香派没有鲜明记忆点，喜欢个性风味的略平",
      "volumeMl": 500,
      "edition": "十年型（50度）",
      "source": "https://product.suning.com/0070854614/12114038638.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "baiyunbian",
      "name": "白云边 15年陈酿兼香型42度",
      "brand": "白云边",
      "aroma": "兼香",
      "abv": 42,
      "price": 170,
      "priceTier": "中端",
      "taste": [
        "兼香",
        "绵柔",
        "协调",
        "低度顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "自饮"
      ],
      "beginner": 4,
      "region": "湖北松滋",
      "highlight": "兼香型口粮口碑款，湖北名酒",
      "caution": "区域性强，外地认知度低",
      "volumeMl": 500,
      "edition": null,
      "source": "https://byb.hbbyb.com/index.php?read-32.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guijiao",
      "name": "桂林 三花酒米香型52度",
      "brand": "桂林三花",
      "aroma": "米香",
      "abv": 52,
      "price": 80,
      "priceTier": "口粮",
      "taste": [
        "米香",
        "清雅",
        "蜜香",
        "柔和"
      ],
      "scene": [
        "自饮",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "广西桂林",
      "highlight": "米香型代表，蜜香清雅，南方特色",
      "caution": "米香型小众，喜欢厚重口感的人会觉得淡",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "shuijingfang",
      "name": "水井坊 臻酿八号52度",
      "brand": "水井坊",
      "aroma": "浓香",
      "abv": 52,
      "price": 320,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "绵甜",
        "净爽",
        "柔和"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "四川成都",
      "highlight": "高端品牌下沉款，包装精致适合送礼",
      "caution": "品牌溢价，纯论酒质性价比一般",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "tuopai",
      "name": "沱牌 舍得智慧舍得52度",
      "brand": "舍得",
      "aroma": "浓香",
      "abv": 52,
      "price": 500,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "陈香",
        "绵柔",
        "老酒感"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 4,
      "region": "四川射洪",
      "highlight": "主打老酒比例，陈香明显",
      "caution": "营销偏文化牌，按需选择",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tuopaishede.cn/productInfo_1.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "langpai-tianbao",
      "name": "郎牌特曲 T9 50度",
      "brand": "郎酒",
      "aroma": "浓香",
      "abv": 50,
      "price": 200,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "甘冽",
        "协调",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "四川古蔺",
      "highlight": "郎酒浓香线，中端宴请口粮",
      "caution": "和郎酒酱香线别混淆",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "fenjiu-bofen",
      "name": "汾酒 玻汾 53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 60,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "干净",
        "纯粮",
        "爽净"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "清香型日常选项，包装朴素，口感偏爽净",
      "caution": "53度酒精度较高，口感清爽不代表刺激小；送礼需考虑包装。与黄盖玻汾53度疑似同款，条码及版本映射待核实，不宜当作两个独立产品比较。",
      "volumeMl": 475,
      "edition": "玻瓶装（非献礼版）",
      "source": "https://www.fenjiu.com.cn/gf/bofen/2023-05-19/3904.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "gujing-xiaoban",
      "name": "古井贡 小罍子淡雅50度",
      "brand": "古井贡",
      "aroma": "浓香",
      "abv": 50,
      "price": 90,
      "priceTier": "口粮",
      "taste": [
        "淡雅浓香",
        "顺口",
        "清爽",
        "易饮"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "安徽亳州",
      "highlight": "小瓶装淡雅浓香，自饮口粮",
      "caution": "酒体偏淡，重口味不满足",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinsanjiao",
      "name": "今世缘 国缘四开42度",
      "brand": "今世缘",
      "aroma": "浓香",
      "abv": 42,
      "price": 400,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "协调",
        "低度顺口"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 4,
      "region": "江苏",
      "highlight": "苏酒代表，喜宴商务场景强",
      "caution": "江苏地区强势，外省认知一般",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.jinshiyuan.com.cn/display.php?id=176",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-yingbin",
      "name": "茅台 迎宾酒53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 120,
      "priceTier": "口粮",
      "taste": [
        "酱香",
        "协调",
        "入门酱味",
        "略糙"
      ],
      "scene": [
        "自饮",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "贵州茅台镇",
      "highlight": "茅台嫡系入门酱香，百元尝酱味的正规选择",
      "caution": "酒质与飞天差距大，别期待茅台味",
      "volumeMl": 500,
      "edition": null,
      "source": "https://product.suning.com/0030000757/191188718.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-prince-jin",
      "name": "茅台 王子酒（金王子）53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "醇和",
        "入口较顺"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "贵州茅台镇",
      "highlight": "茅台嫡系中端入门，品牌认知强，适合尝酱香",
      "caution": "和飞天差距很大，不要按高端茅台期待",
      "volumeMl": 500,
      "edition": "金王子",
      "source": "https://www.moutai.com.cn/mtgf/2023-11/01/article_2023110117071059890.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-prince-zhenpin",
      "name": "茅台 珍品王子53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "陈香",
        "醇厚",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "王子系列里更体面的酱香选择，酒体比普通王子更完整",
      "caution": "价格高于普通王子，自饮看预算",
      "volumeMl": 500,
      "edition": "珍品王子",
      "source": "https://product.suning.com/0030000757/10446378347.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-hanjiang",
      "name": "茅台 汉酱51度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 51,
      "price": 420,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "柔和",
        "焦香",
        "回甘"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 4,
      "region": "贵州茅台镇",
      "highlight": "茅台嫡系柔和酱香，51度更好入口",
      "caution": "酱香浓度不如高度重口款，老酱客可能觉得轻",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.moutai.com.cn/mtgf/2023-11/01/article_2023110117071031095.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-1935",
      "name": "茅台 1935 53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 1100,
      "priceTier": "高端",
      "taste": [
        "酱香",
        "细腻",
        "醇厚",
        "回味长"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "茅台嫡系千元档，送礼识别度高",
      "caution": "品牌溢价明显，价格波动需关注",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.moutai.com.cn/mtgf/2023-11/01/article_2023110117095122594.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "laimao-chuancheng-lan",
      "name": "赖茅 传承蓝53度",
      "brand": "赖茅",
      "aroma": "酱香",
      "abv": 53,
      "price": 380,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "醇和",
        "焦香",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "茅台体系下的酱香品牌，中端宴请比较稳",
      "caution": "赖茅系列较多，注意区分传承蓝/棕等版本",
      "volumeMl": 500,
      "edition": "传承蓝",
      "source": "https://www.laymauchina.com/products/743.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xijiu-jinzhi",
      "name": "习酒 金质53度",
      "brand": "习酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "柔和",
        "协调",
        "略甜"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "贵州习水",
      "highlight": "习酒入门到中端过渡款，适合酱香新手",
      "caution": "档次不适合正式商务送礼",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xijiu-jiaocang1998",
      "name": "习酒 窖藏1998 53度",
      "brand": "习酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "醇和",
        "细腻",
        "回甘"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "贵州习水",
      "highlight": "习酒窖藏系列中端款，品质稳定，宴请不突兀",
      "caution": "品牌力低于1988，送礼预算够可上更高档",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "langjiu-honghualang10",
      "name": "郎酒 红花郎10 53度",
      "brand": "郎酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 420,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "醇和",
        "回味"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "四川古蔺",
      "highlight": "红花郎入门主力，品牌和包装都比较体面",
      "caution": "酱味明显，新手建议小杯慢饮",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.langjiu.cn/product?categoryId=6",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "langpai-langjiu",
      "name": "郎牌郎酒53度",
      "brand": "郎酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 280,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "醇和",
        "焦香",
        "略冲"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川古蔺",
      "highlight": "郎酒基础酱香代表，价格比红花郎更友好",
      "caution": "包装和场面感一般，送礼不如红花郎",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.langjiu.cn/product?categoryId=6",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinsha-huisha-wuxing",
      "name": "金沙回沙 五星53度",
      "brand": "金沙",
      "aroma": "酱香",
      "abv": 53,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "醇厚",
        "略甜"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "贵州金沙",
      "highlight": "贵州金沙产区性价比酱香，适合自饮尝鲜",
      "caution": "品牌认知偏区域，商务送礼弱一些",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinsha-huisha-zuanshi",
      "name": "金沙回沙 钻石五星53度",
      "brand": "金沙",
      "aroma": "酱香",
      "abv": 53,
      "price": 180,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "顺口",
        "酒体中等"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "贵州金沙",
      "highlight": "两百元内尝贵州酱香的实用款",
      "caution": "酒体厚度有限，别按高端酱香期待",
      "volumeMl": 500,
      "edition": "钻石五星",
      "source": "https://www.jinshajiuye.com/jshs_1/5.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "zhenjiu-laozhenjiu",
      "name": "珍酒 老珍酒53度",
      "brand": "珍酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 160,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "略冲",
        "回甘"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "贵州遵义",
      "highlight": "珍酒基础口碑款，酱香入门性价比高",
      "caution": "包装普通，正式送礼不占优",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.gzzjc.cn/product/info/lzj",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "zhenjiu-zhen15",
      "name": "珍酒 珍十五53度",
      "brand": "珍酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "醇厚",
        "陈香",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州遵义",
      "highlight": "珍酒中端代表，酒体和包装都比较均衡",
      "caution": "区域认知不如茅习郎，送礼看对象",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.gzzjc.cn/product/info/z15",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "zhenjiu-zhen30",
      "name": "珍酒 珍三十53度",
      "brand": "珍酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 850,
      "priceTier": "高端",
      "taste": [
        "酱香浓郁",
        "陈香",
        "醇厚",
        "回味长"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 2,
      "region": "贵州遵义",
      "highlight": "珍酒高端线，适合懂酱香的人",
      "caution": "品牌面子弱于同价位头部名酒",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.gzzjc.cn/product/info/z30",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guotai-15",
      "name": "国台 十五年53度",
      "brand": "国台",
      "aroma": "酱香",
      "abv": 53,
      "price": 650,
      "priceTier": "高端",
      "taste": [
        "酱香",
        "醇厚",
        "陈香",
        "协调"
      ],
      "scene": [
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "国台高端线，茅台镇风格明显",
      "caution": "品牌溢价存在，收藏属性有限",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "diaoyutai-guobin",
      "name": "钓鱼台 国宾酒53度",
      "brand": "钓鱼台",
      "aroma": "酱香",
      "abv": 53,
      "price": 650,
      "priceTier": "高端",
      "taste": [
        "酱香",
        "醇厚",
        "细腻",
        "回味"
      ],
      "scene": [
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州茅台镇",
      "highlight": "名字和包装有商务辨识度，宴请送礼体面",
      "caution": "版本多且价格波动，注意渠道",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "wuling-hupo",
      "name": "武陵酒 琥珀53度",
      "brand": "武陵",
      "aroma": "酱香",
      "abv": 53,
      "price": 420,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "幽雅",
        "柔和",
        "回甘"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "湖南常德",
      "highlight": "湖南名酒，酱香风格相对柔和细腻",
      "caution": "全国认知度有限，送礼偏小众",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "tanjiu-jinjiang",
      "name": "潭酒 金酱53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 220,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "焦香",
        "醇和",
        "略烈"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川古蔺",
      "highlight": "川派酱香性价比款，自饮尝鲜不错",
      "caution": "品牌名气一般，商务属性弱",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/tanjinjiang.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yunmen-chenniang",
      "name": "云门陈酿 53度",
      "brand": "云门",
      "aroma": "酱香",
      "abv": 53,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "酱香",
        "柔和",
        "陈香",
        "协调"
      ],
      "scene": [
        "自饮",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "山东青州",
      "highlight": "北方酱香代表，风格柔和，区域特色明显",
      "caution": "非主流产区，送礼认知度有限",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "wuliangchun-50",
      "name": "五粮春 50度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 50,
      "price": 230,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "绵甜",
        "协调",
        "净爽"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "四川宜宾",
      "highlight": "五粮液嫡系中端浓香，品牌背书强",
      "caution": "和普五档次差距明显，别买高价",
      "volumeMl": null,
      "edition": "第一代",
      "source": "https://www.wuliangnongxiang.com/product/proPage.html?id=1",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "wuliangye-tequ",
      "name": "五粮液 特曲52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 330,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "甘冽",
        "协调",
        "窖香"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 4,
      "region": "四川宜宾",
      "highlight": "五粮液系列酒中比较体面的中端选择",
      "caution": "系列酒多，注意不要和贴牌混淆",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jianzhuang-gaoguang",
      "name": "尖庄 高光52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 80,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "粮香",
        "净爽",
        "略冲"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "四川宜宾",
      "highlight": "五粮液低价口粮线，纯粮感和性价比不错",
      "caution": "包装朴素，不适合送礼宴请",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "luzhou-tequ",
      "name": "泸州老窖 特曲52度",
      "brand": "泸州老窖",
      "aroma": "浓香",
      "abv": 52,
      "price": 320,
      "priceTier": "中端",
      "taste": [
        "窖香",
        "浓香",
        "绵甜",
        "净爽"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "四川泸州",
      "highlight": "老牌浓香名酒，中端宴请稳妥",
      "caution": "注意区分特曲、头曲、二曲和开发品",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "luzhou-touqu",
      "name": "泸州老窖 头曲52度",
      "brand": "泸州老窖",
      "aroma": "浓香",
      "abv": 52,
      "price": 110,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "窖香",
        "甘甜",
        "简单"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "四川泸州",
      "highlight": "百元左右老牌浓香口粮，接受度高",
      "caution": "档次普通，正式宴请建议上特曲以上",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "luzhou-liunianjiao",
      "name": "泸州老窖 六年窖头曲52度",
      "brand": "泸州老窖",
      "aroma": "浓香",
      "abv": 52,
      "price": 180,
      "priceTier": "中端",
      "taste": [
        "窖香",
        "绵甜",
        "顺口",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "四川泸州",
      "highlight": "比普通头曲更体面，家宴朋友局合适",
      "caution": "品牌线复杂，避免买到非核心开发酒",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.lzlj.com/brand/touqu/3784.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yanghe-tianzhilan",
      "name": "洋河 天之蓝52度",
      "brand": "洋河",
      "aroma": "浓香",
      "abv": 52,
      "price": 300,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "顺滑",
        "低刺激"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 5,
      "region": "江苏宿迁",
      "highlight": "洋河中端主力，绵柔好入口，江苏宴请常见",
      "caution": "追求浓烈窖香的人可能觉得柔弱",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yanghe-mengzhilan-m3",
      "name": "洋河 梦之蓝M3水晶版52度",
      "brand": "洋河",
      "aroma": "浓香",
      "abv": 52,
      "price": 480,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "协调",
        "顺滑"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 4,
      "region": "江苏宿迁",
      "highlight": "梦之蓝入门商务款，包装和品牌都够用",
      "caution": "价格接近更强品牌时需比较性价比",
      "volumeMl": 550,
      "edition": "水晶版",
      "source": "https://www.chinayanghe.com/product/yanghe/lsjdxl/12.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "gujing-gu16",
      "name": "古井贡酒 年份原浆古16 50度",
      "brand": "古井贡",
      "aroma": "浓香",
      "abv": 50,
      "price": 450,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "幽雅",
        "绵甜",
        "协调"
      ],
      "scene": [
        "商务宴请",
        "家庭聚餐",
        "送礼"
      ],
      "beginner": 4,
      "region": "安徽亳州",
      "highlight": "徽酒中高端主力，安徽宴请很有面子",
      "caution": "外省认知略弱于全国名酒",
      "volumeMl": 500,
      "edition": null,
      "source": "https://detail.youzan.com/show/goods?alias=2ogkrofpzatk5x2&from_source=gbox_seo",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "gujing-gu20",
      "name": "古井贡酒 年份原浆古20 52度",
      "brand": "古井贡",
      "aroma": "浓香",
      "abv": 52,
      "price": 700,
      "priceTier": "高端",
      "taste": [
        "浓香",
        "绵甜",
        "陈香",
        "细腻"
      ],
      "scene": [
        "商务宴请",
        "送礼"
      ],
      "beginner": 4,
      "region": "安徽亳州",
      "highlight": "古井贡高端宴请款，徽酒场面担当",
      "caution": "高端价位全国流通面子不如茅五泸",
      "volumeMl": 500,
      "edition": null,
      "source": "https://detail.youzan.com/show/goods?alias=1ybjbk2kb6uo5ad&from_source=gbox_seo",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "kouzijiao-20",
      "name": "口子窖 20年兼香型50度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 50,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "兼香",
        "醇厚",
        "协调",
        "回味"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 4,
      "region": "安徽淮北",
      "highlight": "口子窖更高档兼香，浓酱协调，宴请稳",
      "caution": "兼香型辨识度不如酱/浓，送礼看地区",
      "volumeMl": 500,
      "edition": "二十年型（50度）",
      "source": "https://www.kouzi.com/index.php?c=show&id=5835",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "shuijingfang-jingtai",
      "name": "水井坊 井台52度",
      "brand": "水井坊",
      "aroma": "浓香",
      "abv": 52,
      "price": 520,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "绵甜",
        "净爽",
        "柔和"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "四川成都",
      "highlight": "包装精致、品牌高端感强，送礼商务好看",
      "caution": "品牌溢价较高，酒质性价比不是最优",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "shede-pinwei",
      "name": "舍得 品味舍得52度",
      "brand": "舍得",
      "aroma": "浓香",
      "abv": 52,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "陈香",
        "绵柔",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 4,
      "region": "四川射洪",
      "highlight": "舍得核心中端款，老酒感和包装都比较均衡",
      "caution": "老酒概念有营销成分，按口感和价格判断",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tuopaishede.cn/productInfo_2.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "tuopai-t68",
      "name": "沱牌 特级T68 50度",
      "brand": "沱牌",
      "aroma": "浓香",
      "abv": 50,
      "price": 90,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "粮香",
        "顺口",
        "净爽"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "四川射洪",
      "highlight": "川酒口粮性价比款，适合日常自饮",
      "caution": "品牌场面感弱，不适合正式送礼",
      "volumeMl": 480,
      "edition": null,
      "source": "https://www.tuopaishede.cn/productInfo_39.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jiannanchun-k6",
      "name": "剑南春 金剑南K6 52度",
      "brand": "剑南春",
      "aroma": "浓香",
      "abv": 52,
      "price": 160,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "甘甜",
        "爽净",
        "协调"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "四川绵竹",
      "highlight": "剑南春百元级系列，朋友局和家宴都稳",
      "caution": "品牌力和酒质低于水晶剑，别高价买",
      "volumeMl": 500,
      "edition": null,
      "source": "https://product.suning.com/0030001198/12431667818.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "quanxing-daqu",
      "name": "全兴大曲 晶彩52度",
      "brand": "全兴",
      "aroma": "浓香",
      "abv": 52,
      "price": 120,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "甘冽",
        "爽净",
        "略冲"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "四川成都",
      "highlight": "老八大名酒血统，百元浓香性价比不错",
      "caution": "现在品牌声量弱，送礼认知有限",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "shuanggou-shengfang",
      "name": "双沟 珍宝坊圣坊42度",
      "brand": "双沟",
      "aroma": "浓香",
      "abv": 42,
      "price": 180,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "低度",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 5,
      "region": "江苏宿迁",
      "highlight": "低度绵柔，江苏宴席常见，新手友好",
      "caution": "低度酒体偏轻，老酒客可能觉得不过瘾",
      "volumeMl": 500,
      "edition": "21版（主瓶500mL，另附20mL小瓶）",
      "source": "https://www.chinayanghe.com/product/shuanggou/sgzbfxl/47.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinshiyuan-guoyuan-duikai",
      "name": "今世缘 国缘对开42度",
      "brand": "今世缘",
      "aroma": "浓香",
      "abv": 42,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "甜润",
        "协调",
        "低刺激"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 5,
      "region": "江苏淮安",
      "highlight": "苏酒宴请常见款，低度好入口，包装体面",
      "caution": "区域品牌强，外省送礼识别度一般",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.jinshiyuan.com.cn/display.php?id=175",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jinshiyuan-guoyuan-v3",
      "name": "今世缘 国缘V3 40.9度",
      "brand": "今世缘",
      "aroma": "浓香",
      "abv": 40.9,
      "price": 520,
      "priceTier": "中端",
      "taste": [
        "绵柔",
        "细腻",
        "甜润",
        "低度顺口"
      ],
      "scene": [
        "商务宴请",
        "送礼"
      ],
      "beginner": 5,
      "region": "江苏淮安",
      "highlight": "国缘商务线，江苏场景很能打",
      "caution": "外省高价购买需考虑认知度",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.jinshiyuan.com.cn/display.php?id=2321",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yilite-qu",
      "name": "伊力特 曲酒52度",
      "brand": "伊力特",
      "aroma": "浓香",
      "abv": 52,
      "price": 90,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "甘冽",
        "爽净",
        "有劲"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "新疆伊犁",
      "highlight": "新疆名酒，口粮价格，风格爽净有劲",
      "caution": "区域性强，商务送礼不合适",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "songhe-liangye",
      "name": "宋河粮液 秘藏5号50度",
      "brand": "宋河",
      "aroma": "浓香",
      "abv": 50,
      "price": 120,
      "priceTier": "口粮",
      "taste": [
        "浓香",
        "绵甜",
        "协调",
        "净爽"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "河南鹿邑",
      "highlight": "河南名酒代表，百元家宴口粮",
      "caution": "品牌全国声量一般，送礼偏区域",
      "volumeMl": 480,
      "edition": null,
      "source": "https://www.tjkx.com/zt/product/1678",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "dukang-jiuzu",
      "name": "杜康 酒祖窖藏6 52度",
      "brand": "杜康",
      "aroma": "浓香",
      "abv": 52,
      "price": 150,
      "priceTier": "中端",
      "taste": [
        "浓香",
        "粮香",
        "醇和",
        "顺口"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "河南洛阳",
      "highlight": "杜康文化辨识度高，家宴朋友局不突兀",
      "caution": "品牌体系复杂，注意买核心产品",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "fenjiu-huanggaibofen",
      "name": "汾酒 黄盖玻汾53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 55,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "干净",
        "爽冽",
        "纯粮"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "清香口粮标杆，便宜、干净、适合长期自饮",
      "caution": "包装太朴素，送礼宴请不够看。与玻汾53度疑似同款，条码及版本映射待核实，不宜当作两个独立产品比较。",
      "volumeMl": 475,
      "edition": null,
      "source": "https://www.suning.com/item/0000000000/612856581.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "fenjiu-laobaifen10",
      "name": "汾酒 老白汾10 53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 150,
      "priceTier": "中端",
      "taste": [
        "清香",
        "醇和",
        "净爽",
        "回甘"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "自饮"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "清香中端口粮，干净好入口，比玻汾更体面",
      "caution": "喜欢浓郁窖香的人会觉得淡",
      "volumeMl": 475,
      "edition": null,
      "source": "https://www.fenjiu.com.cn/gf/baifen/2023-02-08/995.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "fenjiu-laobaifen15",
      "name": "汾酒 老白汾15 53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 220,
      "priceTier": "中端",
      "taste": [
        "清香",
        "醇厚",
        "净爽",
        "绵柔"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "山西杏花村",
      "highlight": "老白汾升级款，清香干净且有一定厚度",
      "caution": "商务场面不如青花系列",
      "volumeMl": 475,
      "edition": "封坛15（53度）",
      "source": "https://www.fenjiu.com.cn/gf/baifen/2023-05-19/3900.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "baofeng-daqu",
      "name": "宝丰 大曲50度",
      "brand": "宝丰",
      "aroma": "清香",
      "abv": 50,
      "price": 80,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "净爽",
        "柔和",
        "粮香"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "河南宝丰",
      "highlight": "十七大名酒之一，清香口粮性价比高",
      "caution": "品牌认知较低，送礼不占优",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "baofeng-guose",
      "name": "宝丰 国色清香陈坛35 50度",
      "brand": "宝丰",
      "aroma": "清香",
      "abv": 50,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "清香",
        "陈香",
        "柔和",
        "净爽"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 5,
      "region": "河南宝丰",
      "highlight": "宝丰中端清香，适合想避开汾酒主流的人",
      "caution": "区域性强，高端商务识别度有限",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.hnbfjy.com/html/product/product2/guoseqingxiang/22.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "hongxing-lan8",
      "name": "红星 蓝瓶二锅头43度",
      "brand": "红星",
      "aroma": "清香",
      "abv": 43,
      "price": 35,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "爽净",
        "低价",
        "略烈"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "北京",
      "highlight": "便宜耐喝的京味口粮，低预算首选之一",
      "caution": "口感简单，别用于正式宴请",
      "volumeMl": 750,
      "edition": null,
      "source": "https://product.suning.com/0030000752/12345603407.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xifeng-lvbo",
      "name": "西凤酒 绿瓶55度",
      "brand": "西凤",
      "aroma": "凤香",
      "abv": 55,
      "price": 55,
      "priceTier": "口粮",
      "taste": [
        "凤香",
        "爽净",
        "有劲",
        "挺拔"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "陕西宝鸡",
      "highlight": "凤香型低价代表，个性鲜明，老酒客口粮",
      "caution": "55度有劲，新手慎重",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.sxxfj.com/content/details32_490.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xifeng-huashan10",
      "name": "西凤 华山论剑10年52度",
      "brand": "西凤",
      "aroma": "凤香",
      "abv": 52,
      "price": 180,
      "priceTier": "中端",
      "taste": [
        "凤香",
        "醇和",
        "甘润",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "陕西宝鸡",
      "highlight": "凤香中端宴请款，陕西场景尤其合适",
      "caution": "全国送礼认知不如浓香头部品牌",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.suning.com/item/0000000000/104949989.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "xifeng-huashan20",
      "name": "西凤 华山论剑20年52度",
      "brand": "西凤",
      "aroma": "凤香",
      "abv": 52,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "凤香",
        "陈香",
        "醇厚",
        "甘润"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "陕西宝鸡",
      "highlight": "西凤中高端代表，包装体面，风格有辨识度",
      "caution": "凤香小众，送外地长辈前最好确认接受度",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.sxxfj.com/content/details106_6302.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "hongxifeng",
      "name": "红西凤 52度",
      "brand": "西凤",
      "aroma": "凤香",
      "abv": 52,
      "price": 850,
      "priceTier": "高端",
      "taste": [
        "凤香",
        "醇厚",
        "陈香",
        "回味长"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 3,
      "region": "陕西宝鸡",
      "highlight": "西凤高端旗舰之一，凤香爱好者的体面选择",
      "caution": "高价小众香型，非凤香受众慎送",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.sxxfj.com/content/details19_98.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jiujiang-shuangzheng",
      "name": "九江双蒸 29.5度",
      "brand": "九江双蒸",
      "aroma": "米香",
      "abv": 29.5,
      "price": 35,
      "priceTier": "口粮",
      "taste": [
        "米香",
        "清甜",
        "低度",
        "柔和"
      ],
      "scene": [
        "自饮",
        "家庭聚餐"
      ],
      "beginner": 5,
      "region": "广东佛山",
      "highlight": "广东米香低度代表，入口轻松，适合配餐",
      "caution": "度数低且风味轻，重口味白酒爱好者会嫌淡",
      "volumeMl": 610,
      "edition": null,
      "source": "https://www.heshan.gov.cn/zwgk/zdlyxxgk/spypanxxgk/aqjggzxx/content/post_2598156.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yubingshao",
      "name": "石湾玉冰烧 30度",
      "brand": "石湾玉冰烧",
      "aroma": "米香",
      "abv": 30,
      "price": 45,
      "priceTier": "口粮",
      "taste": [
        "米香",
        "豉香",
        "柔和",
        "清甜"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "广东佛山",
      "highlight": "豉香/米香特色鲜明，低度好入口，南方配餐友好",
      "caution": "风味和传统高度白酒差异大，送礼需看地域",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guilin-sanhua-lao",
      "name": "桂林三花 老桂林52度",
      "brand": "桂林三花",
      "aroma": "米香",
      "abv": 52,
      "price": 120,
      "priceTier": "口粮",
      "taste": [
        "米香",
        "蜜香",
        "清雅",
        "绵柔"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 4,
      "region": "广西桂林",
      "highlight": "米香型升级口粮，蜜香清雅，地方特色强",
      "caution": "米香型普遍偏轻，商务送礼场面弱",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "baiyunbian-12",
      "name": "白云边 12年陈酿42度",
      "brand": "白云边",
      "aroma": "兼香",
      "abv": 42,
      "price": 130,
      "priceTier": "口粮",
      "taste": [
        "兼香",
        "绵柔",
        "协调",
        "低度"
      ],
      "scene": [
        "自饮",
        "家庭聚餐",
        "朋友小聚"
      ],
      "beginner": 5,
      "region": "湖北松滋",
      "highlight": "湖北兼香口粮，低度顺口，家宴实用",
      "caution": "区域品牌，外省送礼不强",
      "volumeMl": 500,
      "edition": null,
      "source": "https://byb.hbbyb.com/index.php?read-33.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "baiyunbian-20",
      "name": "白云边 20年陈酿53度",
      "brand": "白云边",
      "aroma": "兼香",
      "abv": 53,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "兼香",
        "醇厚",
        "酱浓协调",
        "回味"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "湖北松滋",
      "highlight": "白云边中高端代表，兼香风格更饱满",
      "caution": "非湖北场景识别度一般",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "yangshao-tianbao",
      "name": "仰韶 彩陶坊天时46度",
      "brand": "仰韶",
      "aroma": "其他",
      "abv": 46,
      "price": 500,
      "priceTier": "中端",
      "taste": [
        "陶香",
        "绵柔",
        "复合香",
        "协调"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "河南渑池",
      "highlight": "陶香型代表，包装有特色，河南商务宴请常见",
      "caution": "陶香型小众，外省认知有限",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "dongjiu-guomi",
      "name": "董酒 国密54度",
      "brand": "董酒",
      "aroma": "其他",
      "abv": 54,
      "price": 650,
      "priceTier": "高端",
      "taste": [
        "董香",
        "药香",
        "复杂",
        "醇厚"
      ],
      "scene": [
        "收藏",
        "商务宴请",
        "送礼"
      ],
      "beginner": 1,
      "region": "贵州遵义",
      "highlight": "董香高端代表，风味独特，适合懂酒玩家",
      "caution": "药香非常小众，不建议盲送新手",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.chinadongjiu.com/products/380.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "dongjiu-baicao",
      "name": "董酒 佰草香54度",
      "brand": "董酒",
      "aroma": "其他",
      "abv": 54,
      "price": 220,
      "priceTier": "中端",
      "taste": [
        "董香",
        "药香",
        "辛香",
        "独特"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "收藏"
      ],
      "beginner": 1,
      "region": "贵州遵义",
      "highlight": "用较低预算体验董香药香风格",
      "caution": "风味门槛高，喝不惯的人会觉得怪",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.chinadongjiu.com/products/17.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jiuguijiu-huangtan",
      "name": "酒鬼酒 黄坛52度",
      "brand": "酒鬼酒",
      "aroma": "其他",
      "abv": 52,
      "price": 320,
      "priceTier": "中端",
      "taste": [
        "馥郁香",
        "复合香",
        "甜润",
        "回味"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 3,
      "region": "湖南吉首",
      "highlight": "馥郁香代表，浓清酱兼有，风味有记忆点",
      "caution": "香型独特，新手接受度因人而异",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jiuguijiu-neican",
      "name": "酒鬼酒 内参52度",
      "brand": "酒鬼酒",
      "aroma": "其他",
      "abv": 52,
      "price": 850,
      "priceTier": "高端",
      "taste": [
        "馥郁香",
        "陈香",
        "醇厚",
        "复杂"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 2,
      "region": "湖南吉首",
      "highlight": "馥郁香高端代表，适合想送特别一点的人",
      "caution": "高价小众香型，送礼前确认对方能接受",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.cofco.com/cn/IndexFirst/2021/0831/50749.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "site-dongfangyun",
      "name": "四特酒 东方韵弘韵52度",
      "brand": "四特",
      "aroma": "其他",
      "abv": 52,
      "price": 260,
      "priceTier": "中端",
      "taste": [
        "特香",
        "粮香",
        "净爽",
        "协调"
      ],
      "scene": [
        "家庭聚餐",
        "朋友小聚",
        "商务宴请"
      ],
      "beginner": 4,
      "region": "江西樟树",
      "highlight": "特香型代表，江西名酒，风格清爽有特色",
      "caution": "区域品牌，外省送礼认知一般",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.sitejiu.com/front/show/48868e727b9244f3b29a7f0c21ee5188.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "jingzhi-yipin",
      "name": "景芝 一品景芝52度",
      "brand": "景芝",
      "aroma": "其他",
      "abv": 52,
      "price": 360,
      "priceTier": "中端",
      "taste": [
        "芝麻香",
        "焦香",
        "复合香",
        "醇厚"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山东安丘",
      "highlight": "芝麻香代表，山东特色鲜明，风味有辨识度",
      "caution": "芝麻香小众，送礼看地域和口味",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "hengshui-gufa20",
      "name": "衡水老白干 古法二十67度",
      "brand": "老白干",
      "aroma": "其他",
      "abv": 67,
      "price": 650,
      "priceTier": "高端",
      "taste": [
        "老白干香",
        "高度",
        "醇厚",
        "净爽"
      ],
      "scene": [
        "自饮",
        "收藏",
        "商务宴请"
      ],
      "beginner": 1,
      "region": "河北衡水",
      "highlight": "老白干高端代表，67度极具冲击力",
      "caution": "高度烈酒，非老酒客慎入",
      "volumeMl": 500,
      "edition": null,
      "source": "https://product.suning.com/0000000000/12201567125.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "kouzi-xiaochi",
      "name": "口子窖 小池窖40.8度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 40.8,
      "price": 90,
      "priceTier": "口粮",
      "taste": [
        "兼香",
        "低度",
        "柔和",
        "顺口"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 5,
      "region": "安徽淮北",
      "highlight": "低度兼香口粮，新手和家宴都友好",
      "caution": "酒体偏轻，老酒客可能嫌淡",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "qingke-huzhu",
      "name": "天佑德 青稞酒52度",
      "brand": "天佑德",
      "aroma": "清香",
      "abv": 52,
      "price": 130,
      "priceTier": "口粮",
      "taste": [
        "清香",
        "青稞香",
        "爽净",
        "略甜"
      ],
      "scene": [
        "自饮",
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 4,
      "region": "青海互助",
      "highlight": "青稞酒代表，清爽有地方特色",
      "caution": "香气与传统高粱酒不同，商务送礼偏小众",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-jingpin",
      "name": "贵州茅台 精品53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 3300,
      "priceTier": "超高端",
      "taste": [
        "酱香浓郁",
        "陈香",
        "醇厚",
        "回味悠长"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 2,
      "region": "贵州茅台镇",
      "highlight": "飞天之上的茅台嫡系高端款，礼赠和收藏属性强",
      "caution": "价格高且行情波动大，必须正规渠道购买",
      "volumeMl": 500,
      "edition": "精品",
      "source": "https://www.moutai.com.cn/mtgf/2023-10/31/article_2023103117411293830.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "maotai-shengxiao",
      "name": "贵州茅台 生肖酒53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 3500,
      "priceTier": "超高端",
      "taste": [
        "酱香",
        "醇厚",
        "陈香",
        "纪念属性"
      ],
      "scene": [
        "送礼",
        "收藏",
        "商务宴请"
      ],
      "beginner": 2,
      "region": "贵州茅台镇",
      "highlight": "兼具茅台品牌与生肖纪念属性，适合重礼和收藏",
      "caution": "收藏溢价明显，饮用性价比低，年份生肖价格差异大",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "wuliangye-jingdian",
      "name": "五粮液 经典五粮液52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 2000,
      "priceTier": "超高端",
      "taste": [
        "浓香",
        "陈香",
        "绵甜",
        "层次丰富"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 3,
      "region": "四川宜宾",
      "highlight": "五粮液高端形象款，浓香超高端送礼选择",
      "caution": "价格明显高于普五，重视性价比可选普五",
      "volumeMl": null,
      "edition": null,
      "source": null,
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "guojiao1573-zhongguo-pinwei",
      "name": "国窖1573 中国品味52度",
      "brand": "泸州老窖",
      "aroma": "浓香",
      "abv": 52,
      "price": 1800,
      "priceTier": "超高端",
      "taste": [
        "窖香浓郁",
        "陈香",
        "绵甜",
        "厚重"
      ],
      "scene": [
        "商务宴请",
        "送礼",
        "收藏"
      ],
      "beginner": 3,
      "region": "四川泸州",
      "highlight": "国窖1573高端线，浓香超高端宴请送礼有场面",
      "caution": "高端浓香溢价明显，购买前比价并确认版本",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.lzlj.com/brand/1573/3748.html",
      "priceSource": null,
      "priceUpdated": null,
      "priceBasis": "estimate"
    },
    {
      "id": "tanjiu-zitan-53",
      "name": "潭酒 紫潭53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 668,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。价格为本日观察到的厂家指导价，不是成交价；未注明价格生效日期。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/zitan.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/htznf/zitan.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-hongtan-53",
      "name": "潭酒 红潭53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 318,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。仅记录观察到的指导价；不推断某生产年份或2022版。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/hongtan.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/htznf/hongtan.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-ziqidonglai-53",
      "name": "潭酒 紫气东来53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 1318,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。不同于紫潭的独立产品；价格不是实时报价或成交价。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/zqdl.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/htznf/zqdl.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-hongdefazi-53",
      "name": "潭酒 红得发紫53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 468,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。独立产品，不与红潭或紫潭归并；价格为本日观察的MSRP。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/hdfz.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/htznf/hdfz.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-yintan-53",
      "name": "潭酒 银潭53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 138,
      "priceTier": "口粮",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。价格为指导价，不声称当前实际成交价。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tanjiu.cn/htznf/yintan.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/htznf/yintan.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2014-53",
      "name": "年份潭酒2014 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 886,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。年份来自产品身份，不是报价日期；不据此宣称截至2026年持续桶陈12年。",
      "volumeMl": 500,
      "edition": "2014单一年份",
      "source": "https://www.tanjiu.cn/dyznf/nianfentan2014.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/nianfentan2014.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2016-53",
      "name": "年份潭酒2016 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 499,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。作为厂家单一年份产品区分，不按外包装年份重复计数；价格为MSRP。",
      "volumeMl": 500,
      "edition": "2016单一年份",
      "source": "https://www.tanjiu.cn/dyznf/nianfentan2016.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/nianfentan2016.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2018-53",
      "name": "年份潭酒2018 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 246,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。年份是厂家单一年份身份；指导价没有独立生效日期。",
      "volumeMl": 500,
      "edition": "2018单一年份",
      "source": "https://www.tanjiu.cn/dyznf/nianfentan2018.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/nianfentan2018.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2019-53",
      "name": "年份潭酒2019 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 166,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。记录页面实际观察的MSRP，不将2019当作价格更新时间。",
      "volumeMl": 500,
      "edition": "2019单一年份",
      "source": "https://www.tanjiu.cn/dyznf/556.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/556.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "langjiu-shunpin-lanshun-45",
      "name": "顺品郎 蓝顺45度",
      "brand": "郎酒",
      "aroma": "兼香",
      "abv": 45,
      "price": 77,
      "priceTier": "口粮",
      "taste": [
        "兼香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川泸州",
      "highlight": "45度、480mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用页面挂牌价，不代表实际结算价。京东公开推荐商品卡挂牌价，非厂家指导价；未核实商家、库存或结算价格。只采用蓝顺，不将酒体差异未确认的金盖装重复入库。",
      "volumeMl": 480,
      "edition": "蓝顺",
      "source": "https://weiste-api.langjiu.cn/api/goods/goodsDetail?goodsId=88",
      "priceBasis": "listing",
      "priceSource": "https://item.jd.com/product/lvtE-oSm_fKGfNtp2EWlAA.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "diaoyutai-guibin3-2026-53",
      "name": "钓鱼台 贵宾酒Ⅲ·2026 53度",
      "brand": "钓鱼台",
      "aroma": "酱香",
      "abv": 53,
      "price": 699,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。贵宾酒不是现有国宾酒；本组只选一个贵宾版本，不另计红色包装版。",
      "volumeMl": 500,
      "edition": "Ⅲ·2026",
      "source": "https://www.diaoyutaijiu.com/productinfo/288772.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.diaoyutaijiu.com/productinfo/288772.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "diaoyutai-zhenpin1-falang-53",
      "name": "钓鱼台 珍品一号酒珐琅彩53度",
      "brand": "钓鱼台",
      "aroma": "酱香",
      "abv": 53,
      "price": 1399,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。仅选珍品一号一个版本，没有同时新增粉彩或小酒版。",
      "volumeMl": 500,
      "edition": "珐琅彩",
      "source": "https://www.diaoyutaijiu.com/productinfo/978819.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.diaoyutaijiu.com/productinfo/978819.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "diaoyutai-shougong-huang-53",
      "name": "钓鱼台 手工酿艺酒黄53度",
      "brand": "钓鱼台",
      "aroma": "酱香",
      "abv": 53,
      "price": 1299,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。本组仅选黄版，不把蓝版、皮盒版一起计为新增。",
      "volumeMl": 500,
      "edition": "黄",
      "source": "https://www.diaoyutaijiu.com/productinfo/1385729.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.diaoyutaijiu.com/productinfo/1385729.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "diaoyutai-jiangse-53",
      "name": "钓鱼台酒 酱色53度",
      "brand": "钓鱼台",
      "aroma": "酱香",
      "abv": 53,
      "price": 999,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。官网将其作为独立系列；价格为MSRP，不是观察到的零售成交价。",
      "volumeMl": 500,
      "edition": "酱色",
      "source": "https://www.diaoyutaijiu.com/productinfo/318171.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.diaoyutaijiu.com/productinfo/318171.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "wuliangchun-second-52",
      "name": "五粮春 第二代52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 358,
      "priceTier": "中端",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川宜宾",
      "highlight": "52度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。采用2021年6月10日的历史上市指导价，未确认358元仍适用；2026-09-07仅为观察记录日，不是当前调价或成交日期。",
      "volumeMl": 500,
      "edition": "第二代",
      "source": "https://www.wuliangnongxiang.com/product/proPage.html?id=31",
      "priceBasis": "msrp",
      "priceSource": "https://www.wuliangnongxiang.com/news/newsPage.html?id=118",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "jianzhuang-1911-52",
      "name": "尖庄1911 52度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 52,
      "price": 368,
      "priceTier": "中端",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川宜宾",
      "highlight": "52度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。采用2021年5月21日历史上市价，非现售成交价；报价公告通过厂家同名产品记录对应52度500ml，观察日不代表指导价生效日。",
      "volumeMl": 500,
      "edition": "1911",
      "source": "https://www.wuliangnongxiang.com/product/proPage.html?id=30",
      "priceBasis": "msrp",
      "priceSource": "https://www.wuliangnongxiang.com/news/newsPage.html?id=113",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "jianzhuang-daguang-50",
      "name": "尖庄 大光50度",
      "brand": "五粮液",
      "aroma": "浓香",
      "abv": 50,
      "price": 35.9,
      "priceTier": "口粮",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川宜宾",
      "highlight": "50度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用页面挂牌价，不代表实际结算价。第三方商家公开店铺挂牌价，非厂家指导价；金额来源是具体商品卡，结算价格与地区可售性未确认。",
      "volumeMl": 500,
      "edition": "大光",
      "source": "https://www.wuliangnongxiang.com/product/proPage.html?id=8",
      "priceBasis": "listing",
      "priceSource": "https://shop.jiuxian.com/index-1883.htm",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "maotai-43",
      "name": "贵州茅台酒43度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 43,
      "price": 829,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "43度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用页面挂牌价，不代表实际结算价。采用2026年1月14日公告的829元自营体系价，不保证当前i茅台结算或现货；2026-09-07仅为本次观察日，不声称当天调价。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.moutai.com.cn/mtgf/2023-10/31/article_2023103117380885242.html",
      "priceBasis": "listing",
      "priceSource": "https://www.moutai.com.cn/mtgf/articleFileDir/2026-01/15/a3f07b4782ce48d6a05f89f35a6ddf6a.pdf",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-laobaifen-chunrou-53",
      "name": "汾酒 老白汾醇柔53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 105,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西汾阳杏花村",
      "highlight": "53度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。采用105元单瓶展示价，不套用六瓶或双瓶金额，不保证实际结算价。",
      "volumeMl": 475,
      "edition": null,
      "source": "https://www.fenjiu.com.cn/gf/baifen/2023-05-19/3902.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-bofen-42",
      "name": "汾酒 玻瓶汾酒42度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 42,
      "price": 49,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西汾阳杏花村",
      "highlight": "42度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。单瓶商家展示报价，不保证结算价、库存或实际成交；不另增红盖别名条目。",
      "volumeMl": 475,
      "edition": null,
      "source": "https://www.fenjiu.com.cn/gf/bofen/2023-02-08/1005.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "kouzi-five-year-40-8",
      "name": "口子窖 五年型40.8度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 40.8,
      "price": 110,
      "priceTier": "口粮",
      "taste": [
        "兼香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "安徽淮北",
      "highlight": "40.8度、400mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。不与目录身份存疑的小池窖40.8度混同。年货节字样仅为促销文案，不作为edition或报价日期。",
      "volumeMl": 400,
      "edition": "五年型",
      "source": "https://product.suning.com/0070854614/108373298.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70854614/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "kouzi-five-year-52",
      "name": "口子窖 五年型52度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 52,
      "price": 115,
      "priceTier": "口粮",
      "taste": [
        "兼香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "安徽淮北",
      "highlight": "52度、400mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。与40.8度五年型按ABV区分。未把50度550mL容量升级款再列为新增。",
      "volumeMl": 400,
      "edition": "五年型",
      "source": "https://product.suning.com/0070854614/11906544150.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70854614/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "kouzi-six-year-41",
      "name": "口子窖 六年型41度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 41,
      "price": 148,
      "priceTier": "口粮",
      "taste": [
        "兼香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "安徽淮北",
      "highlight": "41度、450mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。没有把4瓶、6瓶装另外计算为新SKU。价格为单瓶挂牌，不是成交证明。",
      "volumeMl": 450,
      "edition": "六年型",
      "source": "https://product.suning.com/0070854614/103339410.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70854614/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "kouzi-six-year-52",
      "name": "口子窖 六年型52度",
      "brand": "口子窖",
      "aroma": "兼香",
      "abv": 52,
      "price": 145,
      "priceTier": "口粮",
      "taste": [
        "兼香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "安徽淮北",
      "highlight": "52度、450mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。真实52度版本，不以50度550mL容量升级款替代。",
      "volumeMl": 450,
      "edition": "六年型",
      "source": "https://product.suning.com/0070854614/11906580301.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70854614/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "shede-zizai-29",
      "name": "舍得 自在29度",
      "brand": "舍得",
      "aroma": "浓香",
      "abv": 29,
      "price": 329,
      "priceTier": "中端",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川射洪",
      "highlight": "29度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。采用2025年8月30日的历史上市定价329元，非当前促销或成交价；2026-09-07仅为本次核阅日期，不表示当天调整或生效。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://www.tuopaishede.cn/productInfo_135.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.fosun.com/content/details46_4880.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tuopai-liuliang-42",
      "name": "沱牌 六粮42度",
      "brand": "沱牌",
      "aroma": "浓香",
      "abv": 42,
      "price": 15,
      "priceTier": "口粮",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川遂宁",
      "highlight": "42度、250mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。只选此明确250mL表达，不再把厂家500mL六粮另算新增；不能把15元套给500mL。",
      "volumeMl": 250,
      "edition": null,
      "source": "https://product.suning.com/0070191013/12450845324.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70191013/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "hongxing-lanhe18-53",
      "name": "红星 二锅头蓝盒18 53度",
      "brand": "红星",
      "aroma": "清香",
      "abv": 53,
      "price": 112,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "北京",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。蓝盒18为明确产品系列，不与既有43度蓝瓶或身份存疑的56度绵柔8混同。",
      "volumeMl": 500,
      "edition": "蓝盒18",
      "source": "https://product.suning.com/0030000752/10596900021.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/30000752/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "hongxing-lanhe12-43",
      "name": "红星 二锅头蓝盒12 43度",
      "brand": "红星",
      "aroma": "清香",
      "abv": 43,
      "price": 80,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "北京",
      "highlight": "43度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。蓝盒12与现有蓝瓶绵柔8为不同系列标识；若旧条实际误录为蓝盒12，应先纠正旧条后再去重。",
      "volumeMl": 500,
      "edition": "蓝盒12",
      "source": "https://product.suning.com/0030000752/12345671731.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/30000752/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "hongxing-gaozhao-zongshi1949-52",
      "name": "红星高照 宗师1949 52度",
      "brand": "红星",
      "aroma": "清香",
      "abv": 52,
      "price": 597,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "北京",
      "highlight": "52度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。1949是产品表达名称，不当作生产年份。零售挂牌价，不是厂家指导价或成交保证。",
      "volumeMl": 500,
      "edition": "宗师1949",
      "source": "https://product.suning.com/0030000752/11663111467.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/30000752/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-laobaifen-chunrou-42",
      "name": "汾酒 老白汾醇柔42度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 42,
      "price": 93.1,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西汾阳杏花村",
      "highlight": "42度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。真实42度版本，与53度按ABV区分，不按包装区分。商家展示价，不保证结算或库存。",
      "volumeMl": 475,
      "edition": null,
      "source": "https://www.fenjiu.com.cn/gf/baifen/2023-05-19/3902.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all-2.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-rubo-48",
      "name": "汾酒 乳玻汾48度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 48,
      "price": 69,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西汾阳杏花村",
      "highlight": "48度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。替换候选fenjiu-bofen-48，不将普通玻瓶与乳玻包装重复计数；商家展示价非成交保证。",
      "volumeMl": 475,
      "edition": "乳玻",
      "source": "https://www.fenjiu.com.cn/gf/bofen/2023-05-19/3905.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-siluroad-55",
      "name": "汾酒 丝绸之路小批量55度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 55,
      "price": 1368,
      "priceTier": "高端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "55度、750mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。独立产品表达，使用单瓶1368元，不采用六瓶8328元除算；店铺页面标示官方旗舰店，运营主体未独立确认。",
      "volumeMl": 750,
      "edition": "丝绸之路小批量",
      "source": "https://product.suning.com/0071602289/12451418865.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tuopai-shengtai-jiapin-52",
      "name": "沱牌 生态佳品52度",
      "brand": "沱牌",
      "aroma": "浓香",
      "abv": 52,
      "price": 9.9,
      "priceTier": "口粮",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "四川遂宁",
      "highlight": "52度、100mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。不同于已有T68和六粮；9.9元仅适用于100mL，不换算或当作500mL价格。",
      "volumeMl": 100,
      "edition": null,
      "source": "https://product.suning.com/0070191013/12452832201.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/70191013/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2015-53",
      "name": "年份潭酒2015 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 668,
      "priceTier": "高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。2015是厂家年份产品标识，不是报价日期；668元为本次观察到的指导价，生效日期与库存未知，非成交价。",
      "volumeMl": 500,
      "edition": "2015",
      "source": "https://www.tanjiu.cn/dyznf/nianfentan2015.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/nianfentan2015.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "tanjiu-vintage2017-53",
      "name": "年份潭酒2017 53度",
      "brand": "潭酒",
      "aroma": "酱香",
      "abv": 53,
      "price": 306,
      "priceTier": "中端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "四川泸州古蔺",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用官方指导价，不代表市场成交价。2017是厂家年份产品标识，不是报价日期；306元为本次观察到的指导价，生效日期与库存未知，非成交价。",
      "volumeMl": 500,
      "edition": "2017",
      "source": "https://www.tanjiu.cn/dyznf/nianfentan2017.html",
      "priceBasis": "msrp",
      "priceSource": "https://www.tanjiu.cn/dyznf/nianfentan2017.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-qinghua20-42",
      "name": "汾酒 青花20 42度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 42,
      "price": 423.6,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "42度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。与原53度青花20按真实ABV区分；采用苏宁店铺列表展示价，库存、结算及包装代次未核实，非厂家直营身份认证。",
      "volumeMl": 500,
      "edition": null,
      "source": "https://product.suning.com/0071602289/12437543207.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-lanfen-53",
      "name": "汾酒 蓝汾53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 128.63,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "53度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。按店铺独立命名的蓝汾记录，不当作黄盖玻汾的颜色变体；报价和产品资料来自店铺，实际结算与库存未确认。",
      "volumeMl": 475,
      "edition": null,
      "source": "https://product.suning.com/0071602289/12437525227.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-panama10-53",
      "name": "汾酒 巴拿马10 53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 292.6,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "53度、475mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。10为产品系列名称，不推断全部酒体酒龄；未再新增名称笼统的1915巴拿马，以免重叠。店铺列表价非成交保证。",
      "volumeMl": 475,
      "edition": "巴拿马10",
      "source": "https://product.suning.com/0071602289/12437525224.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-bofen-55",
      "name": "汾酒 玻汾55度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 55,
      "price": 108,
      "priceTier": "口粮",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "55度、950mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。采用特定SKU的108元单瓶展示价；55度为实际ABV差异，不仅因950mL包装新增。库存和结算价未核实。",
      "volumeMl": 950,
      "edition": null,
      "source": "https://product.suning.com/0071602289/12451422561.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-shiwanpiao-45",
      "name": "汾酒 小批量酿造十万票45度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 45,
      "price": 178,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "自饮",
        "朋友小聚"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "45度、450mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。小批量和十万票沿用产品名称，不宣称收藏价值；采用单瓶店铺展示价，库存与结算未确认。",
      "volumeMl": 450,
      "edition": "十万票",
      "source": "https://product.suning.com/0071602289/12451422558.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-siluroad-42",
      "name": "汾酒 丝绸之路42度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 42,
      "price": 288,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "42度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。与55度750mL丝绸之路按ABV和具体表达区分；不套用55度报价。实际库存与结算未确认。",
      "volumeMl": 500,
      "edition": "丝绸之路",
      "source": "https://product.suning.com/0071602289/12451419595.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-jinpanama-53",
      "name": "汾酒 金巴拿马53度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 53,
      "price": 363,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。保留具体金巴拿马产品名，不与笼统1915巴拿马混称；报价来自店铺，非厂商指导价或实时成交。",
      "volumeMl": 500,
      "edition": "金巴拿马",
      "source": "https://product.suning.com/0071602289/12451418398.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "fenjiu-jinpanama-42",
      "name": "汾酒 金巴拿马42度",
      "brand": "汾酒",
      "aroma": "清香",
      "abv": 42,
      "price": 323,
      "priceTier": "中端",
      "taste": [
        "清香风格（按香型归类）"
      ],
      "scene": [
        "朋友小聚",
        "家庭聚餐"
      ],
      "beginner": 3,
      "region": "山西吕梁",
      "highlight": "42度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用商家展示报价，购买时核对单瓶结算价与库存。与53度金巴拿马按真实ABV区分，不因箱规重复计数；店铺展示价，不保证结算或库存。",
      "volumeMl": 500,
      "edition": "金巴拿马",
      "source": "https://product.suning.com/0071602289/12451418393.html",
      "priceBasis": "retail",
      "priceSource": "https://shop.suning.com/71602289/all.html",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "maotai-chennian15-53",
      "name": "陈年贵州茅台酒（15）53度",
      "brand": "茅台",
      "aroma": "酱香",
      "abv": 53,
      "price": 4279,
      "priceTier": "超高端",
      "taste": [
        "酱香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "贵州仁怀茅台镇",
      "highlight": "53度、500mL；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；采用页面挂牌价，不代表实际结算价。独立陈年系列，不与原精品、飞天或生肖重复。价格采用2026年5月16日中新社公告报道，非实时商品页；不保证当前结算或库存。15为产品命名，不据此推断所有酒体酒龄。",
      "volumeMl": 500,
      "edition": "陈年（15）",
      "source": "https://www.moutai.com.cn/mtgf/2023-10/31/article_2023103117390096879.html",
      "priceBasis": "listing",
      "priceSource": "https://www.chinanews.com/cj/2026/05-16/10622216.shtml",
      "priceUpdated": "2026-09-07"
    },
    {
      "id": "yanghe-m9-52",
      "name": "洋河 梦之蓝M9 52度",
      "brand": "洋河",
      "aroma": "浓香",
      "abv": 52,
      "price": 1099,
      "priceTier": "高端",
      "taste": [
        "浓香风格（按香型归类）"
      ],
      "scene": [
        "家庭聚餐",
        "商务宴请",
        "送礼"
      ],
      "beginner": 3,
      "region": "江苏宿迁",
      "highlight": "52度、500mL普通M9；产品规格有公开资料依据，非实饮评价",
      "caution": "场景和新手适应评分为规则推断，未做实饮评测；1099元为商品页面活动展示价，不代表实际结算价，库存及活动截止日未核实。1599元为划线原价；普通蓝盒M9，不是金M9。",
      "volumeMl": 500,
      "edition": "普通M9蓝盒装（非金M9）",
      "source": "https://www.chinayanghe.com/product/yanghe/lsjdxl/3.html",
      "priceBasis": "listing",
      "priceSource": "https://detail.youzan.com/show/goods?alias=26wl5g4yo2bs3&from_source=gbox_seo",
      "priceUpdated": "2026-09-07"
    }
  ]
};
