import { useState } from "react";
import { X } from "lucide-react";

interface FooterProps {
  onEnterBrand: () => void;
}

export default function Footer({ onEnterBrand }: FooterProps) {
  const [showShipping, setShowShipping] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
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
              <button onClick={onEnterBrand} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">定制流程</button>
              <button onClick={onEnterBrand} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">面料指南</button>
              <button onClick={() => setShowShipping(true)} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">配送说明</button>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4 className="font-sans font-bold text-xs text-[#e8d5c4] uppercase tracking-widest mb-1">关于</h4>
              <button onClick={onEnterBrand} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">品牌故事</button>
              <button onClick={() => setShowPrivacy(true)} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">隐私政策</button>
              <button onClick={() => setShowTerms(true)} className="text-sm text-[#e8d5c4]/60 hover:text-[#c4956a] transition-colors text-left">服务条款</button>
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

      {/* ── 配送说明 Modal ── */}
      {showShipping && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowShipping(false); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative animate-[modalIn_0.3s_ease]">
            <button onClick={() => setShowShipping(false)} className="absolute top-4 right-5 text-[#8b7d6b] hover:text-[#2c2416] transition-colors"><X className="w-5 h-5" /></button>
            <h2 className="font-serif-sc font-bold text-1.5xl text-[#2c2416] mb-1">配送说明</h2>
            <p className="text-sm text-[#8b7d6b] mb-6">关于定制包袋的配送时效与费用</p>
            <div className="space-y-5 text-sm">
              <div>
                <h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-2">配送时效</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-[#e8d5c4]/20">
                    <span className="text-[#8b7d6b]">基础款</span>
                    <span className="font-medium text-[#2c2416]">7-10 个工作日</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8d5c4]/20">
                    <span className="text-[#8b7d6b]">进阶款</span>
                    <span className="font-medium text-[#2c2416]">5-7 个工作日</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#e8d5c4]/20">
                    <span className="text-[#8b7d6b]">企业批量</span>
                    <span className="font-medium text-[#2c2416]">10-15 个工作日</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-2">配送范围</h4>
                <p className="text-[#8b7d6b] leading-relaxed">全国范围（含港澳台）均可配送。偏远地区可能延长 2-3 天。</p>
              </div>
              <div>
                <h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-2">配送费用</h4>
                <p className="text-[#8b7d6b] leading-relaxed">全国包邮。企业批量订单含税含运费，提供增值税发票。</p>
              </div>
              <div className="p-4 bg-[#f5f0e8] rounded-xl text-xs text-[#8b7d6b] leading-relaxed">
                <strong className="text-[#2c2416]">温馨提示：</strong>所有定制包袋均为手工制作，下单后即进入制作流程，不接受加急订单。
              </div>
            </div>
            <button onClick={() => setShowShipping(false)} className="w-full mt-8 py-3 rounded-full bg-[#2c2416] text-white font-medium text-sm hover:bg-[#c4956a] transition-all">知道了</button>
          </div>
        </div>
      )}

      {/* ── 隐私政策 Modal ── */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPrivacy(false); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative animate-[modalIn_0.3s_ease]">
            <button onClick={() => setShowPrivacy(false)} className="absolute top-4 right-5 text-[#8b7d6b] hover:text-[#2c2416] transition-colors"><X className="w-5 h-5" /></button>
            <h2 className="font-serif-sc font-bold text-1.5xl text-[#2c2416] mb-1">隐私政策</h2>
            <p className="text-sm text-[#8b7d6b] mb-6">我们如何收集、使用和保护你的个人信息</p>
            <div className="space-y-4 text-sm">
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">信息收集</h4><p className="text-[#8b7d6b] leading-relaxed">我们在你提交定制咨询或下单时收集必要的信息，包括姓名、联系方式、收货地址等。这些信息仅用于处理你的定制需求与订单配送。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">信息使用</h4><p className="text-[#8b7d6b] leading-relaxed">你的个人信息仅用于：处理定制咨询、完成订单交付、提供售后服务。我们不会将你的信息用于任何未经授权的商业用途。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">信息保护</h4><p className="text-[#8b7d6b] leading-relaxed">我们采用业界标准的安全措施保护你的个人信息。所有数据传输使用 SSL 加密。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">联系我们</h4><p className="text-[#8b7d6b] leading-relaxed">如对隐私政策有任何疑问，请通过微信 19322932086 与我们联系。</p></div>
              <p className="text-xs text-[#8b7d6b] mt-4">最后更新：2026 年 5 月</p>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="w-full mt-8 py-3 rounded-full bg-[#2c2416] text-white font-medium text-sm hover:bg-[#c4956a] transition-all">知道了</button>
          </div>
        </div>
      )}

      {/* ── 服务条款 Modal ── */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowTerms(false); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative animate-[modalIn_0.3s_ease]">
            <button onClick={() => setShowTerms(false)} className="absolute top-4 right-5 text-[#8b7d6b] hover:text-[#2c2416] transition-colors"><X className="w-5 h-5" /></button>
            <h2 className="font-serif-sc font-bold text-1.5xl text-[#2c2416] mb-1">服务条款</h2>
            <p className="text-sm text-[#8b7d6b] mb-6">使用素织手作定制服务即表示同意以下条款</p>
            <div className="space-y-4 text-sm">
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">定制服务</h4><p className="text-[#8b7d6b] leading-relaxed">我们提供手工帆布包定制服务，最终成品可能与设计图存在细微差异，这是手工制作的独特魅力所在。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">退换政策</h4><p className="text-[#8b7d6b] leading-relaxed">我们承诺 7 天无理由退换。如果产品与确认后的设计稿不符或有质量问题，我们免费重做或全额退款。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">知识产权</h4><p className="text-[#8b7d6b] leading-relaxed">用户上传的设计图案，其知识产权归用户所有。素织手作有权在征得用户同意后，将完成的作品用于品牌展示与推广。</p></div>
              <div><h4 className="font-serif-sc font-semibold text-base text-[#2c2416] mb-1">免责声明</h4><p className="text-[#8b7d6b] leading-relaxed">因不可抗力导致的交付延迟，我们不承担相应责任。我们会尽最大努力减少影响并及时通知客户。</p></div>
              <p className="text-xs text-[#8b7d6b] mt-4">最后更新：2026 年 5 月</p>
            </div>
            <button onClick={() => setShowTerms(false)} className="w-full mt-8 py-3 rounded-full bg-[#2c2416] text-white font-medium text-sm hover:bg-[#c4956a] transition-all">知道了</button>
          </div>
        </div>
      )}
    </>
  );
}
