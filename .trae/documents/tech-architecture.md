# 二次元小说网站 - 技术架构文档

## 1. 架构设计

```mermaid
flowchart TD
    subgraph "客户端"
        "A[浏览器]"
    end
    
    subgraph "Cloudflare 边缘网络"
        "B[Cloudflare Workers]"
        "C[R2 对象存储]"
        "D[KV 存储]"
        "E[静态资源]"
    end
    
    "A" -->|"HTTP/HTTPS 请求"| "B"
    "B" -->|"读取/写入小说文件"| "C"
    "B" -->|"存储元数据/进度"| "D"
    "B" -->|"返回静态资源"| "E"
    "B" -->|"返回页面/API响应"| "A"
```

### 架构说明
- **前端**：Vue 3 + TypeScript + Vite + Tailwind CSS，构建后静态资源部署到 Workers
- **后端**：Cloudflare Workers 使用 Hono 框架提供 API 和静态资源服务
- **存储层**：
  - R2：存储小说原始文件（TXT/EPUB/PDF）和封面图片
  - KV：存储小说元数据、章节索引、用户阅读进度
- **边缘计算**：所有逻辑在 Cloudflare 边缘节点运行，全球低延迟

## 2. 技术说明

- **前端框架**：Vue 3 + TypeScript（Composition API + `<script setup>`）
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS 3
- **路由**：Vue Router 4
- **状态管理**：Pinia
- **后端框架**：Hono（Cloudflare Workers 专用轻量框架）
- **Workers 工具**：Wrangler CLI
- **存储服务**：Cloudflare R2 + Cloudflare KV
- **图标库**：lucide-vue-next
- **字体**：Google Fonts（ZCOOL KuaiLe、Noto Serif SC、Nunito）

## 3. 路由定义

### 3.1 前端页面路由
| 路由 | 页面 | 功能说明 |
|------|------|----------|
| `/` | 首页 | 推荐小说、分类浏览、最新更新 |
| `/novel/:id` | 小说详情页 | 小说信息、章节列表、下载 |
| `/novel/:id/read/:chapterId` | 阅读页 | 在线阅读、阅读设置 |
| `/search` | 搜索页 | 搜索小说、筛选结果 |
| `/category/:category` | 分类页 | 分类小说列表 |

### 3.2 后端 API 路由
| 方法 | 路由 | 功能说明 |
|------|------|----------|
| GET | `/api/novels` | 获取小说列表（支持分页、分类筛选） |
| GET | `/api/novels/:id` | 获取小说详情 |
| GET | `/api/novels/:id/chapters` | 获取小说章节列表 |
| GET | `/api/novels/:id/chapters/:chapterId` | 获取章节内容 |
| GET | `/api/novels/:id/download/:format` | 下载小说文件（txt/epub/pdf） |
| GET | `/api/search?q=keyword` | 搜索小说 |
| GET | `/api/categories` | 获取分类列表 |
| GET | `/api/progress/:novelId` | 获取阅读进度（基于设备ID） |
| POST | `/api/progress/:novelId` | 保存阅读进度 |

## 4. API 定义

### 4.1 小说数据结构
```typescript
interface Novel {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: string;
  tags: string[];
  wordCount: number;
  status: 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
  chapterCount: number;
  volumes: Volume[];
}

interface Volume {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  wordCount: number;
  updatedAt: string;
}

interface ChapterContent extends Chapter {
  content: string;
}
```

### 4.2 API 响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### 4.3 阅读进度
```typescript
interface ReadingProgress {
  novelId: string;
  chapterId: string;
  scrollPosition: number;
  lastReadAt: string;
}
```

## 5. 服务架构图

```mermaid
flowchart TD
    "请求" --> "Hono Router"
    "Hono Router" --> "静态资源中间件"
    "Hono Router" --> "API 路由"
    
    "静态资源中间件" --> "返回前端SPA资源"
    
    "API 路由" --> "NovelController"
    "API 路由" --> "DownloadController"
    "API 路由" --> "ProgressController"
    "API 路由" --> "SearchController"
    
    "NovelController" --> "NovelService"
    "DownloadController" --> "FileService"
    "ProgressController" --> "ProgressService"
    "SearchController" --> "SearchService"
    
    "NovelService" --> "KV 存储"
    "FileService" --> "R2 存储"
    "ProgressService" --> "KV 存储"
    "SearchService" --> "KV 存储"
```

## 6. 数据模型

### 6.1 KV 存储键值设计
| Key 模式 | Value 类型 | 说明 |
|----------|------------|------|
| `novel:list` | JSON 数组 | 小说ID列表（用于索引） |
| `novel:{id}` | JSON 对象 | 小说元数据和章节索引 |
| `chapter:{novelId}:{chapterId}` | 字符串 | 章节文本内容（TXT解析后） |
| `progress:{deviceId}:{novelId}` | JSON 对象 | 用户阅读进度 |
| `categories` | JSON 数组 | 分类列表 |

### 6.2 R2 存储路径设计
| 路径 | 说明 |
|------|------|
| `covers/{novelId}.jpg` | 小说封面图片 |
| `novels/{novelId}/source.txt` | TXT 格式源文件 |
| `novels/{novelId}/source.epub` | EPUB 格式源文件 |
| `novels/{novelId}/source.pdf` | PDF 格式源文件 |

### 6.3 项目结构
```
book/
├── src/                      # 前端源码 (Vue)
│   ├── components/           # Vue 组件
│   │   ├── layout/          # 布局组件
│   │   ├── novel/           # 小说相关组件
│   │   └── reader/          # 阅读器组件
│   ├── views/               # 页面视图组件
│   ├── composables/         # 可复用的组合式函数
│   ├── stores/              # Pinia 状态管理
│   ├── router/              # Vue Router 配置
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript 类型定义
│   └── assets/              # 静态资源
├── worker/                   # Workers 后端
│   ├── src/
│   │   ├── index.ts         # Hono 入口
│   │   ├── routes/          # API 路由
│   │   ├── services/        # 业务逻辑
│   │   └── utils/           # 工具函数
│   └── wrangler.toml        # Wrangler 配置
├── public/                   # 公共静态资源
├── shared/                   # 前后端共享类型
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 7. 部署配置

### 7.1 Wrangler 配置要点
- Workers 名称：`anime-novel-reader`
- R2 存储桶：`novel-files`
- KV 命名空间：`novel-meta`、`reading-progress`
- 兼容性日期：使用最新版本
- 构建输出：前端构建产物作为 Workers 静态资源

### 7.2 本地开发
- 使用 Wrangler dev 命令启动本地 Workers 环境
- Vite dev server 用于前端开发热更新
- 本地可使用 Miniflare 模拟 R2 和 KV
