"use strict";

module.exports = {
  "meta": {
    "name": "Wineer 白酒数据库",
    "version": "0.2.0",
    "updated": "2026-08-10",
    "note": "种子库，手工整理并参考公开榜单校对。价格为大致市场参考价（元/瓶），会随行情波动，仅供推荐分档使用，非实时报价。已扩充到100款，覆盖更多香型、价位、区域品牌与小众风格。",
    "schema": {
      "id": "唯一标识",
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
      "caution": "避坑/注意提示"
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
      "caution": "假货重灾区，认准正规渠道防伪；新手可能喝不惯酱味"
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
      "caution": "注意区分老版新版，防贴牌开发酒"
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
      "caution": "防低价开发酒冒充"
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
      "highlight": "清香型天花板，新手最友好，干净不上头",
      "caution": "清香型香气较淡，喜欢浓郁口感的人可能觉得寡"
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
      "caution": "价格偏高，日常自饮不划算"
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
      "caution": "热门款假货多，认准渠道"
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
      "caution": "绵柔派偏甜，喜欢劲道的人可能觉得平"
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
      "caution": "度数低、酒体偏淡，老酒鬼嫌不过瘾"
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
      "caution": "年份原浆系列版本多，别买错档"
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
      "caution": "酱味重，新手过渡着喝"
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
      "caution": "价格波动大，酱味厚新手慎入"
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
      "caution": "礼盒溢价，自饮选窖藏系列更值"
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
      "caution": "热销易有假，走正规渠道"
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
      "caution": "品牌力弱于茅习郎，送礼认知度一般"
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
      "caution": "品牌年轻，收藏价值有限"
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
      "caution": "液态法/固液法为主，非纯粮，别拿来待客送礼"
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
      "caution": "56度偏烈，不胜酒力者慎"
    },
    {
      "id": "laobaigan",
      "name": "衡水老白干 1915 67度",
      "brand": "老白干",
      "aroma": "其他",
      "abv": 67,
      "price": 400,
      "priceTier": "中端",
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
      "caution": "67度极烈，新手绝对不建议上手"
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
      "caution": "凤香型认知度低，送礼不占优"
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
      "caution": "药香味小众，新手大概率喝不惯"
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
      "caution": "兼香派没有鲜明记忆点，喜欢个性风味的略平"
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
      "caution": "区域性强，外地认知度低"
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
      "caution": "米香型小众，喜欢厚重口感的人会觉得淡"
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
      "caution": "品牌溢价，纯论酒质性价比一般"
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
      "caution": "营销偏文化牌，按需选择"
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
      "caution": "和郎酒酱香线别混淆"
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
      "highlight": "口粮神酒，纯粮清香、干净不上头、超高性价比",
      "caution": "没有短板，唯一缺点是包装朴素、不适合送礼"
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
      "caution": "酒体偏淡，重口味不满足"
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
      "caution": "江苏地区强势，外省认知一般"
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
      "caution": "酒质与飞天差距大，别期待茅台味"
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
      "caution": "和飞天差距很大，不要按高端茅台期待"
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
      "caution": "价格高于普通王子，自饮看预算"
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
      "caution": "酱香浓度不如高度重口款，老酱客可能觉得轻"
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
      "caution": "品牌溢价明显，价格波动需关注"
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
      "caution": "赖茅系列较多，注意区分传承蓝/棕等版本"
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
      "caution": "档次不适合正式商务送礼"
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
      "caution": "品牌力低于1988，送礼预算够可上更高档"
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
      "caution": "酱味明显，新手建议小杯慢饮"
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
      "caution": "包装和场面感一般，送礼不如红花郎"
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
      "caution": "品牌认知偏区域，商务送礼弱一些"
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
      "caution": "酒体厚度有限，别按高端酱香期待"
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
      "caution": "包装普通，正式送礼不占优"
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
      "caution": "区域认知不如茅习郎，送礼看对象"
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
      "caution": "品牌面子弱于同价位头部名酒"
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
      "caution": "品牌溢价存在，收藏属性有限"
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
      "caution": "版本多且价格波动，注意渠道"
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
      "caution": "全国认知度有限，送礼偏小众"
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
      "caution": "品牌名气一般，商务属性弱"
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
      "caution": "非主流产区，送礼认知度有限"
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
      "caution": "和普五档次差距明显，别买高价"
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
      "caution": "系列酒多，注意不要和贴牌混淆"
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
      "caution": "包装朴素，不适合送礼宴请"
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
      "caution": "注意区分特曲、头曲、二曲和开发品"
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
      "caution": "档次普通，正式宴请建议上特曲以上"
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
      "caution": "品牌线复杂，避免买到非核心开发酒"
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
      "caution": "追求浓烈窖香的人可能觉得柔弱"
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
      "caution": "价格接近更强品牌时需比较性价比"
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
      "caution": "外省认知略弱于全国名酒"
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
      "caution": "高端价位全国流通面子不如茅五泸"
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
      "caution": "兼香型辨识度不如酱/浓，送礼看地区"
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
      "caution": "品牌溢价较高，酒质性价比不是最优"
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
      "caution": "老酒概念有营销成分，按口感和价格判断"
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
      "caution": "品牌场面感弱，不适合正式送礼"
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
      "caution": "品牌力和酒质低于水晶剑，别高价买"
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
      "caution": "现在品牌声量弱，送礼认知有限"
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
      "caution": "低度酒体偏轻，老酒客可能觉得不过瘾"
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
      "caution": "区域品牌强，外省送礼识别度一般"
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
      "caution": "外省高价购买需考虑认知度"
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
      "caution": "区域性强，商务送礼不合适"
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
      "caution": "品牌全国声量一般，送礼偏区域"
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
      "caution": "品牌体系复杂，注意买核心产品"
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
      "caution": "包装太朴素，送礼宴请不够看"
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
      "caution": "喜欢浓郁窖香的人会觉得淡"
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
      "caution": "商务场面不如青花系列"
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
      "caution": "品牌认知较低，送礼不占优"
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
      "caution": "区域性强，高端商务识别度有限"
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
      "caution": "口感简单，别用于正式宴请"
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
      "caution": "55度有劲，新手慎重"
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
      "caution": "全国送礼认知不如浓香头部品牌"
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
      "caution": "凤香小众，送外地长辈前最好确认接受度"
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
      "caution": "高价小众香型，非凤香受众慎送"
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
      "caution": "度数低且风味轻，重口味白酒爱好者会嫌淡"
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
      "caution": "风味和传统高度白酒差异大，送礼需看地域"
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
      "caution": "米香型普遍偏轻，商务送礼场面弱"
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
      "caution": "区域品牌，外省送礼不强"
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
      "caution": "非湖北场景识别度一般"
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
      "caution": "陶香型小众，外省认知有限"
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
      "caution": "药香非常小众，不建议盲送新手"
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
      "caution": "风味门槛高，喝不惯的人会觉得怪"
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
      "caution": "香型独特，新手接受度因人而异"
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
      "caution": "高价小众香型，送礼前确认对方能接受"
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
      "caution": "区域品牌，外省送礼认知一般"
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
      "caution": "芝麻香小众，送礼看地域和口味"
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
      "caution": "高度烈酒，非老酒客慎入"
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
      "caution": "酒体偏轻，老酒客可能嫌淡"
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
      "caution": "香气与传统高粱酒不同，商务送礼偏小众"
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
      "caution": "价格高且行情波动大，必须正规渠道购买"
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
      "caution": "收藏溢价明显，饮用性价比低，年份生肖价格差异大"
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
      "caution": "价格明显高于普五，重视性价比可选普五"
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
      "caution": "高端浓香溢价明显，购买前比价并确认版本"
    }
  ]
};
