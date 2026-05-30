import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { ArrowRight, Check, ChevronDown, MapPin, X } from "lucide-react";
import {
  PRESET_BACKGROUND_IMAGES
} from "../data";

/* ── Hero Presets ── */
/* ── Section Data ── */
const FEATURES = [
  { img: "/images/flickr_bag_12.jpg", title: "面料选择", desc: "有机棉、原色帆布、水洗做旧、防水涂层 — 多种面料任你挑选" },
  { img: "/images/flickr_bag_13.jpg", title: "图案定制", desc: "上传自己的设计，或从 100+ 设计师原创图案中挑选灵感" },
  { img: "/images/flickr_bag_14.jpg", title: "尺寸配件", desc: "从mini到超大号，搭配不同肩带、拉链、内袋和扣饰" },
  { img: "/images/flickr_bag_15.jpg", title: "色彩方案", desc: "超过 50 种 Pantone 色可选，支持拼色、渐变、撞色设计" },
  { img: "/images/flickr_bag_16.jpg", title: "个性刺绣", desc: "名字、日期、座右铭 — 用刺绣让包包真正属于你" },
  { img: "/images/flickr_bag_17.jpg", title: "环保工艺", desc: "环保染料 + 可降解包装，每只包都承载对地球的善意" },
];

const GALLERY_ITEMS = [
  { img: "/images/flickr_bag_04.jpg", label: "日系简约" },
  { img: "/images/flickr_bag_05.jpg", label: "复古文艺" },
  { img: "/images/flickr_bag_06.jpg", label: "森系自然" },
  { img: "/images/flickr_bag_08.jpg", label: "插画师联名" },
  { img: "/images/flickr_bag_09.jpg", label: "极简几何" },
  { img: "/images/flickr_bag_10.jpg", label: "水墨国风" },
  { img: "/images/flickr_bag_11.jpg", label: "波普艺术" },
];

const PROCESS_STEPS = [
  { img: "/images/flickr_bag_18.jpg", num: "01", title: "选择款式", desc: "挑选包型、尺寸和面料基础" },
  { img: "/images/flickr_bag_19.jpg", num: "02", title: "设计图案", desc: "上传设计或从模板库中选取" },
  { img: "/images/flickr_bag_20.jpg", num: "03", title: "确认打样", desc: "3D 预览效果，确认细节" },
  { img: "/images/flickr_bag_21.jpg", num: "04", title: "手工制作", desc: "资深工匠精心制作，送货上门" },
];

const TESTIMONIALS = [
  { img: "/images/flickr_bag_22.jpg", avatar: "林", name: "林小夕", title: "插画师", text: "从设计到成品只用了 5 天，刺绣的细节比我想象的还要精致。已经推荐给所有朋友了！" },
  { img: "/images/flickr_bag_23.jpg", avatar: "陈", name: "陈一诺", title: "咖啡馆主理人", text: "给工作室定制了一批帆布包作为周边，品质非常好，同事们都抢着要。下次还会合作。" },
  { img: "/images/flickr_bag_01.jpg", avatar: "王", name: "王悠悠", title: "大学生", text: "选了拼色设计+名字刺绣，收到的那一刻太惊喜了。每天背着去上课，心情都变好了。" },
];

const PRICING_PLANS = [
  {
    name: "基础款", price: "¥89", sub: "起，含基础设计", popular: false,
    items: ["标准帆布面料（3色可选）", "基础印花或刺绣", "3个标准尺寸", "7-10天交付", "全国包邮"]
  },
  {
    name: "进阶款", price: "¥169", sub: "起，含专属设计", popular: true,
    items: ["精选面料（有机棉/水洗/防水）", "满版印花 + 个性刺绣", "多尺寸可选，含异形包型", "免费设计稿修改 2 次", "5-7天交付 · 全国包邮"]
  },
  {
    name: "企业批量", price: "¥59", sub: "/只，50只起订", popular: false,
    items: ["所有进阶款面料可选", "品牌 LOGO 印制/刺绣", "专属定制包装", "免费设计稿修改 3 次", "10-15天交付 · 含税"]
  },
];

