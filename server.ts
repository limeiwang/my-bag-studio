import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize server-side Gemini client
const geminiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Gemini API client initialized successfully.");
} else {
  console.log("WARN: GEMINI_API_KEY is not defined. AI components will run in simulated mode.");
}

// API Route 1: Dynamic Stylist Analysis & Naming
app.post("/api/gemini/suggest-stylist", async (req: Request, res: Response): Promise<void> => {
  try {
    const { canvas, leather, hardware, size, monogram } = req.body;

    if (!canvas || !leather || !hardware) {
      res.status(400).json({ error: "缺少必要的包袋配置信息。" });
      return;
    }

    const bagConfigDescription = `
      - 帆布材质与颜色: ${canvas.name} (${canvas.color})
      - 皮革饰边与颜色: ${leather.name} (${leather.color})
      - 五金配件: ${hardware.name}
      - 尺寸廓形: ${size.name} (${size.dimensions})
      - 个性印记: 文字 "${monogram.text || "无"}" 采用 ${monogram.font} 字体 ${monogram.style} 工艺，位于 ${monogram.position}
    `;

    const systemPrompt = `
      你是一位资深且富有品味的「素织手作」设计总监与材质档案管理员。你的语气是诗意的、温暖的、精致的、谦逊的，并深深沉浸在对材质物理特性的描述中。
      你像一位造诣深厚的手工匠人，分享着布料与皮革的灵魂。不使用高昂的促销语气，避免使用 emoji 和感叹号。仅使用标准的中文排版。

      分析用户的定制包袋配置，返回一个包含以下字段的 JSON 对象：
      1. 'conceptName': 一个诗意的、高概念视觉名称来描述此配置组合（例如："墨染松烟 · 琥珀暖光"、"秋日苔庭 · 焦糖柔韵"）。
      2. 'stylingCritique': 一段优美的三句设计师点评。着重描述帆布颜色如何与皮革的暖调光泽平衡，以及这只包带给人的触感体验。
      3. 'coordinateGuide': 一份精致实用的穿搭搭配建议（例如："建议搭配：砂洗象牙白亚麻风衣、羊绒oversize围巾、炭灰色分趾靴，呈现温润极简的美学氛围"）。
      4. 'heritageNarrative': 一段诗意温暖的 100 字故事，讲述这只包陪伴主人在静谧街巷中漫步的场景，展现慢生活的美学。
    `;

    if (!ai) {
      // Return beautiful fallback in case API key is not configured locally yet
      res.json({
        conceptName: `${canvas.name} · ${leather.name}`,
        stylingCritique: `温润极致的材质组合。${canvas.name}的低张力织物质感与${leather.name}的植鞣革面柔和相映，整体呈现高级、纯净而温暖的手工质感。`,
        coordinateGuide: `建议搭配：米白色亚麻风衣、原色真丝衬衫、深灰宽腿西裤或羊毛分趾靴。简约中不失细节。`,
        heritageNarrative: `这只包将陪伴你走过清晨的静谧街道。当晨光洒在${hardware.name}五金件的缎面光泽上，你留下的印记在皮革上闪烁着属于自己的光芒。一件承载个人表达的随身之物。`
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate luxury stylist feedback and name suggestion for this beautiful custom bag combination: ${bagConfigDescription}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            stylingCritique: { type: Type.STRING },
            coordinateGuide: { type: Type.STRING },
            heritageNarrative: { type: Type.STRING },
          },
          required: ["conceptName", "stylingCritique", "coordinateGuide", "heritageNarrative"],
        },
      },
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("Error calling Gemini Suggest Stylist API:", error);
    res.status(500).json({ error: "Failed to consult the digital stylist.", message: error.message });
  }
});

// API Route 2: Dynamic Chat with Bag Studio Assistant
app.post("/api/gemini/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, activeBag } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "缺少消息参数或参数格式无效。" });
      return;
    }

    const activeBagString = activeBag
      ? `当前设计配置: 帆布: ${activeBag.canvas.name}, 皮革: ${activeBag.leather.name}, 五金: ${activeBag.hardware.name}, 尺寸: ${activeBag.size.name}.`
      : "";

    const chatInitPrompt = `
      你是「素织手作」工作室的一位优雅、温暖且知识渊博的设计助理。
      你在面料选择、江苏南通帆布的历史渊源、意大利托斯卡纳植鞣工艺以及风格穿搭方面为用户提供建议。
      保持安静、温暖、低调、真实的风格。不要使用感叹号，避免夸张促销语气。
      用谦逊而专业的口吻直接回答问题。如果问到穿搭搭配，建议经典的优雅组合。
      保持简洁舒适的回复（120字以内）。

      ${activeBagString}
    `;

    if (!ai) {
      // Simple fallback automated responder
      const lastMessage = messages[messages.length - 1]?.text || "";
      let responseText = "素织手作的设计工作室随时为你提供建议。这款经典帆布结构采用低张力纺织工艺编织，具有传世品质。";

      if (lastMessage.includes("帆布") || lastMessage.includes("南通") || lastMessage.includes("面料")) {
        responseText = "我们的有机帆布在南通以低张力纺织，密度高、重量大，经防水植物蜡处理。随着日常使用，它会逐渐柔软，愈用愈有韵味。";
      } else if (lastMessage.includes("皮革") || lastMessage.includes("鞣") || lastMessage.includes("植鞣")) {
        responseText = "我们选用意大利托斯卡纳全粒面瓦切塔牛皮。采用甜板栗与橡木树皮鞣制，保持皮革自然状态，让光线与手汗滋养出丰润的琥珀色光泽。";
      } else if (lastMessage.includes("颜色") || lastMessage.includes("配色") || lastMessage.includes("搭配") || lastMessage.includes("推荐")) {
        responseText = "非常推荐将秋鼠尾绿帆布与植鞣焦糖皮革搭配，营造出森林系自然温暖感，与米色亚麻或深灰大衣相得益彰。";
      }

      res.json({ text: responseText });
      return;
    }

    // Convert messages history to content format for generateContent
    const queryContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Inject system instruction in config
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: queryContents,
      config: {
        systemInstruction: chatInitPrompt,
        temperature: 0.8,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Gemini Chat API:", error);
    res.status(500).json({ error: "Stylist connection interrupted.", message: error.message });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server injected as middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static files in dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
