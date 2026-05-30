import { CanvasMaterial, LeatherMaterial, HardwareMaterial, BagSizeConfig, AtmosphereConfig, BagConfiguration } from "./types";

export const CANVAS_MATERIALS: CanvasMaterial[] = [
  {
    id: "organic-sand",
    name: "有机暖沙",
    color: "#f5f1ea",
    description: "源自日本冈山传承织机，可持续重织帆布。低张力纺织工艺，触感紧密而温润。",
    origin: "日本仓敷",
    imageUrl: "/images/material_canvas.jpg"
  },
  {
    id: "natural-sage",
    name: "秋鼠尾绿",
    color: "#a4b29a",
    description: "灵感源自京都苔庭的有机染色帆布。选用有机长绒棉纱线纺织，天然石蜡处理赋予轻度防水性能。",
    origin: "日本岐阜县",
    imageUrl: "/images/material_canvas.jpg"
  },
  {
    id: "obsidian-charcoal",
    name: "墨曜黑",
    color: "#2e2e2b",
    description: "采用传统松烟墨自然染色。深邃哑光的黑色帆布，呈现出极为细腻的木炭风化纹理。",
    origin: "日本奈良县",
    imageUrl: "/images/material_canvas.jpg"
  },
  {
    id: "desert-clay",
    name: "信乐陶土",
    color: "#b07a61",
    description: "融入矿物黏土颜料的温暖陶土色帆布。灵感源自信乐烧的质朴器皿，呈现自然的橙褐色调。",
    origin: "日本滋贺县",
    imageUrl: "/images/material_canvas.jpg"
  }
];

export const LEATHER_MATERIALS: LeatherMaterial[] = [
  {
    id: "premium-caramel",
    name: "植鞣焦糖",
    color: "#ad774b",
    description: "全粒面植鞣革，采用甜板栗与橡木提取物鞣制。随时间推移，会呈现出绝美的琥珀色光泽。",
    origin: "意大利托斯卡纳",
    imageUrl: "/images/material_leather.jpg"
  },
  {
    id: "espresso-brown",
    name: "浓缩深棕",
    color: "#3f2c22",
    description: "厚实滚鞣瓦切塔牛肩皮。油脂与蜡质充分渗透，手感如黄油般柔润，呈现浓郁的黑巧克力棕调。",
    origin: "意大利圣克罗齐",
    imageUrl: "/images/material_leather.jpg"
  },
  {
    id: "midnight-noir",
    name: "午夜曜黑",
    color: "#1f1f1e",
    description: "淀粉釉面高耐久黑色马缰革。高度抛光且耐轻微磨损，始终保持结构感利落轮廓。",
    origin: "意大利托斯卡纳",
    imageUrl: "/images/material_leather.jpg"
  },
  {
    id: "alabaster-ivory",
    name: "雪花石膏白",
    color: "#e6e2db",
    description: "柔软研磨半苯胺皮革。拥有细腻自然的水波滚纹，柔和反射光线，兼具舒适弹性。",
    origin: "法国卢瓦尔河谷",
    imageUrl: "/images/material_leather.jpg"
  }
];

export const HARDWARE_MATERIALS: HardwareMaterial[] = [
  {
    id: "brushed-brass",
    name: "拉丝黄铜",
    color: "#c2a36b",
    textureClass: "from-[#d0b47b] via-[#a6864d] to-[#e4cb9c] border-[#a0844f]",
    description: "实心砂铸黄铜，手工拉丝缎面处理。薄层天然抗氧化保护漆，持久保持温润光泽。"
  },
  {
    id: "polished-silver",
    name: "抛光银钢",
    color: "#bdc1c6",
    textureClass: "from-[#dfdfdf] via-[#b5b5b5] to-[#f4f4f4] border-[#919191]",
    description: "手术级黄铜基底，电镀纯银铂金涂层。耐盐雾腐蚀，哑光打磨触感舒适。"
  },
  {
    id: "matte-black",
    name: "阳极暗黑",
    color: "#3c4043",
    textureClass: "from-[#4a4a4a] via-[#212121] to-[#3a3a3a] border-[#1f1f1f]",
    description: "高压化学阳极氧化工艺，深邃太空黑哑光五金。极致耐刮擦，零反光。"
  }
];

export const BAG_SIZES: BagSizeConfig[] = [
  {
    id: "petit",
    name: "精巧基础款",
    dimensions: "28 × 22 × 12 cm",
    additionalPrice: 0,
    description: "紧凑有序的日常通勤尺寸。完美容纳 11\" iPad Pro、笔记本、水瓶、手机及随身小物，适合轻量城市出行。"
  },
  {
    id: "classic",
    name: "经典工作室款",
    dimensions: "38 × 31 × 15 cm",
    additionalPrice: 90,
    description: "标志性廓形。加厚衬板结构，轻松容纳 14\" MacBook Pro、文件夹及个人物品而不变形。工作室标配之选。"
  },
  {
    id: "grand",
    name: "远行大号款",
    dimensions: "48 × 38 × 18 cm",
    additionalPrice: 195,
    description: "宽裕的周末旅行袋。加粗十字缝线加固，可容纳 16\" 笔记本电脑、轻便换洗衣物、相机装备及配件包。"
  }
];

export const ATMOSPHERES: AtmosphereConfig[] = [
  {
    id: "gallery",
    name: "画廊日光",
    bgColor: "bg-[#fbf9f5]",
    ambientLight: "from-white/40 to-[#e3ded4]/30",
    shadowColor: "rgba(27, 28, 26, 0.05)",
    intensity: 1.0
  },
  {
    id: "sunset",
    name: "落日金辉",
    bgColor: "bg-gradient-to-tr from-[#ede4da] via-[#f7ecd8] to-[#fceee0]",
    ambientLight: "from-[#fcd9be]/30 to-[#fdfbf6]/10",
    shadowColor: "rgba(93, 66, 1, 0.08)",
    intensity: 1.2
  },
  {
    id: "atelier",
    name: "暗室格调",
    bgColor: "bg-[#252523]",
    ambientLight: "from-white/5 to-[#1c1c1b]/30",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    intensity: 0.8
  }
];

export const PRESET_BACKGROUND_IMAGES = {
  hero_tote: "/images/hero_tote.jpg"
};

export const INITIAL_CONFIGURATION: BagConfiguration = {
  canvas: CANVAS_MATERIALS[0],
  leather: LEATHER_MATERIALS[0],
  hardware: HARDWARE_MATERIALS[0],
  size: BAG_SIZES[1],
  monogram: {
    text: "素织",
    font: "Serif",
    style: "Gold Foil",
    position: "Pocket Center"
  },
  shoulderStrap: true,
  keyClasp: true,
  dustBag: false,
  atmosphere: ATMOSPHERES[0]
};
export const BASE_PRICE = 450;
