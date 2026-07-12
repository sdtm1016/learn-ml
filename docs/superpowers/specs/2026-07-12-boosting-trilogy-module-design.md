# 梯度提升三连（GBDT / XGBoost / LightGBM）可视化模块设计稿

- 日期：2026-07-12
- 状态：待评审
- 关联需求：用户提出为 GBDT / XGBoost / LightGBM 做一个"单独的、界面最直观"的模块

## 1. 目标与成功标准

### 1.1 要解决的问题
当前 `src/data/algorithms/ensemble.ts` 里已有 GBDT / XGBoost / LightGBM 三条纯文本条目，但只是和其它算法并排的卡片，读者无法直观看出"三者是层层递进的演进关系"，也看不到每一步的核心机制（残差拟合、二阶导分裂打分、直方图加速）。

### 1.2 目标
新增一个**独立可视化区块 + 顶部导航入口**，用**分步互动演示**讲清三者关系：
- GBDT：用决策树做梯度下降，拟合负梯度（残差）
- XGBoost：二阶导数 + 正则化 + 分裂打分公式，更精准更稳健
- LightGBM：直方图 + Leaf-wise + GOSS + EFB，更快更省

### 1.3 成功标准（可验证）
1. 首页导航栏出现"梯度提升三连"入口；点击平滑滚动到该区块。
2. 区块内三个算法各自有一个"分步演示器"，支持【上一步 / 下一步 / 自动播放】，步数固定，每步有文字说明 + 可视化变化。
3. 三个演示器顶部有统一的"演进时间线"（GBDT → XGBoost → LightGBM），高亮当前算法，并标注"本步相对上代新增了什么"。
4. 所有数值（残差、预测值、分裂增益、树结构、直方图桶）均为**预计算静态数据**，前端只渲染、不计算。
5. 适配明/暗主题（复用 `styles.css` 的 CSS 变量），移动端可用（演示器纵向堆叠）。
6. 不破坏现有算法卡片：三者仍保留在算法图谱里，详情 Modal 增加一个"进入可视化讲解"跳转。

### 1.4 非目标（YAGNI）
- 不在浏览器里实时训练真实 GBDT（用户已选预计算方案）。
- 不引入路由系统（项目目前是单页锚点滚动，沿用之）。
- 不做参数实时调参面板。
- 不重写既有 ensemble 卡片文案。

---

## 2. 架构与落点

沿用项目现有模式：**section 组件 + 静态数据文件 + App.tsx 挂载 + Header 导航**。不引第三方动画库，演示用 React state + CSS transition。

### 2.1 新增文件清单

```
src/
├── components/
│   └── sections/
│       └── BoostingTrilogySection/
│           ├── index.tsx                  # 区块主壳：标题 + 时间线 + 三个演示器切换
│           ├── EvolutionTimeline.tsx      # 顶部演进时间线（GBDT→XGBoost→LightGBM）
│           ├── Stepper.tsx               # 通用步进控件（上一步/下一步/播放）
│           ├── demos/
│           │   ├── GbdtDemo.tsx           # 残差拟合演示
│           │   ├── XgboostDemo.tsx        # 二阶导 + 分裂打分演示
│           │   └── LightgbmDemo.tsx       # 直方图 + Leaf-wise 演示
# （区块专属样式放在 src/styles/boosting-trilogy.css，沿用 styles.css 现有 @import './styles/*.css' 约定）
├── data/
│   └── boostingTrilogy/
│       ├── types.ts                       # 演示数据类型契约
│       ├── gbdt.ts                        # GBDT 预计算数据
│       ├── xgboost.ts                     # XGBoost 预计算数据
│       └── lightgbm.ts                    # LightGBM 预计算数据
```

### 2.2 修改文件清单（最小改动）
- `src/App.tsx`：在 `<ConceptSection />` 与 `<RoadmapSection />` 之间挂载 `<BoostingTrilogySection />`。
- `src/components/layout/Header.tsx`：导航栏新增一个锚点链接 `#boosting-trilogy`（沿用 `#roadmap` / `#algorithms` 的 `<a>` 模式）。
- `src/styles.css`：`@import './styles/boosting-trilogy.css';`（沿用现有 `@import './styles/*.css'` 约定，CSS 统一放在 `src/styles/` 下，不放组件目录）。
- `src/components/sections/AlgorithmSection/AlgorithmDetail.tsx`（或对应详情组件）：仅对 GBDT/XGBoost/LightGBM 三者，在详情里加一个"进入可视化讲解 →"按钮，点击滚动到 `#boosting-trilogy` 并定位对应 tab。（此条为可选增强，若详情组件改动复杂则一期先不做，只在 Header 入口暴露。）

