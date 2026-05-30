import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Sliders, ShoppingBag, Eye, Heart, RotateCcw, Image as ImageIcon, Send, X, HelpCircle, Check, MapPin, Gift, Bookmark, ArrowRight } from "lucide-react";
import { BagConfiguration, SavedDesign, Message, CheckoutForm } from "../types";
import {
  CANVAS_MATERIALS,
  LEATHER_MATERIALS,
  HARDWARE_MATERIALS,
  BAG_SIZES,
  ATMOSPHERES,
  INITIAL_CONFIGURATION,
  BASE_PRICE
} from "../data";
import BagVisualizer from "./BagVisualizer";

export default function StudioPage() {
  const [config, setConfig] = useState<BagConfiguration>(INITIAL_CONFIGURATION);
  const [activeStep, setActiveStep] = useState<"size" | "canvas" | "leather" | "hardware" | "monogram" | "accessories">("size");

  // AI Stylist
  const [aiStylistReport, setAiStylistReport] = useState<{
    conceptName: string;
    stylingCritique: string;
    coordinateGuide: string;
    heritageNarrative: string;
  } | null>(null);
  const [isConsultingStylist, setIsConsultingStylist] = useState(false);

  // AI Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "欢迎来到素织手作的设计工作室。我是你的私人造型顾问，关于面料选择、色彩搭配或风格建议，随时问我。",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Saved designs
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [designNameInput, setDesignNameInput] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "中国",
    cardNumber: "4000 1234 5678 9010",
    cardExpiry: "08/29",
    cardCvc: "852"
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const saved = localStorage.getItem("my_bag_studio_designs");
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultCommunity: SavedDesign[] = [
        {
          id: "design-1",
          name: "京都森林",
          config: {
            ...INITIAL_CONFIGURATION,
            canvas: CANVAS_MATERIALS[1],
            leather: LEATHER_MATERIALS[0],
            hardware: HARDWARE_MATERIALS[0],
          },
          createdAt: "2026-05-28",
          likes: 24
        },
        {
          id: "design-2",
          name: "月光石白",
          config: {
            ...INITIAL_CONFIGURATION,
            canvas: CANVAS_MATERIALS[0],
            leather: LEATHER_MATERIALS[3],
            hardware: HARDWARE_MATERIALS[1],
          },
          createdAt: "2026-05-29",
          likes: 18
        }
      ];
      setSavedDesigns(defaultCommunity);
      localStorage.setItem("my_bag_studio_designs", JSON.stringify(defaultCommunity));
    }
    consultStylist(INITIAL_CONFIGURATION);
  }, []);

  const calculateTotalPrice = () => {
    let price = BASE_PRICE;
    price += config.size.additionalPrice;
    if (config.shoulderStrap) price += 45;
    if (config.keyClasp) price += 25;
    if (config.dustBag) price += 15;
    return price;
  };

  const consultStylist = async (activeConfig: BagConfiguration) => {
    setIsConsultingStylist(true);
    try {
      const response = await fetch("/api/gemini/suggest-stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeConfig)
      });
      if (response.ok) {
        const data = await response.json();
        setAiStylistReport(data);
      } else {
        throw new Error("造型师 API 返回错误");
      }
    } catch (e) {
      console.error(e);
      setAiStylistReport({
        conceptName: `${activeConfig.canvas.name} · ${activeConfig.leather.name}`,
        stylingCritique: `温润极致的材质组合。${activeConfig.canvas.name}的低张力织物质感与${activeConfig.leather.name}的植鞣革面柔和相映，整体呈现高级、纯净而温暖的手工质感。`,
        coordinateGuide: `建议搭配：米白色亚麻风衣、原色真丝衬衫、深灰宽腿西裤或羊毛分趾靴。简约中不失细节。`,
        heritageNarrative: `这只包将陪伴你走过清晨的静谧街道。当晨光洒在${activeConfig.hardware.name}五金件的缎面光泽上，你留下的印记在皮革上闪烁着属于自己的光芒。一件承载个人表达的随身之物。`
      });
    } finally {
      setIsConsultingStylist(false);
    }
  };

  const sendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!presetText) setChatInput("");
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          activeBag: config
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error(e);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: `${config.canvas.name}与${config.leather.name}的组合非常出色。我们采用的南通帆布以低张力纺织工艺编织，经过多年日常使用会逐渐柔软贴合，呈现独一无二的个人质感。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const loadPresetStyle = (preset: "eco" | "wanderer" | "stealth" | "sunset") => {
    let pConfig: BagConfiguration;

    if (preset === "eco") {
      pConfig = {
        ...config,
        canvas: CANVAS_MATERIALS[0],
        leather: LEATHER_MATERIALS[3],
        hardware: HARDWARE_MATERIALS[0],
        size: BAG_SIZES[0]
      };
    } else if (preset === "wanderer") {
      pConfig = {
        ...config,
        canvas: CANVAS_MATERIALS[1],
        leather: LEATHER_MATERIALS[0],
        hardware: HARDWARE_MATERIALS[0],
        size: BAG_SIZES[1]
      };
    } else if (preset === "stealth") {
      pConfig = {
        ...config,
        canvas: CANVAS_MATERIALS[2],
        leather: LEATHER_MATERIALS[2],
        hardware: HARDWARE_MATERIALS[2],
        size: BAG_SIZES[1]
      };
    } else {
      pConfig = {
        ...config,
        canvas: CANVAS_MATERIALS[3],
        leather: LEATHER_MATERIALS[1],
        hardware: HARDWARE_MATERIALS[1],
        size: BAG_SIZES[2]
      };
    }

    setConfig(pConfig);
    consultStylist(pConfig);
  };

  const saveDesignToGallery = () => {
    if (!designNameInput.trim()) return;

    const newDesign: SavedDesign = {
      id: "design-" + Date.now(),
      name: designNameInput,
      config: config,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1
    };

    const updated = [newDesign, ...savedDesigns];
    setSavedDesigns(updated);
    localStorage.setItem("my_bag_studio_designs", JSON.stringify(updated));
    setDesignNameInput("");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const deleteSavedDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem("my_bag_studio_designs", JSON.stringify(updated));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<CheckoutForm> = {};
    if (!checkoutForm.fullName.trim()) errors.fullName = "请输入收件人姓名";
    if (!checkoutForm.email.includes("@")) errors.email = "请输入有效邮箱";
    if (!checkoutForm.address.trim()) errors.address = "请输入收货地址";
    if (!checkoutForm.city.trim()) errors.city = "请输入城市";
    if (!checkoutForm.postalCode.trim()) errors.postalCode = "请输入邮编";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setOrderConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] pt-24 pb-16 px-4 md:px-12 max-w-7xl mx-auto selection:bg-[#e8d5c4]">
      {/* Studio Header */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#e8d5c4]/30 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c4956a]">私人订制工作室</span>
          <h1 className="font-serif-sc font-bold text-3xl text-[#2c2416] mt-1">设计工作室</h1>
        </div>

        {/* Preset styles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#8b7d6b] mr-1">预设风格:</span>
          <button
            onClick={() => loadPresetStyle("eco")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-[#e8d5c4]/40 bg-white hover:bg-[#f5f0e8] font-medium transition-all"
          >
            自然纯粹
          </button>
          <button
            onClick={() => loadPresetStyle("wanderer")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-[#e8d5c4]/40 bg-white hover:bg-[#f5f0e8] font-medium transition-all"
          >
            森林漫游
          </button>
          <button
            onClick={() => loadPresetStyle("stealth")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-[#e8d5c4]/40 bg-white hover:bg-[#f5f0e8] font-medium transition-all"
          >
            暗夜黑曜
          </button>
          <button
            onClick={() => loadPresetStyle("sunset")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-[#e8d5c4]/40 bg-white hover:bg-[#f5f0e8] font-medium transition-all"
          >
            落日画廊
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT: Bag Visualizer + AI Stylist */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-[100px]">
          {/* Visualizer */}
          <div className="bg-[#f5f0e8]/40 rounded-3xl border border-[#e8d5c4]/30 p-5 shadow-sm overflow-hidden flex flex-col">
            <div className="aspect-square w-full relative">
              <BagVisualizer config={config} />

              <button
                onClick={() => {
                  setConfig(INITIAL_CONFIGURATION);
                  consultStylist(INITIAL_CONFIGURATION);
                }}
                className="absolute top-4 left-4 p-2 bg-[#faf6f0]/80 backdrop-blur rounded-full border border-[#e8d5c4]/20 hover:bg-white transition-all shadow-xs"
                title="重置"
              >
                <RotateCcw className="w-4 h-4 text-[#8b7d6b]" />
              </button>

              <div className="absolute top-4 right-4 bg-[#2c2416] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                {config.size.name}
              </div>
            </div>

            {/* Atmosphere */}
            <div className="border-t border-[#e8d5c4]/30 pt-4 mt-4 flex justify-between items-center bg-white/30 backdrop-blur-xs p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7d6b] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#c4956a]" /> 氛围灯光
              </span>
              <div className="flex gap-1">
                {ATMOSPHERES.map((atm) => (
                  <button
                    key={atm.id}
                    onClick={() => setConfig({ ...config, atmosphere: atm })}
                    className={`text-[11px] font-medium px-3 py-1 rounded-full transition-all ${
                      config.atmosphere.id === atm.id
                        ? "bg-[#2c2416] text-[#faf6f0] font-semibold"
                        : "bg-white/50 text-[#8b7d6b] hover:bg-[#e8d5c4]/40"
                    }`}
                  >
                    {atm.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Stylist Panel */}
          <div className="relative bg-[#f5f0e8] rounded-3xl p-6 border-l-4 border-[#c4956a] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#c4956a] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c4956a]" />
                AI 造型顾问
              </span>

              <button
                onClick={() => consultStylist(config)}
                disabled={isConsultingStylist}
                className="text-[10px] uppercase tracking-wider bg-[#2c2416] text-white py-1 px-3 rounded-full hover:bg-[#8b7d6b] disabled:opacity-50 transition-all font-semibold"
              >
                {isConsultingStylist ? "分析中..." : "刷新报告"}
              </button>
            </div>

            {isConsultingStylist ? (
              <div className="py-8 space-y-3 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 border-2 border-[#c4956a]/30 border-t-[#c4956a] rounded-full animate-spin" />
                <p className="font-serif italic text-sm text-[#8b7d6b]">造型师正在研究面料与色彩...</p>
              </div>
            ) : aiStylistReport ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif-sc font-bold text-lg text-[#2c2416]">
                    「{aiStylistReport.conceptName}」
                  </h3>
                  <p className="text-[10px] text-[#8b7d6b] uppercase tracking-widest mt-1">概念命名</p>
                </div>

                <div className="w-full h-[1px] bg-[#e8d5c4]/40" />

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b7d6b]">设计师点评:</span>
                  <p className="text-xs text-[#2c2416] leading-relaxed">{aiStylistReport.stylingCritique}</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-white/40 border border-[#e8d5c4]/10">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#c4956a]">搭配建议:</span>
                  <p className="text-xs text-[#2c2416] leading-relaxed">{aiStylistReport.coordinateGuide}</p>
                </div>

                <div className="pt-2 bg-[#e8d5c4]/30 p-3.5 rounded-xl border-t border-dashed border-[#e8d5c4]/50">
                  <p className="font-serif italic text-[11px] text-[#8b7d6b] leading-relaxed">
                    {aiStylistReport.heritageNarrative}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#8b7d6b]">
                点击「刷新报告」获取 AI 造型顾问的风格建议
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Configuration panels */}
        <div className="lg:col-span-7 space-y-6">

          {/* Tab navigation */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 shadow-xs bg-[#f5f0e8] p-1.5 rounded-full border border-[#e8d5c4]/35">
            {[
              { id: "size", label: "尺寸" },
              { id: "canvas", label: "帆布" },
              { id: "leather", label: "皮革" },
              { id: "hardware", label: "五金" },
              { id: "monogram", label: "印记" },
              { id: "accessories", label: "配件" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id as any)}
                className={`text-[11px] font-medium py-2 rounded-full transition-all text-center ${
                  activeStep === tab.id
                    ? "bg-[#2c2416] text-[#faf6f0] font-bold shadow-xs"
                    : "text-[#8b7d6b] hover:text-[#2c2416]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-[#faf6f0] rounded-3xl border border-[#e8d5c4]/40 p-6 sm:p-8 space-y-6 shadow-xs">

            {/* STEP 1: Size */}
            {activeStep === "size" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第一步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">选择尺寸</h2>
                  <p className="text-xs text-[#8b7d6b]">根据你的日常需求，选择最适合的包型尺寸</p>
                </div>

                <div className="space-y-4">
                  {BAG_SIZES.map((bagSize) => (
                    <div
                      key={bagSize.id}
                      onClick={() => {
                        const newConfig = { ...config, size: bagSize };
                        setConfig(newConfig);
                        consultStylist(newConfig);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start ${
                        config.size.id === bagSize.id
                          ? "border-[#2c2416] bg-[#f5f0e8]/30 shadow-xs"
                          : "border-[#e8d5c4]/30 hover:border-[#8b7d6b] bg-white/20"
                      }`}
                    >
                      <div className="space-y-2 max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-0.5 ${
                            config.size.id === bagSize.id ? "border-[#2c2416] bg-[#2c2416]" : "border-[#e8d5c4]"
                          }`}>
                            {config.size.id === bagSize.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <h3 className="font-serif-sc font-semibold text-sm text-[#2c2416]">{bagSize.name}</h3>
                        </div>
                        <p className="text-xs text-[#8b7d6b] leading-relaxed">{bagSize.description}</p>
                        <div className="text-[10px] text-[#8b7d6b] tracking-wider">尺寸: {bagSize.dimensions}</div>
                      </div>

                      <div className="text-right pl-4">
                        <span className="text-xs font-semibold text-[#2c2416]">
                          {bagSize.additionalPrice === 0 ? "标准" : `+¥${bagSize.additionalPrice}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Canvas */}
            {activeStep === "canvas" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第二步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">选择帆布面料</h2>
                  <p className="text-xs text-[#8b7d6b]">甄选江苏南通直供认证帆布，低张力纺织工艺</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {CANVAS_MATERIALS.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => {
                        const newConfig = { ...config, canvas: mat };
                        setConfig(newConfig);
                        consultStylist(newConfig);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 ${
                        config.canvas.id === mat.id
                          ? "border-[#2c2416] bg-[#f5f0e8]/30 shadow-xs"
                          : "border-[#e8d5c4]/30 hover:border-[#8b7d6b] bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: mat.color }}
                          />
                          <span className="text-xs font-semibold text-[#2c2416]">{mat.name}</span>
                        </div>
                        {config.canvas.id === mat.id && (
                          <span className="w-2 h-2 rounded-full bg-[#c4956a]" />
                        )}
                      </div>

                      <p className="text-[11px] text-[#8b7d6b] leading-relaxed line-clamp-2">{mat.description}</p>
                      <div className="text-[9px] uppercase tracking-wider text-[#8b7d6b] font-semibold mt-auto flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#c4956a]" /> {mat.origin}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#e8d5c4]/30 border border-[#e8d5c4]/20 flex items-center gap-4">
                  <img
                    alt="帆布细节"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-[#e8d5c4]/40"
                    src={config.canvas.imageUrl}
                  />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2c2416]">南通织机 · 帆布细节</h5>
                    <p className="text-xs text-[#8b7d6b] mt-1 leading-relaxed">{config.canvas.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Leather */}
            {activeStep === "leather" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第三步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">选择皮革配件</h2>
                  <p className="text-xs text-[#8b7d6b]">意大利托斯卡纳全粒面植鞣革，天然板栗与橡木提取物慢鞣</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {LEATHER_MATERIALS.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => {
                        const newConfig = { ...config, leather: mat };
                        setConfig(newConfig);
                        consultStylist(newConfig);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 ${
                        config.leather.id === mat.id
                          ? "border-[#2c2416] bg-[#f5f0e8]/30 shadow-xs"
                          : "border-[#e8d5c4]/30 hover:border-[#8b7d6b] bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: mat.color }}
                          />
                          <span className="text-xs font-semibold text-[#2c2416]">{mat.name}</span>
                        </div>
                        {config.leather.id === mat.id && (
                          <span className="w-2 h-2 rounded-full bg-[#c4956a]" />
                        )}
                      </div>

                      <p className="text-[11px] text-[#8b7d6b] leading-relaxed line-clamp-2">{mat.description}</p>
                      <div className="text-[9px] uppercase tracking-wider text-[#8b7d6b] font-semibold mt-auto flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#c4956a]" /> {mat.origin}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#e8d5c4]/30 border border-[#e8d5c4]/20 flex items-center gap-4">
                  <img
                    alt="皮革细节"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-[#e8d5c4]/40"
                    src={config.leather.imageUrl}
                  />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#2c2416]">托斯卡纳 · 皮革肌理</h5>
                    <p className="text-xs text-[#8b7d6b] mt-1 leading-relaxed">{config.leather.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Hardware */}
            {activeStep === "hardware" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第四步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">选择五金配件</h2>
                  <p className="text-xs text-[#8b7d6b]">纯砂铸黄铜五金，手工拉丝处理，抗氧化保护</p>
                </div>

                <div className="space-y-4">
                  {HARDWARE_MATERIALS.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => {
                        const newConfig = { ...config, hardware: mat };
                        setConfig(newConfig);
                        consultStylist(newConfig);
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        config.hardware.id === mat.id
                          ? "border-[#2c2416] bg-[#f5f0e8]/30 shadow-xs"
                          : "border-[#e8d5c4]/30 hover:border-[#8b7d6b] bg-white"
                      }`}
                    >
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full border bg-gradient-to-r ${mat.textureClass} shadow-xs`}
                          />
                          <h3 className="text-sm font-semibold text-[#2c2416]">{mat.name}</h3>
                        </div>
                        <p className="text-xs text-[#8b7d6b] leading-relaxed">{mat.description}</p>
                      </div>

                      {config.hardware.id === mat.id && (
                        <span className="w-5 h-5 rounded-full bg-[#2c2416] text-[#faf6f0] flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Monogram */}
            {activeStep === "monogram" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第五步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">个性印记</h2>
                  <p className="text-xs text-[#8b7d6b]">烫金或压印你的专属印记，让包包真正属于你</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4.5 rounded-2xl bg-[#f5f0e8] border border-[#e8d5c4]/20">
                  {/* Text input */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8b7d6b]">印记文字</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={config.monogram.text}
                      onChange={(e) => setConfig({
                        ...config,
                        monogram: { ...config.monogram, text: e.target.value }
                      })}
                      placeholder="例如: 素织"
                      className="w-full bg-white text-sm font-semibold text-[#2c2416] border-b-2 border-[#e8d5c4] focus:border-[#2c2416] py-2 px-3 focus:outline-none focus:ring-0 transition-all"
                    />
                    <p className="text-[9px] text-[#8b7d6b]">最多4个字符</p>
                  </div>

                  {/* Position */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-[#8b7d6b]">印记位置</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConfig({
                          ...config,
                          monogram: { ...config.monogram, position: "Pocket Center" }
                        })}
                        className={`text-xs py-2 rounded-lg border transition-all font-semibold ${
                          config.monogram.position === "Pocket Center"
                            ? "bg-[#2c2416] text-[#faf6f0] border-transparent"
                            : "bg-white text-[#8b7d6b] border-[#e8d5c4]/40"
                        }`}
                      >
                        口袋中央
                      </button>
                      <button
                        onClick={() => setConfig({
                          ...config,
                          monogram: { ...config.monogram, position: "Leather Tag" }
                        })}
                        className={`text-xs py-2 rounded-lg border transition-all font-semibold ${
                          config.monogram.position === "Leather Tag"
                            ? "bg-[#2c2416] text-[#faf6f0] border-transparent"
                            : "bg-white text-[#8b7d6b] border-[#e8d5c4]/40"
                        }`}
                      >
                        皮革吊牌
                      </button>
                    </div>
                  </div>
                </div>

                {/* Font & Finish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8b7d6b]">字体风格</span>
                    <div className="flex gap-2">
                      {[{ id: "Serif", label: "衬线" }, { id: "Sans", label: "无衬线" }, { id: "Mono", label: "等宽" }].map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setConfig({
                            ...config,
                            monogram: { ...config.monogram, font: font.id as any }
                          })}
                          className={`flex-1 py-3.5 px-2 rounded-xl border text-center transition-all ${
                            config.monogram.font === font.id
                              ? "bg-white border-[#2c2416] text-[#2c2416] font-bold shadow-xs"
                              : "bg-[#e8d5c4]/20 border-[#e8d5c4]/30 text-[#8b7d6b]"
                          }`}
                        >
                          <span className={`text-base block mb-0.5 ${
                            font.id === "Serif" ? "font-serif font-extrabold" : font.id === "Sans" ? "font-sans font-black" : "font-mono"
                          }`}>
                            {font.id === "Serif" ? "素" : font.id === "Sans" ? "素" : "素"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider">{font.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8b7d6b]">烫金工艺</span>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "Gold Foil", label: "24K 黄金烫印" },
                        { id: "Silver Foil", label: "铂金白银烫印" },
                        { id: "Debossed", label: "皮革压印" }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setConfig({
                            ...config,
                            monogram: { ...config.monogram, style: style.id as any }
                          })}
                          className={`text-xs p-3.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            config.monogram.style === style.id
                              ? "bg-white border-[#2c2416] text-[#2c2416] font-bold shadow-xs"
                              : "bg-[#e8d5c4]/20 border-[#e8d5c4]/30 text-[#8b7d6b]"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full border ${
                            style.id === "Gold Foil" ? "bg-gradient-to-r from-[#ffe8a3] to-[#cc9d3d]" : style.id === "Silver Foil" ? "bg-gradient-to-r from-[#eaeaea] to-[#a0a0a0]" : "bg-[#8b7355]"
                          }`} />
                          <span className="text-[11px]">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Accessories */}
            {activeStep === "accessories" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c4956a]">第六步</span>
                  <h2 className="font-serif-sc font-bold text-xl text-[#2c2416]">配件与包装</h2>
                  <p className="text-xs text-[#8b7d6b]">为你的定制包款添加实用配件与精美包装</p>
                </div>

                <div className="space-y-4">
                  <div
                    onClick={() => setConfig({ ...config, shoulderStrap: !config.shoulderStrap })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      config.shoulderStrap
                        ? "border-[#2c2416] bg-[#f5f0e8]/20"
                        : "border-[#e8d5c4]/35 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          config.shoulderStrap ? "bg-[#2c2416] text-white" : "border-[#e8d5c4]"
                        }`}>
                          {config.shoulderStrap && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <h4 className="text-sm font-semibold text-[#2c2416]">可拆卸皮革肩带</h4>
                      </div>
                      <p className="text-xs text-[#8b7d6b] pl-6 max-w-sm">4.0cm 宽托斯卡纳植鞣革，可调节长度，适合斜挎</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2c2416]">+¥45</span>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, keyClasp: !config.keyClasp })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      config.keyClasp
                        ? "border-[#2c2416] bg-[#f5f0e8]/20"
                        : "border-[#e8d5c4]/35 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          config.keyClasp ? "bg-[#2c2416] text-white" : "border-[#e8d5c4]"
                        }`}>
                          {config.keyClasp && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <h4 className="text-sm font-semibold text-[#2c2416]">黄铜钥匙扣</h4>
                      </div>
                      <p className="text-xs text-[#8b7d6b] pl-6 max-w-sm">实心铸铜龙虾扣，连接包侧铆钉，安全挂放钥匙</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2c2416]">+¥25</span>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, dustBag: !config.dustBag })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      config.dustBag
                        ? "border-[#2c2416] bg-[#f5f0e8]/20"
                        : "border-[#e8d5c4]/35 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          config.dustBag ? "bg-[#2c2416] text-white" : "border-[#e8d5c4]"
                        }`}>
                          {config.dustBag && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <h4 className="text-sm font-semibold text-[#2c2416]">有机棉防尘袋套装</h4>
                      </div>
                      <p className="text-xs text-[#8b7d6b] pl-6 max-w-sm">认证有机棉储存袋，附赠橄榄油皮革保养蜡</p>
                    </div>
                    <span className="text-xs font-semibold text-[#2c2416]">+¥15</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Save Panel */}
          <div className="bg-[#2c2416] text-[#faf6f0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-[#c4956a] font-bold">合计</h3>
                <h4 className="font-serif-sc font-bold text-2xl text-[#faf6f0] mt-1">{config.size.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold font-sans text-[#faf6f0]">¥{calculateTotalPrice()}</span>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">含全球配送</p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-wider text-white/60">保存方案</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    onChange={(e) => setDesignNameInput(e.target.value)}
                    value={designNameInput}
                    placeholder="例如: 京都落日"
                    className="flex-1 bg-white/5 text-xs text-white border border-white/20 rounded-xl px-3 py-2 focus:outline-none focus:border-[#c4956a] transition-all"
                  />
                  <button
                    onClick={saveDesignToGallery}
                    className="p-2.5 bg-[#e8d5c4] text-[#2c2416] rounded-xl hover:bg-white active:scale-95 transition-all text-xs font-bold"
                  >
                    保存
                  </button>
                </div>
                {showSaveSuccess && (
                  <p className="text-[10px] text-[#c4956a] animate-pulse">已保存到作品集！</p>
                )}
              </div>

              <div className="flex items-end justify-end">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#c4956a] hover:bg-[#c4956a]/90 active:scale-95 transition-all text-[#2c2416] font-bold text-xs uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  下单定制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Designs Gallery */}
      <section className="mt-20 border-t border-[#e8d5c4]/30 pt-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#c4956a]">我的作品集</span>
            <h2 className="font-serif-sc font-bold text-2xl text-[#2c2416] mt-1">保存的设计方案</h2>
          </div>
          <span className="text-xs text-[#8b7d6b]">{savedDesigns.length} 个方案</span>
        </div>

        {savedDesigns.length === 0 ? (
          <div className="text-center py-12 p-8 border-2 border-dashed border-[#e8d5c4]/30 rounded-3xl bg-white/20">
            <span className="font-serif-sc font-bold text-lg block mb-2 text-[#8b7d6b]">暂无保存方案</span>
            <p className="text-xs text-[#8b7d6b] max-w-xs mx-auto">配置你的专属帆布包，输入方案名称并点击「保存」</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedDesigns.map((design) => (
              <div
                key={design.id}
                onClick={() => {
                  setConfig(design.config);
                  consultStylist(design.config);
                }}
                className={`bg-white hover:bg-[#f5f0e8]/30 rounded-2xl border p-4.5 transition-all cursor-pointer flex flex-col gap-4 relative group ${
                  config.canvas.id === design.config.canvas.id &&
                  config.leather.id === design.config.leather.id &&
                  config.size.id === design.config.size.id
                    ? "border-[#2c2416] shadow-xs ring-2 ring-[#2c2416]/10"
                    : "border-[#e8d5c4]/25 shadow-xs"
                }`}
              >
                <div className="aspect-square w-full rounded-xl bg-[#e8d5c4]/30 relative overflow-hidden flex items-center justify-center">
                  <BagVisualizer config={design.config} />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-white bg-[#2c2416] px-3 py-1.5 rounded-full tracking-wider shadow-md">
                      加载方案
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-[#2c2416] truncate pr-4">{design.name}</h3>
                    <button
                      onClick={(e) => deleteSavedDesign(design.id, e)}
                      className="p-1 px-2 hover:bg-[#ffdad6] hover:text-red-600 rounded-md text-[10px] text-[#8b7d6b] transition-all font-semibold"
                      title="删除"
                    >
                      删除
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8b7d6b] leading-tight">
                    {design.config.canvas.name} · {design.config.leather.name} · {design.config.size.name}
                  </p>
                  <div className="text-[9px] text-[#e8d5c4] mt-1">保存于: {design.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating AI Chat */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${chatOpen ? "w-[340px] sm:w-[380px]" : "w-14 h-14"}`}>
        {chatOpen ? (
          <div className="bg-white rounded-3xl shadow-2xl border border-[#e8d5c4]/30 flex flex-col h-[500px] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Chat header */}
            <div className="bg-[#2c2416] text-white p-4.5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c4956a] text-[#faf6f0] flex items-center justify-center font-bold font-serif-sc text-sm">
                  素
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">AI 造型顾问</h3>
                  <p className="text-[9px] text-[#c4956a] uppercase tracking-wider font-semibold">在线</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf6f0]">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#2c2416] text-[#faf6f0] rounded-tr-none"
                      : "bg-white text-[#2c2416] rounded-tl-none border border-[#e8d5c4]/25"
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-[#8b7d6b] mt-1 pl-1 pr-1">{m.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 bg-white/60 py-2.5 px-3.5 rounded-2xl rounded-tl-none border border-[#e8d5c4]/20 w-16">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c2416] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c2416] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c2416] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="p-2 border-t border-[#e8d5c4]/20 bg-white/80 overflow-x-auto flex gap-1.5 no-scrollbar">
              <button
                onClick={() => sendChatMessage("南通帆布有什么特别之处？")}
                className="text-[10px] shrink-0 border border-[#e8d5c4]/40 bg-[#faf6f0] hover:bg-[#e8d5c4]/40 px-3 py-1 rounded-full text-[#8b7d6b] font-sans transition-all"
              >
                帆布工艺
              </button>
              <button
                onClick={() => sendChatMessage("托斯卡纳植鞣革的制作工艺？")}
                className="text-[10px] shrink-0 border border-[#e8d5c4]/40 bg-[#faf6f0] hover:bg-[#e8d5c4]/40 px-3 py-1 rounded-full text-[#8b7d6b] font-sans transition-all"
              >
                皮革鞣制
              </button>
              <button
                onClick={() => sendChatMessage("这个配色适合什么风格的穿搭？")}
                className="text-[10px] shrink-0 border border-[#e8d5c4]/40 bg-[#faf6f0] hover:bg-[#e8d5c4]/40 px-3 py-1 rounded-full text-[#8b7d6b] font-sans transition-all"
              >
                搭配建议
              </button>
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-[#e8d5c4]/20 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendChatMessage();
                }}
                placeholder="输入你的问题..."
                className="flex-1 bg-[#faf6f0] border border-[#e8d5c4]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2c2416]"
              />
              <button
                onClick={() => sendChatMessage()}
                className="p-2 bg-[#2c2416] text-[#faf6f0] rounded-xl hover:bg-[#8b7d6b] transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-[#2c2416] text-white rounded-full flex items-center justify-center hover:bg-[#c4956a] active:scale-95 transition-all shadow-2xl relative cursor-pointer"
            title="AI 造型顾问"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </button>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#2c2416]/25 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#faf6f0] rounded-3xl max-w-2xl w-full border border-[#e8d5c4]/30 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] animate-in zoom-in-95 duration-300">

            {/* Left: Order summary */}
            <div className="w-full md:w-5/12 bg-[#f5f0e8] p-6 text-[#2c2416] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e8d5c4]/40">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#c4956a] block">你的定制</span>
                  <h3 className="font-serif-sc font-bold text-xl text-[#2c2416] mt-1">定制清单</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8b7d6b]">基础价格 ({config.size.name}):</span>
                    <span className="font-semibold">¥{BASE_PRICE + config.size.additionalPrice}</span>
                  </div>

                  <div className="flex justify-between items-center text-[#8b7d6b]">
                    <span>• {config.canvas.name}:</span>
                    <span>标准</span>
                  </div>

                  <div className="flex justify-between items-center text-[#8b7d6b]">
                    <span>• {config.leather.name}:</span>
                    <span>标准</span>
                  </div>

                  {config.monogram.text.trim() && (
                    <div className="flex justify-between items-center text-[#8b7d6b]">
                      <span>• 印记 "{config.monogram.text}":</span>
                      <span className="font-medium text-[#c4956a]">已含</span>
                    </div>
                  )}

                  {config.shoulderStrap && (
                    <div className="flex justify-between items-center text-[#8b7d6b]">
                      <span>• 可拆卸皮革肩带:</span>
                      <span>+¥45</span>
                    </div>
                  )}

                  {config.keyClasp && (
                    <div className="flex justify-between items-center text-[#8b7d6b]">
                      <span>• 黄铜钥匙扣:</span>
                      <span>+¥25</span>
                    </div>
                  )}

                  {config.dustBag && (
                    <div className="flex justify-between items-center text-[#8b7d6b]">
                      <span>• 防尘袋套装:</span>
                      <span>+¥15</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#e8d5c4]/30 space-y-2 mt-4 md:mt-0">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#8b7d6b]">总计</span>
                  <span className="text-3xl font-bold font-sans text-[#2c2416]">¥{calculateTotalPrice()}</span>
                </div>
                <div className="text-[10px] text-green-700 font-semibold uppercase tracking-wider">免运费 · 14天全球配送</div>
              </div>
            </div>

            {/* Right: Checkout form */}
            <div className="w-full md:w-7/12 p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-sans font-bold uppercase tracking-wider text-[#2c2416]">结算</h3>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderConfirmed(false);
                  }}
                  className="p-1 hover:bg-[#f5f0e8] rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-[#8b7d6b]" />
                </button>
              </div>

              {orderConfirmed ? (
                <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-green-100 text-[#c4956a] rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif-sc font-bold text-xl text-[#2c2416]">下单成功！</h4>
                    <p className="text-xs text-[#8b7d6b] leading-relaxed max-w-sm mx-auto">
                      感谢你的定制。我们将把设计方案和制作进度更新发送至 <strong>{checkoutForm.email}</strong>。
                    </p>
                  </div>
                  <div className="p-4 bg-[#f5f0e8] text-left rounded-2xl border border-[#e8d5c4]/20 shadow-xs space-y-1">
                    <div className="text-[10px] font-bold text-[#8b7d6b] uppercase">订单编号</div>
                    <div className="text-xs font-mono font-bold text-[#2c2416]">MBS-2026-{Date.now().toString().slice(-6)}</div>
                    <div className="text-[9px] text-[#8b7d6b] pt-1 leading-tight">将在 48 小时内开始制作</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderConfirmed(false);
                    }}
                    className="bg-[#2c2416] text-white px-6 py-2.5 rounded-full font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#8b7d6b] transition-colors"
                  >
                    完成
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">收件人</label>
                    <input
                      type="text"
                      value={checkoutForm.fullName}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                      placeholder="例如: 张三"
                      className="w-full bg-transparent border-b border-[#e8d5c4] focus:border-[#2c2416] p-1.5 focus:outline-none text-xs text-[#2c2416] focus:ring-0 transition-all font-semibold"
                    />
                    {formErrors.fullName && <p className="text-[10px] text-red-600">{formErrors.fullName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">邮箱</label>
                    <input
                      type="email"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full bg-transparent border-b border-[#e8d5c4] focus:border-[#2c2416] p-1.5 focus:outline-none text-xs text-[#2c2416] focus:ring-0 transition-all font-semibold"
                    />
                    {formErrors.email && <p className="text-[10px] text-red-600">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">收货地址</label>
                    <input
                      type="text"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      placeholder="详细地址"
                      className="w-full bg-transparent border-b border-[#e8d5c4] focus:border-[#2c2416] p-1.5 focus:outline-none text-xs text-[#2c2416] focus:ring-0 transition-all font-semibold"
                    />
                    {formErrors.address && <p className="text-[10px] text-red-600">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">城市</label>
                      <input
                        type="text"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        placeholder="例如: 北京"
                        className="w-full bg-transparent border-b border-[#e8d5c4] focus:border-[#2c2416] p-1.5 focus:outline-none text-xs text-[#2c2416] focus:ring-0 transition-all font-semibold"
                      />
                      {formErrors.city && <p className="text-[10px] text-red-600">{formErrors.city}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">邮编</label>
                      <input
                        type="text"
                        value={checkoutForm.postalCode}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
                        placeholder="例如: 100000"
                        className="w-full bg-transparent border-b border-[#e8d5c4] focus:border-[#2c2416] p-1.5 focus:outline-none text-xs text-[#2c2416] focus:ring-0 transition-all font-semibold"
                      />
                      {formErrors.postalCode && <p className="text-[10px] text-red-600">{formErrors.postalCode}</p>}
                    </div>
                  </div>

                  {/* Payment card */}
                  <div className="bg-[#f5f0e8] p-4.5 rounded-2xl space-y-3.5 border border-[#e8d5c4]/30">
                    <span className="block text-[10px] uppercase tracking-wider text-[#8b7d6b] font-bold">模拟支付信息</span>

                    <div className="space-y-1">
                      <input
                        type="text"
                        value={checkoutForm.cardNumber}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardNumber: e.target.value })}
                        className="w-full bg-white rounded-lg p-2 text-xs border border-[#e8d5c4]/40 focus:outline-none focus:border-[#2c2416] font-mono font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={checkoutForm.cardExpiry}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardExpiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full bg-white rounded-lg p-2 text-xs border border-[#e8d5c4]/40 focus:outline-none focus:border-[#2c2416] font-mono text-center font-semibold"
                      />
                      <input
                        type="password"
                        value={checkoutForm.cardCvc}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardCvc: e.target.value })}
                        placeholder="CVC"
                        className="w-full bg-white rounded-lg p-2 text-xs border border-[#e8d5c4]/40 focus:outline-none focus:border-[#2c2416] font-mono text-center font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2c2416] text-white hover:bg-[#8b7d6b] font-sans font-semibold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    确认下单
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
