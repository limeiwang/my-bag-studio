# 素织手作 — 手工帆布包定制

> 用心做一只好包。手工帆布包定制，从面料到成品，每一处细节都由你定义。

**素织手作**是一个全功能手工帆布包定制平台。顾客可以在 3D 风格的设计工作室中自由搭配进口帆布、皮革、五金与配件，实时预览设计方案，并借助 AI 造型顾问获取配色建议与风格点评。

## 项目预览

| 页面 | 功能 |
|------|------|
| **品牌落地页** | 材质展示、案例画廊、定价方案、FAQ、制作流程 |
| **设计工作室** | 6 步定制流程 + SVG 实时预览 + AI 造型顾问 + AI 对话助手 |

## 技术栈

| 类别 | 技术 |
|------|------|
| **前端** | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| **动画** | Motion (motion/react), GSAP (ScrollTrigger) |
| **后端** | Express 4 (Node.js) |
| **AI** | Google Gemini API (genai SDK) |
| **图标** | Lucide React |
| **构建** | esbuild (服务端), Vite (客户端) |

## 核心功能

### 设计工作室 (Studio)

6 步个性化定制流程：

1. **尺寸** — 精巧基础款 / 经典工作室款 / 远行大号款
2. **帆布** — 日本冈山认证有机帆布（暖沙 / 秋鼠尾绿 / 墨曜黑 / 信乐陶土）
3. **皮革** — 意大利托斯卡纳植鞣革（焦糖 / 深棕 / 曜黑 / 雪花石膏白）
4. **五金** — 拉丝黄铜 / 抛光银钢 / 阳极暗黑
5. **印记** — 最多 4 字符烫金/压印，衬线/无衬线/等宽字体可选
6. **配件** — 可拆卸肩带、黄铜钥匙扣、防尘袋套装

实时 SVG 渲染预览，支持画廊日光 / 落日金辉 / 暗室格调三种氛围灯光。

### AI 造型顾问

- **风格点评** — 分析当前设计方案，生成诗意的概念命名、设计师点评与穿搭建议
- **在线聊天** — 随时咨询面料工艺、配色方案与风格搭配
- Gemini API 驱动（备选离线回复模式）

### 作品集

设计方案可保存至本地浏览器，支持加载历史方案与快速切换预设风格（自然纯粹 / 森林漫游 / 暗夜黑曜 / 落日画廊）。

### 结算下单

模拟结算流程，包含定制清单汇总与表单验证。

## 快速开始

### 前置依赖

- Node.js >= 18
- npm

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 配置 Gemini API 密钥（可选，不配置时 AI 功能运行于模拟模式）
cp .env.example .env.local
# 编辑 .env.local，填入 GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`

### 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
my-bag-studio/
├── server.ts                  # Express 服务端 + Gemini API 路由
├── src/
│   ├── main.tsx               # 应用入口
│   ├── App.tsx                # 根组件（路由控制）
│   ├── index.css              # 全局样式（Tailwind）
│   ├── types.ts               # TypeScript 类型定义
│   ├── data.ts                # 材质/尺寸/预设数据
│   └── components/
│       ├── Navbar.tsx         # 导航栏
│       ├── LandingPage.tsx    # 品牌落地页
│       ├── StudioPage.tsx     # 设计工作室
│       └── BagVisualizer.tsx  # SVG 包袋实时渲染器
├── public/
│   └── images/                # 产品与素材图片
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## AI 集成

项目集成了 Google Gemini API，提供两个服务端接口：

| 接口 | 说明 |
|------|------|
| `POST /api/gemini/suggest-stylist` | 分析当前包袋配置，返回风格命名、设计师点评、穿搭建议与叙事故事 |
| `POST /api/gemini/chat` | 面向用户的 AI 造型顾问对话接口，支持上下文与当前配置感知 |

若 `GEMINI_API_KEY` 未配置，系统自动降级为本地模拟回复。

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `GEMINI_API_KEY` | 否 | Google Gemini API 密钥，不填时 AI 功能运行于模拟模式 |
| `APP_URL` | 否 | 部署后的服务 URL |

## 部署

项目可部署至任何支持 Node.js 的环境（Cloud Run、Vercel、Railway 等）：

```bash
npm run build
npm start
```

生产模式下，Express 会自动托管 `dist/` 目录的静态文件。

## 许可

MIT