---

## 3. 数据契约（预计算静态数据）

### 3.1 设计原则
- 每个演示 = 一个固定长度的"步骤数组"。
- 每个步骤是一个不可变快照：包含该步要展示的所有可视元素（点坐标、残差值、树节点、直方图桶、增益数字、文字说明）。
- 前端组件只做"按 step 索引渲染"，不做任何计算。

### 3.2 通用类型

```ts
// src/data/boostingTrilogy/types.ts
export interface DemoStep<Visual> {
  index: number;          // 步骤序号
  title: string;          // 步骤标题（如"第 2 轮：拟合残差"）
  narrative: string;      // 本步讲解文字（1-2 句）
  visual: Visual;         // 本步的可视化快照（由各 demo 自定义）
}

export interface DemoData<Visual> {
  algorithmId: 'gbdt' | 'xgboost' | 'lightgbm';
  algorithmName: string;          // 中文名
  algorithmLabel: string;         // 英文名
  oneLiner: string;               // 一句话定位（用户给的三句话之一）
  newAdditions: string[];         // 相对上一代新增了什么（demo 级、每个算法一套，用于时间线 + 右下角固定贴士）
  steps: DemoStep<Visual>[];      // 固定步骤数组
}
```

### 3.3 各 demo 的 Visual 类型（摘要，实现时细化）

**GBDT**（演示：每轮拟合残差，预测值逐步逼近真值）
```ts
interface GbdtVisual {
  points: { x: number; yTrue: number; yPred: number; residual: number }[]; // 6-8 个样本
  round: number;            // 第几棵树
  treeSketch?: {            // 本轮新增树的结构（简化）
    feature: string;
    threshold: number;
    leafValues: [number, number];
  };
}
```

**XGBoost**（演示：二阶导 + 分裂打分公式）
```ts
interface XgboostVisual {
  nodes: { g: number; h: number }[];        // 每个样本的一阶/二阶导
  candidateSplits: {                        // 候选分裂点及其打分
    threshold: number;
    G_L: number; H_L: number; G_R: number; H_R: number;
    gain: number;                           // 用打分公式算出的增益
  }[];
  bestSplit?: { threshold: number; gain: number };
  lambda: number;                           // 正则系数（展示用）
}
```

**LightGBM**（演示：直方图加速 + Leaf-wise 生长）
```ts
interface LightgbmVisual {
  histogram: { bin: number; count: number; gradientSum: number }[]; // 把连续值装桶
  leaves: { id: string; depth: number; isSplit: boolean }[];        // 当前叶子（展示 Leaf-wise 总挑增益最大的叶子裂）
  note: string;                                            // GOSS/EFB 提示
}
```

> 具体数值在实现阶段手算/离线脚本算好后填入，确保教学正确性。每个 demo 步骤数控制在 4-6 步。
>
> **离线脚本归属**：预计算脚本提交到 `scripts/precompute-boosting.ts`（一次性运行、产物即 `src/data/boostingTrilogy/*.ts`）。保留脚本是为了让数值可复算、可审计（教学正确性）；脚本本身不进构建产物、不参与运行时。若某 demo 全部数值可手算（如 GBDT 残差），允许不写脚本、直接手填并加注释，但需在数据文件头注明数值来源。

---

## 4. 界面设计（分步互动演示）

### 4.1 整体布局