const FAQ_ITEMS = [
  { q: "定制一个帆布包需要多久？", a: "基础款一般 7-10 个工作日，进阶款 5-7 个工作日。企业批量订单 10-15 个工作日。下单后我们会提供预计交付时间。" },
  { q: "可以提供样品或打样吗？", a: "可以的。进阶款及以上方案包含打样服务，确认设计稿后我们会制作实物样品，确认后再批量生产。" },
  { q: "最少起订量是多少？", a: "基础款和进阶款 1 只起订。企业批量订单 50 只起订，数量越多单价越优惠。" },
  { q: "支持哪些支付方式？", a: "支持微信支付、支付宝、银行转账。企业订单可开票，支持对公转账。" },
  { q: "不满意可以退换吗？", a: "我们承诺 7 天无理由退换。如果产品与设计稿不符或有质量问题，我们免费重做或全额退款。" },
];

/* ── Stagger Variants ── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

/* ── Component ── */
interface LandingPageProps {
  onEnterStudio: () => void;
}

export default function LandingPage({ onEnterStudio }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Gallery pinned horizontal scroll — GSAP ScrollTrigger
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = galleryTrackRef.current;
    const section = galleryRef.current;
    if (!el || !section) return;

    const ctx = gsap.context(() => {
      const trackWidth = el.scrollWidth;
      const maxX = -(trackWidth - window.innerWidth + 64);

      gsap.to(el, {
        x: maxX,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + Math.abs(maxX),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Gallery items scale-in reveal
      const items = el.querySelectorAll(':scope > div');
      gsap.from(items, {
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        immediateRender: false,
      });
    });

    return () => ctx.revert();
  }, []);

  // Process steps stagger + number highlight on scroll
  useEffect(() => {
    const section = processRef.current;
    if (!section) return;

    const steps = section.querySelectorAll('.process-step');
    if (steps.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(steps, {
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power3.out",
        immediateRender: false,
      });

      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 75%",
          onEnter: () => step.classList.add("active"),
          onLeaveBack: () => step.classList.remove("active"),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#faf6f0] text-[#2c2416] font-sans antialiased overflow-x-hidden selection:bg-[#e8d5c4]">
      <style>{`
        .process-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 30px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, #e8d5c4, transparent);
          pointer-events: none;
        }
        .process-step.active .process-step-num {
          background-color: #2c2416 !important;
          border-color: #2c2416 !important;
          color: #faf6f0 !important;
        }
      `}</style>

      {/* ════════════════ HERO ════════════════ */}
      <section className="min-h-screen pt-28 pb-16 md:py-0 flex flex-col md:flex-row items-center max-w-7xl mx-auto px-5 md:px-16 overflow-hidden">
        {/* Left */}
        <div className="w-full md:w-1/2 md:pr-16 flex flex-col justify-center gap-5 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <span className="inline-block px-3 py-1 bg-[#c4956a]/15 text-[#c4956a] rounded-full text-xs font-medium tracking-wider">
              ✦ 素织手作 · 手工帆布包
            </span>
            <h1 className="font-serif-sc font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#2c2416]">
              用自然的面料，<br />
              <span className="bg-gradient-to-r from-[#c4956a] to-[#8b7355] bg-clip-text text-transparent">
                做你的包
              </span>
            </h1>
            <p className="text-base text-[#8b7d6b] leading-relaxed max-w-md">
              从面料到图案，从颜色到配件 — 每一处细节都由你定义。
              我们用手工工艺，将你的想法变成独一无二的帆布包。
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <button
                onClick={() => setShowModal(true)}
                className="group bg-[#2c2416] text-[#faf6f0] px-8 py-3.5 rounded-full font-sans font-medium text-sm tracking-wide hover:bg-[#c4956a] transition-all active:scale-[0.98] shadow-sm"
              >
                开始设计 <ArrowRight className="inline-block w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
              {/* <button
                onClick={() => setShowModal(true)}
                className="px-8 py-3.5 rounded-full font-sans font-medium text-sm border border-[#c4956a] text-[#c4956a] hover:bg-[#c4956a] hover:text-white transition-all"
              >
                咨询设计师
              </button> */}
              <button
                onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3.5 rounded-full font-sans font-medium text-sm border border-[#2c2416] text-[#2c2416] hover:bg-[#2c2416] hover:text-[#faf6f0] transition-all"
              >
                查看作品
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right — Hero Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh] relative flex items-center justify-center mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full rounded-2xl overflow-hidden relative shadow-xl group border border-[#e8d5c4]/20"
          >
            <img
              alt="手工帆布包"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
              src={PRESET_BACKGROUND_IMAGES.hero_tote}
            />
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 bg-[#faf6f0]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[11px] uppercase tracking-wider font-semibold text-[#2c2416]">
              素织手作 · 手工帆布包
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ MATERIALS ════════════════ */}
      {/* <section className="py-24 bg-[#f5f0e8] border-y border-[#e8d5c4]/40">
        <div className="max-w-7xl mx-auto px-5 md:px-16 mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">选材溯源</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">
              全球甄选 · 只取臻品
            </h2>
          </div>
          <p className="font-sans text-sm text-[#8b7d6b] max-w-sm">
            我们甄选日本冈山有机帆布、意大利托斯卡纳植鞣革与无铅黄铜配件，每一份原料都承载着匠心地标的品质承诺。
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "有机帆布", sub: "Okayama Loom", origin: "日本冈山 · 仓敷", img: "/images/material_canvas.jpg", desc: "可持续重织帆布，低张力纺织工艺，拥有柔韧耐用的独特手感。" },
            { title: "植鞣牛皮", sub: "Tuscany Vachetta", origin: "意大利 · 托斯卡纳", img: "/images/material_leather.jpg", desc: "全粒面植鞣革，采用板栗与橡木提取物慢鞣，随岁月呈现琥珀色光泽。" },
            { title: "拉丝黄铜", sub: "Brushed Brass", origin: "日本 · 大阪", img: "/images/material_hardware.jpg", desc: "纯砂铸黄铜五金件，手工拉丝缎面处理，抗氧化保护，手感温润厚重。" }
          ].map((mat, i) => (
            <div key={i} className="bg-[#faf6f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#e8d5c4]/30 group">
              <div className="aspect-[4/3] relative overflow-hidden bg-[#e8d5c4]">
                <img alt={mat.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" src={mat.img} />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold shadow-xs">
                  {mat.sub}
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-serif-sc font-semibold text-lg text-[#2c2416] mb-2">{mat.title}</h3>
                <p className="text-sm text-[#8b7d6b] leading-relaxed mb-3">{mat.desc}</p>
                <div className="text-[10px] uppercase tracking-wider text-[#c4956a] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {mat.origin}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ════════════════ FEATURES ════════════════ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="text-center mb-14">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">定制服务</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">全方位定制</h2>
            <p className="text-[#8b7d6b] mt-2">从材质到工艺，每一个细节都按你的想法来</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-[#faf6f0] rounded-2xl p-6 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg group"
              >
                <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-[#e8d5c4]">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
                </div>
                <h3 className="font-serif-sc font-semibold text-lg text-[#2c2416] mb-2">{f.title}</h3>
                <p className="text-sm text-[#8b7d6b] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ GALLERY ════════════════ */}
      <section ref={galleryRef} id="gallery" className="bg-[#faf6f0] overflow-hidden py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-16 mb-16">
          <p className="section-label">作品精选</p>
          <h2 className="section-title">灵感作品</h2>
          <p className="section-sub">看看其他人都定制了什么风格</p>
        </div>
        <div
          ref={galleryTrackRef}
          className="flex gap-6 px-5 md:px-16"
        >
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="w-[280px] h-[360px] rounded-2xl overflow-hidden flex-shrink-0 bg-[#e8d5c4] relative group cursor-pointer"
            >
              <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 p-5 pt-10 bg-gradient-to-t from-black/50 to-transparent">
                <span className="text-white text-sm font-medium">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ PROCESS ════════════════ */}
      <section ref={processRef} id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">制作流程</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">四步拥有专属帆布包</h2>
            <p className="text-[#8b7d6b] mt-2">简单四步，从想法到成品</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                className="process-step flex-1 text-center relative"
              >
                <div className="w-full h-[130px] rounded-xl overflow-hidden mb-4 bg-[#e8d5c4]">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-600 hover:scale-105" loading="lazy" />
                </div>
                <div className="process-step-num w-[60px] h-[60px] rounded-full border-2 border-[#e8d5c4] bg-[#faf6f0] text-[#c4956a] flex items-center justify-center font-serif-sc font-bold text-[1.4rem] mx-auto mb-5 transition-all duration-400">
                  {step.num}
                </div>
                <h4 className="font-serif-sc font-semibold text-[1.05rem] text-[#2c2416] mb-[0.4rem]">{step.title}</h4>
                <p className="text-[0.85rem] text-[#8b7d6b] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="py-24 bg-[#faf6f0]">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="text-center mb-14">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">用户评价</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">大家怎么说</h2>
            <p className="text-[#8b7d6b] mt-2">来自定制用户的真实反馈</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d5c4]/20">
                <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-[#e8d5c4]">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-400 hover:scale-105" loading="lazy" />
                </div>
                <div className="text-[#f4b940] text-sm mb-3 tracking-wider">★★★★★</div>
                <p className="text-sm text-[#8b7d6b] leading-relaxed italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e8d5c4] flex items-center justify-center font-semibold text-[#8b7355] text-sm">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-medium text-[#2c2416]">{t.name}</div>
                    <div className="text-xs text-[#8b7d6b]">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ PRICING ════════════════ */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="text-center mb-14">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">价格方案</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">透明定价</h2>
            <p className="text-[#8b7d6b] mt-2">无隐藏费用，按需选择适合的方案</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`rounded-2xl p-8 text-center transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg relative ${
                  plan.popular
                    ? "bg-[#2c2416] text-[#faf6f0] scale-105 md:scale-105"
                    : "bg-[#faf6f0] text-[#2c2416]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4956a] text-white px-4 py-1 rounded-full text-[11px] font-semibold tracking-wide">
                    最受欢迎
                  </div>
                )}
                <h3 className="font-serif-sc font-semibold text-xl mb-1">{plan.name}</h3>
                <div className={`text-3xl font-bold mt-3 mb-1 ${plan.popular ? "text-[#faf6f0]" : "text-[#2c2416]"}`}>{plan.price}</div>
                <div className={`text-sm mb-5 ${plan.popular ? "text-[#e8d5c4]" : "text-[#8b7d6b]"}`}>{plan.sub}</div>
                <ul className="text-left space-y-2.5 mb-8">
                  {plan.items.map((item, j) => (
                    <li key={j} className={`text-sm flex items-center gap-2 ${plan.popular ? "text-[#e8d5c4]" : "text-[#8b7d6b]"}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-[#c4956a]" : "text-[#c4956a]"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowModal(true)}
                  className={`w-full py-2.5 rounded-full text-sm font-medium transition-all border ${
                    plan.popular
                      ? "bg-[#c4956a] text-white border-transparent hover:bg-[#b8865a]"
                      : "border-[#2c2416] text-[#2c2416] hover:bg-[#2c2416] hover:text-[#faf6f0]"
                  }`}
                >
                  咨询设计师
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section id="faq" className="py-24 bg-[#faf6f0]">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="text-center mb-14">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">常见问题</span>
            <h2 className="font-serif-sc font-bold text-3xl sm:text-4xl text-[#2c2416] mt-2">常见问题</h2>
            <p className="text-[#8b7d6b] mt-2">关于定制流程，你可能想了解的</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-xl overflow-hidden cursor-pointer border border-[#e8d5c4]/20 transition-shadow ${
                  openFaq === i ? "shadow-sm" : ""
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-medium text-sm text-[#2c2416]">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8b7d6b] transition-transform duration-300 ${
                    openFaq === i ? "rotate-180" : ""
                  }`} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-48 px-5 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-[#8b7d6b] leading-relaxed">{item.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="py-24 text-center bg-[#2c2416] text-[#faf6f0] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto px-5 space-y-6">
          <h2 className="font-serif-sc font-bold text-4xl sm:text-5xl">开始设计你的帆布包</h2>
          <p className="text-[#e8d5c4] text-lg">首单免设计费 · 7天无条件退换 · 全国包邮</p>
          <button
            onClick={onEnterStudio}
            className="inline-flex items-center gap-2 bg-[#c4956a] text-white px-10 py-3.5 rounded-full font-sans font-medium text-sm tracking-wide hover:bg-[#b8865a] transition-all active:scale-[0.98] shadow-lg"
          >
            免费开始设计 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-[#2c2416] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start mb-10">
            <div className="space-y-4">
              <div className="font-serif-sc font-bold text-lg text-[#faf6f0] flex items-center gap-2">
                素织手作
              </div>
              <p className="text-sm text-[#e8d5c4]/60 leading-relaxed max-w-xs">
                用心做一只好包。手工帆布包定制，从面料到成品，每一处细节都由你定义。
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="font-sans font-bold text-xs text-[#e8d5c4] uppercase tracking-widest mb-1">服务</h4>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">定制流程</a>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">面料指南</a>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">配送说明</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="font-sans font-bold text-xs text-[#e8d5c4] uppercase tracking-widest mb-1">关于</h4>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">品牌故事</a>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">隐私政策</a>
              <a href="#" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">服务条款</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="font-sans font-bold text-xs text-[#e8d5c4] uppercase tracking-widest mb-1">联系</h4>
              <span className="text-sm text-[#e8d5c4]/60">📱 微信: 19322932086</span>
              <a href="mailto:19322932086@163.com" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">✉️ 19322932086@163.com</a>
              <a href="https://limw.top" target="_blank" rel="noopener" className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors">💬 微信公众号: 素织手作</a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#e8d5c4]/40">© 2026 素织手作 — 为品味独特者精心打造</p>
            {/* <span className="text-xs text-[#e8d5c4]/40">用心做一只好包</span> */}
            <div className="flex gap-4 text-xs text-[#e8d5c4]/40">
              <span>北京</span>
              <span>•</span>
              <span>雄安</span>
              <span>•</span>
              <span>白沟</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════ CONTACT MODAL ════════════════ */}
      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ════════════════ Contact Modal ════════════════ */
function ContactModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value.trim(),
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      desc: (form.elements.namedItem("desc") as HTMLTextAreaElement).value.trim(),
      ref: (form.elements.namedItem("ref") as HTMLInputElement).value.trim(),
      time: new Date().toISOString(),
    };

    // Store to localStorage
    const key = "canvascraft_inquiries";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative animate-[modalIn_0.3s_ease]">
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#8b7d6b] hover:text-[#2c2416] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h2 className="font-serif-sc font-bold text-1.5xl text-[#2c2416] mb-1">开始定制你的帆布包</h2>
            <p className="text-sm text-[#8b7d6b] mb-6">填写以下信息，我们会尽快与你联系</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c2416] mb-1">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="你的名字"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e0d8d0] bg-[#faf6f0] text-sm focus:outline-none focus:border-[#c4956a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c2416] mb-1">
                    联系方式 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="contact"
                    required
                    placeholder="微信 / 手机号"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e0d8d0] bg-[#faf6f0] text-sm focus:outline-none focus:border-[#c4956a] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2416] mb-1">
                  定制类型 <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0d8d0] bg-[#faf6f0] text-sm focus:outline-none focus:border-[#c4956a] transition-colors"
                >
                  <option value="">请选择</option>
                  <option value="individual">个人定制</option>
                  <option value="batch">企业批量</option>
                  <option value="gift">送礼定制</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2416] mb-1">
                  你的需求 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="desc"
                  required
                  placeholder="请描述你的想法 — 想要的风格、图案、颜色、尺寸、数量等"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0d8d0] bg-[#faf6f0] text-sm focus:outline-none focus:border-[#c4956a] transition-colors resize-vertical min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2416] mb-1">
                  参考图片（可选）
                </label>
                <input
                  name="ref"
                  placeholder="如有参考图，请提供图片链接或描述"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e0d8d0] bg-[#faf6f0] text-sm focus:outline-none focus:border-[#c4956a] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-full bg-[#2c2416] text-white font-medium text-sm hover:bg-[#c4956a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "提交中..." : "提交定制需求"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="font-serif-sc font-bold text-xl text-[#2c2416] mb-2">提交成功！</h3>
            <p className="text-sm text-[#8b7d6b] leading-relaxed">
              我们会在 24 小时内通过微信或电话与你联系，<br />
              一起讨论你的定制方案。
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full border border-[#2c2416] text-[#2c2416] text-sm font-medium hover:bg-[#2c2416] hover:text-white transition-all"
            >
              知道了
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
