import { ArrowLeft } from "lucide-react";
import Footer from "./Footer";

const STATS = [
  { num: "2019", label: "品牌创立" },
  { num: "3000+", label: "定制客户" },
  { num: "12", label: "全球面料合作伙伴" },
  { num: "99%", label: "客户好评率" },
];

const MILESTONES = [
  { year: "2019", title: "品牌创立", desc: "素织手作在雄安创立，以「慢工艺」为核心理念，致力于手工帆布包定制。" },
  { year: "2020", title: "首款定制包面世", desc: "推出第一款全定制帆布包，从面料到配件均可自由搭配，获得市场热烈反响。" },
  { year: "2021", title: "南通面料合作", desc: "亲赴江苏南通，与传承织机工坊建立直供合作，引入有机认证帆布。" },
  { year: "2023", title: "意大利皮革引入", desc: "前往意大利托斯卡纳，甄选全粒面植鞣革，产品线完成全面升级。" },
  { year: "2024", title: "AI 设计助理上线", desc: "推出 AI 造型顾问，帮助用户更轻松地完成色彩搭配与风格设计。" },
  { year: "2025", title: "3000+ 定制客户", desc: "累计服务超过 3000 位客户，客户好评率 99%，成为手工定制领域领先品牌。" },
];

const VALUES = [
  { title: "慢工艺", desc: "我们信奉慢工出细活。每一只包都经过数百次手工缝线，不追求速度，只追求品质。" },
  { title: "好材料", desc: "甄选全球优质面料——江苏南通有机帆布、意大利托斯卡纳植鞣革、无铅黄铜五金。" },
  { title: "个性化", desc: "每一只包都是用户参与创作的结果。从面料到印记，每个选择都表达着你的态度。" },
  { title: "可持续", desc: "环保染料、可降解包装、耐用的品质设计——让每一只包都能陪伴你很多年。" },
];

export default function BrandStory({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-[#faf6f0] text-[#2c2416] font-sans antialiased overflow-x-hidden pt-28 pb-16 selection:bg-[#e8d5c4]">
      <div className="max-w-5xl mx-auto px-5 md:px-16">

        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[#8b7d6b] hover:text-[#c4956a] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </button>

        {/* Hero */}
        <div className="mb-16 max-w-3xl">
          <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#c4956a]">关于素织手作</span>
          <h1 className="font-serif-sc font-bold text-4xl sm:text-5xl text-[#2c2416] mt-3 leading-tight">
            用心做一只好包
          </h1>
          <p className="text-base text-[#8b7d6b] mt-4 leading-relaxed max-w-2xl">
            在一个追求快速生产的时代，我们选择慢下来——从江苏南通的传承织机到意大利托斯卡纳的植鞣工坊，
            每一份原料都亲自探访、甄选。因为一只好包不需要张扬的 Logo，它应该用质感说话。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#e8d5c4]/30">
              <div className="font-serif-sc font-bold text-3xl text-[#c4956a]">{s.num}</div>
              <div className="text-xs text-[#8b7d6b] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="mb-20">
          <h2 className="font-serif-sc font-bold text-2xl text-[#2c2416] mb-8">我们的故事</h2>
          <div className="space-y-6 text-sm text-[#8b7d6b] leading-relaxed max-w-3xl">
            <p className="indent-8">
              素织手作创立于雄安，源起于对「慢工艺」的执念。在一个追求快速生产的时代，我们选择慢下来——从江苏南通的传承织机到意大利托斯卡纳的植鞣工坊，每一份原料都亲自探访、甄选。
            </p>
            <p className="indent-8">
              我们相信，一只好包不需要张扬的 Logo。它应该用质感说话——帆布的经纬密度、皮革的油脂光泽、黄铜的温润手感，这些细节才是真正的奢侈。每一只素织手作的包，都承载着工匠数百次的手工缝线与反复打磨。
            </p>
            <p className="indent-8">
              更重要的是，我们希望你参与创作。从面料到印记，从颜色到配件——你做的每一个选择，都让这只包成为你的延伸。它不只是一只包，更是你对生活的态度。
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-serif-sc font-bold text-2xl text-[#2c2416] mb-8">发展历程</h2>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6 pb-8 relative last:pb-0">
                {/* Timeline line */}
                {i < MILESTONES.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#e8d5c4]" />
                )}
                {/* Dot */}
                <div className="relative z-10 mt-1">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    i === 0 ? "bg-[#c4956a] border-[#c4956a]" : "bg-white border-[#e8d5c4]"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-[#e8d5c4]"}`} />
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 -mt-1">
                  <div className="font-serif-sc font-bold text-lg text-[#c4956a]">{m.year}</div>
                  <h3 className="font-serif-sc font-semibold text-base text-[#2c2416] mt-0.5">{m.title}</h3>
                  <p className="text-sm text-[#8b7d6b] mt-1 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-serif-sc font-bold text-2xl text-[#2c2416] mb-8">品牌理念</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#e8d5c4]/30">
                <div className="font-serif-sc font-bold text-lg text-[#2c2416] mb-2">{v.title}</div>
                <p className="text-sm text-[#8b7d6b] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-[#e8d5c4]/30">
          <p className="text-sm text-[#8b7d6b] mb-4">想了解更多？开启你的定制之旅</p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-[#2c2416] text-[#faf6f0] px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#c4956a] transition-all"
          >
            开始定制
          </button>
        </div>
      </div>
    </div>
  );
}