```
┌─ 梯度提升三连 · 三代演进 ───────────────────────────────────┐
│  标题 + 一句话：决策树怎么做梯度下降？三代如何层层加速       │
│                                                              │
│  ╔══ 演进时间线 ════════════════════════════════════════╗   │
│  ║  ① GBDT ──▶ ② XGBoost ──▶ ③ LightGBM               ║   │
│  ║  拟合残差   +二阶导/正则    +直方图/Leaf-wise        ║   │
│  ║  [●当前]                                       ║   │
│  ╚═══════════════════════════════════════════════════════╝   │
│                                                              │
│  ┌─ 当前演示器（GBDT / XGBoost / LightGBM 三选一）──────┐   │
│  │ [Tab: GBDT] [Tab: XGBoost] [Tab: LightGBM]          │   │
│  │                                                       │   │
│  │  左：可视化区（SVG/CSS）     右：步骤讲解文字         │   │
│  │  ┌─────────────────┐        ┌──────────────────┐    │   │
│  │  │ 点/残差/树/直方图│        │ 第 2 轮：拟合残差 │    │   │
│  │  │ （随步骤变化）   │        │ 新树学到了…       │    │   │
│  │  └─────────────────┘        │ 「相对上一代新增」 │    │   │
│  │                              └──────────────────┘    │   │
│  │  [◀ 上一步]  2/5  [下一步 ▶]  [⏯ 自动播放]          │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 交互
- **顶部 Tab** 切换三个算法（默认 GBDT）。切换时该 demo 的 step 重置为 0。
- **步进器**：上一部 / 下一步 / 步数指示 `i/N` / 自动播放（每 1.5s 推进一步，到末步停止）。
- **可视化区**：每次 step 变化，用 CSS transition 平滑过渡（点移动、残差柱伸缩、节点高亮、直方图桶增长）。不引入动画库。
- **"相对上一代新增"小贴士**：固定在每个 demo 右下角，强化演进叙事。

### 4.3 三个 demo 的具体演示剧本（实现时据此填静态数据）

**Demo 1 · GBDT（5 步）**
1. 初始：预测=均值，所有样本都有残差（= 真值 − 均值）。
2. 第 1 棵树：拟合残差，选一个特征分裂，预测值往真值靠一步。
3. 第 2 棵树：拟合新的残差，残差变小。
4. 第 3 棵树：残差进一步变小，预测曲线明显贴合。
5. 小结："每棵树都在修正前面没学好的部分 —— 这就是用决策树做梯度下降。"

**Demo 2 · XGBoost（5 步）**
1. 回顾：GBDT 只用一阶导 g。
2. 引入二阶导 h：展示每个样本的 g 和 h，说明泰勒展开更准。
3. 分裂打分公式：列出 2-3 个候选分裂点的 G_L/H_L/G_R/H_R，按公式算 gain。
4. 选 gain 最大的分裂 + 闭式最优叶子权重 w* = −G/(H+λ)。
5. 正则化 Ω：展示 λ 控制叶子数和权重，"更精准更稳健"。

**Demo 3 · LightGBM（5 步）**
1. 回顾：XGBoost 找分裂要遍历所有特征所有值，慢。
2. 直方图：把连续特征装进 k 个桶，找分裂只在桶上比，快。
3. Leaf-wise：对比 Level-wise，展示"总挑当前增益最大的叶子裂"，树更深更非对称。
4. GOSS：大梯度全留、小梯度抽样，保信息又省。
5. EFB：把互斥的稀疏特征捆绑成一个，降维。小结："更快更省。"

---

## 5. 可视化技术选型
- 用 **SVG** 画 GBDT 的散点+残差柱、XGBoost 的节点+分裂、LightGBM 的直方图和树形。
- 树结构用嵌套 div + 绝对定位画简笔树（与 ReactFlow 风格区隔开，保持轻量）。
- 全部用 CSS 变量着色，跟随明暗主题。
- 动画：CSS `transition` 对 transform/opacity/width；step 切换由 React state 驱动。

---

## 6. 错误处理与边界
- step 越界：上一部在 0 时禁用，下一步在末步禁用（按钮 disabled）。
- 自动播放到末步：停止，按钮变回"播放"。
- 窄屏（<720px）：可视化区和讲解区纵向堆叠，时间线纵向。

---

## 7. 测试策略
沿用项目现有 `tests/website-structure.test.cjs`（结构校验）+ vitest（单元）：
- **结构测试**：扩展 `website-structure.test.cjs`，断言 BoostingTrilogySection 文件存在、Header 含 `#boosting-trilogy` 锚点。
- **数据测试**（vitest）：对三个 demo 数据，校验 `steps` 非空、每步 `narrative`/`visual` 字段齐全、step.index 连续。
- **渲染测试**（可选，轻量）：渲染 `<BoostingTrilogySection />`，断言默认显示 GBDT demo 第 0 步、点击下一步后步数指示变化。
- **手动验收**：明/暗主题切换无破图；窄屏堆叠正常；三个 demo 全步走一遍无报错。

---

## 8. 落地顺序（实现计划输入）
1. 建数据层（types + 三份静态数据）+ 数据校验测试。
2. 建 Stepper / EvolutionTimeline 通用件。
3. 建 GbdtDemo（最基础，先把交互骨架打通）。
4. 复用骨架做 XgboostDemo、LightgbmDemo。
5. 组装 BoostingTrilogySection + CSS。
6. 挂到 App.tsx + Header 导航 + styles.css import。
7. 扩展结构测试 + 跑全量测试 + 手动验收。

（此顺序将作为 writing-plans 阶段的输入。）
