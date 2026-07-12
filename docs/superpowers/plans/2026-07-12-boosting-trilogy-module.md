# 梯度提升三连（GBDT / XGBoost / LightGBM）可视化模块 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个独立可视化区块 + 顶部导航入口，用分步互动演示讲清 GBDT → XGBoost → LightGBM 三代演进，数值全部预计算静态化。

**Architecture:** 沿用项目现有模式——section 组件挂载在 App.tsx、静态数据放 `src/data/`、CSS 放 `src/styles/` 并由 `src/styles.css` 统一 `@import`、Header 用锚点导航。不引第三方动画库，演示用 React state 驱动 + CSS transition。每个 demo = 固定长度的「步骤快照数组」，前端只渲染不计算。

**Tech Stack:** React 18 + TypeScript + Vite；vitest（node 环境）做数据/逻辑测试；`tests/website-structure.test.cjs`（cjs）做结构骨架断言；纯 SVG + CSS 画可视化，无新依赖。

**Spec:** `docs/superpowers/specs/2026-07-12-boosting-trilogy-module-design.md`

---

## 文件结构总览

**新建文件：**
| 文件 | 职责 |
|---|---|
| `src/data/boostingTrilogy/types.ts` | 演示数据类型契约（`DemoStep`/`DemoData` + 三个 Visual 子类型） |
| `src/data/boostingTrilogy/gbdt.ts` | GBDT 预计算数据（5 步快照） |
| `src/data/boostingTrilogy/xgboost.ts` | XGBoost 预计算数据（5 步快照） |
| `src/data/boostingTrilogy/lightgbm.ts` | LightGBM 预计算数据（5 步快照） |
| `src/data/boostingTrilogy/index.ts` | 聚合三个 demo + 元信息数组（时间线用） |
| `src/components/sections/BoostingTrilogySection/index.tsx` | 区块主壳：标题 + 时间线 + tab 切换 + demo 容器 |
| `src/components/sections/BoostingTrilogySection/EvolutionTimeline.tsx` | 顶部三代演进时间线 |
| `src/components/sections/BoostingTrilogySection/Stepper.tsx` | 通用步进控件（上一步/下一步/播放/步数指示） |
| `src/components/sections/BoostingTrilogySection/demos/GbdtDemo.tsx` | GBDT 可视化渲染器 |
| `src/components/sections/BoostingTrilogySection/demos/XgboostDemo.tsx` | XGBoost 可视化渲染器 |
| `src/components/sections/BoostingTrilogySection/demos/LightgbmDemo.tsx` | LightGBM 可视化渲染器 |
| `src/styles/boosting-trilogy.css` | 区块专属样式 |
| `tests/boostingTrilogy.test.ts` | 数据契约 + 步进逻辑测试 |

**修改文件（最小改动）：**
| 文件 | 改动 |
|---|---|
| `src/App.tsx` | 在 `<ConceptSection />` 与 `<RoadmapSection />` 之间挂载 `<BoostingTrilogySection />` |
| `src/components/layout/Header.tsx` | nav-links 增加锚点 `<a href="#boosting-trilogy">梯度提升</a>` |
| `src/styles.css` | 顶部新增 `@import './styles/boosting-trilogy.css';` |
| `tests/website-structure.test.cjs` | 增加断言：section 文件存在、Header 含锚点、CSS 含关键类 |

---

## Task 1: 数据类型契约

**目标：** 先固化类型，后续 demo 数据和组件都依赖它。先写测试再写实现（TDD）。

**Files:**
- Create: `src/data/boostingTrilogy/types.ts`
- Create: `tests/boostingTrilogy.test.ts`

- [ ] **Step 1: 写失败测试（数据类型契约）**

创建 `tests/boostingTrilogy.test.ts`，先只放类型导入和占位断言。意图：保护「demo 数据结构」契约——步骤非空、索引连续、字段齐全。

```ts
import { describe, it, expect } from 'vitest';
import { gbdtDemo } from '../src/data/boostingTrilogy/gbdt';
import { xgboostDemo } from '../src/data/boostingTrilogy/xgboost';
import { lightgbmDemo } from '../src/data/boostingTrilogy/lightgbm';
import { boostingTrilogy } from '../src/data/boostingTrilogy/index';
import type { DemoData } from '../src/data/boostingTrilogy/types';
// 步进纯函数（Task 6 实现，先放在顶部 import 块，避免末尾追加触发 import/first 规则）
import { nextStep, prevStep, clampStep } from '../src/components/sections/BoostingTrilogySection/Stepper';

// 测试意图：三个 demo 的数据结构必须满足教学演示契约。
// 若 steps 为空、索引断裂或元信息缺失，演示器会渲染崩坏——这是核心契约。
describe('boostingTrilogy 数据契约', () => {
  const demos: DemoData<unknown>[] = [gbdtDemo, xgboostDemo, lightgbmDemo];

  it('恰好三个 demo，顺序为 GBDT → XGBoost → LightGBM', () => {
    expect(boostingTrilogy).toHaveLength(3);
    expect(boostingTrilogy[0].algorithmId).toBe('gbdt');
    expect(boostingTrilogy[1].algorithmId).toBe('xgboost');
    expect(boostingTrilogy[2].algorithmId).toBe('lightgbm');
  });

  for (const demo of demos) {
    describe(`${demo.algorithmId} demo`, () => {
      it('steps 非空且 4-6 步', () => {
        expect(demo.steps.length).toBeGreaterThanOrEqual(4);
        expect(demo.steps.length).toBeLessThanOrEqual(6);
      });

      it('step.index 从 0 连续递增', () => {
        demo.steps.forEach((step, i) => {
          expect(step.index).toBe(i);
        });
      });

      it('每步 title/narrative/visual 齐全', () => {
        for (const step of demo.steps) {
          expect(step.title.length).toBeGreaterThan(0);
          expect(step.narrative.length).toBeGreaterThan(0);
          expect(step.visual).toBeDefined();
        }
      });

      it('元信息齐全（一句话定位 + 相对上一代新增）', () => {
        expect(demo.oneLiner.length).toBeGreaterThan(0);
        expect(demo.newAdditions.length).toBeGreaterThan(0);
      });
    });
  }
});
```

- [ ] **Step 2: 运行测试，确认失败（文件不存在）**

Run: `npx vitest run tests/boostingTrilogy.test.ts`
Expected: FAIL，报错模块找不到（`Cannot find module '../src/data/boostingTrilogy/...'`）。

- [ ] **Step 3: 实现类型契约**

创建 `src/data/boostingTrilogy/types.ts`：

```ts
// 中文注释：梯度提升三连演示的数据类型契约
// 核心原则：每个 demo = 固定长度的步骤快照数组，前端只渲染不计算。

export type AlgorithmId = 'gbdt' | 'xgboost' | 'lightgbm';

// 中文注释：通用步骤——Visual 由各 demo 自定义
export interface DemoStep<Visual> {
  index: number;       // 步骤序号（从 0 连续递增）
  title: string;       // 步骤标题（如"第 2 轮：拟合残差"）
  narrative: string;   // 本步讲解文字（1-2 句）
  visual: Visual;      // 本步的可视化快照
}

// 中文注释：单个 demo 的完整数据
export interface DemoData<Visual> {
  algorithmId: AlgorithmId;
  algorithmName: string;        // 中文名
  algorithmLabel: string;       // 英文名
  oneLiner: string;             // 一句话定位
  newAdditions: string[];       // 相对上一代新增了什么（时间线 + 右下角贴士）
  steps: DemoStep<Visual>[];    // 固定步骤数组
}

// ---- GBDT 演示的 Visual：残差拟合 ----
export interface GbdtVisual {
  // 6-8 个样本点：x 坐标、真值、当前预测值、当前残差
  points: { x: number; yTrue: number; yPred: number; residual: number }[];
  round: number;        // 当前是第几棵树（0 = 初始均值预测）
  newTree?: {           // 本轮新增树（简化结构）
    feature: string;
    threshold: number;
    leafValues: [number, number];
  };
}

// ---- XGBoost 演示的 Visual：二阶导 + 分裂打分 ----
export interface XgboostNode {
  g: number; // 一阶导
  h: number; // 二阶导
}
export interface XgboostCandidate {
  threshold: number;
  G_L: number; H_L: number; // 左子节点梯度和
  G_R: number; H_R: number; // 右子节点梯度和
  gain: number;             // 打分公式算出的增益
}
export interface XgboostVisual {
  nodes: XgboostNode[];
  candidates: XgboostCandidate[];
  bestSplit?: { threshold: number; gain: number };
  lambda: number;     // L2 正则系数（展示用，常量）
  bestLeafWeight?: number; // 闭式最优叶子权重 w* = -G/(H+λ)
}

// ---- LightGBM 演示的 Visual：直方图 + Leaf-wise ----
export interface LightgbmBin {
  bin: number;            // 桶序号
  count: number;          // 样本数
  gradientSum: number;    // 梯度和
}
export interface LightgbmLeaf {
  id: string;
  depth: number;
  isSplit: boolean;       // 是否是本轮被选来分裂的叶子
  gain?: number;          // 该叶子的分裂增益（Leaf-wise 选最大的）
}
export interface LightgbmVisual {
  histogram: LightgbmBin[];   // 把连续特征装桶
  leaves: LightgbmLeaf[];     // 当前叶子集合（展示 Leaf-wise）
  note: string;               // GOSS/EFB 提示文字
}
```

- [ ] **Step 4: 提交**

```bash
git add src/data/boostingTrilogy/types.ts tests/boostingTrilogy.test.ts
git commit -m "feat(boosting-trilogy): 数据类型契约与测试骨架"
```

---

## Task 2: GBDT 预计算数据

**目标：** 填入 GBDT demo 的 5 步快照。数值手算，确保教学正确性。

**Files:**
- Create: `src/data/boostingTrilogy/gbdt.ts`

**数值说明（写入文件头注释）：** 用一个固定的小数据集（6 个点，真值近似一条曲线），初始预测取均值，每轮残差 = 真值 − 当前预测。下面的数值是**示意教学值**，手算保证单调下降趋势即可，无需拟合真实树。

- [ ] **Step 1: 实现 GBDT 数据**

创建 `src/data/boostingTrilogy/gbdt.ts`：

```ts
// 中文注释：GBDT 演示预计算数据
// 数值来源：6 个样本点，初始预测=均值(约 0.5)，每轮残差=真值-当前预测。
// 数值经手算，保证残差随轮次单调下降的教学趋势，非真实树拟合结果。
import type { DemoData, GbdtVisual } from './types';

export const gbdtDemo: DemoData<GbdtVisual> = {
  algorithmId: 'gbdt',
  algorithmName: '梯度提升树',
  algorithmLabel: 'GBDT',
  oneLiner: '用决策树做梯度下降，每棵新树拟合前一轮的负梯度（残差）。',
  newAdditions: ['拟合负梯度（残差）', '串行加法模型 F = F + η·h'],
  steps: [
    {
      index: 0,
      title: '初始：预测=均值',
      narrative: '第 0 轮，模型只输出所有样本真值的均值，每个样本都有一个较大的残差。',
      visual: {
        round: 0,
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.5, residual: -0.4 },
          { x: 2, yTrue: 0.3, yPred: 0.5, residual: -0.2 },
          { x: 3, yTrue: 0.5, yPred: 0.5, residual: 0.0 },
          { x: 4, yTrue: 0.7, yPred: 0.5, residual: 0.2 },
          { x: 5, yTrue: 0.9, yPred: 0.5, residual: 0.4 },
        ],
      },
    },
    {
      index: 1,
      title: '第 1 棵树：拟合残差',
      narrative: '种一棵树去拟合当前的残差，预测值开始往真值靠拢，残差变小。',
      visual: {
        round: 1,
        newTree: { feature: 'x', threshold: 2.5, leafValues: [-0.3, 0.2] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.2, residual: -0.1 },
          { x: 2, yTrue: 0.3, yPred: 0.2, residual: 0.1 },
          { x: 3, yTrue: 0.5, yPred: 0.7, residual: -0.2 },
          { x: 4, yTrue: 0.7, yPred: 0.7, residual: 0.0 },
          { x: 5, yTrue: 0.9, yPred: 0.7, residual: 0.2 },
        ],
      },
    },
    {
      index: 2,
      title: '第 2 棵树：拟合新残差',
      narrative: '对更新后的残差再种一棵树，残差进一步收敛。',
      visual: {
        round: 2,
        newTree: { feature: 'x', threshold: 4.5, leafValues: [0.0, 0.15] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.2, residual: -0.1 },
          { x: 2, yTrue: 0.3, yPred: 0.3, residual: 0.0 },
          { x: 3, yTrue: 0.5, yPred: 0.7, residual: -0.2 },
          { x: 4, yTrue: 0.7, yPred: 0.7, residual: 0.0 },
          { x: 5, yTrue: 0.9, yPred: 0.85, residual: 0.05 },
        ],
      },
    },
    {
      index: 3,
      title: '第 3 棵树：残差很小了',
      narrative: '再来一棵，预测曲线已明显贴合真值，残差接近 0。',
      visual: {
        round: 3,
        newTree: { feature: 'x', threshold: 3.0, leafValues: [-0.05, 0.05] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.15, residual: -0.05 },
          { x: 2, yTrue: 0.3, yPred: 0.3, residual: 0.0 },
          { x: 3, yTrue: 0.5, yPred: 0.55, residual: -0.05 },
          { x: 4, yTrue: 0.7, yPred: 0.7, residual: 0.0 },
          { x: 5, yTrue: 0.9, yPred: 0.9, residual: 0.0 },
        ],
      },
    },
    {
      index: 4,
      title: '小结：这就是用决策树做梯度下降',
      narrative: '每棵树都在修正前面没学好的部分。累加多棵弱树，就得到一个强模型。',
      visual: {
        round: 3,
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.1, residual: 0.0 },
          { x: 2, yTrue: 0.3, yPred: 0.3, residual: 0.0 },
          { x: 3, yTrue: 0.5, yPred: 0.5, residual: 0.0 },
          { x: 4, yTrue: 0.7, yPred: 0.7, residual: 0.0 },
          { x: 5, yTrue: 0.9, yPred: 0.9, residual: 0.0 },
        ],
      },
    },
  ],
};
```

- [ ] **Step 2: 提交**

```bash
git add src/data/boostingTrilogy/gbdt.ts
git commit -m "feat(boosting-trilogy): GBDT 演示预计算数据"
```

---

## Task 3: XGBoost 预计算数据

**Files:**
- Create: `src/data/boostingTrilogy/xgboost.ts`

**数值说明：** 增益公式 `gain = ½·[G_L²/(H_L+λ) + G_R²/(H_R+λ) − (G_L+G_R)²/(H_L+H_R+λ)] − λ`，λ=1。叶子权重 `w* = −G/(H+λ)`。5 个样本按 x 排序：`g=[-1.5, -0.8, 0.2, 0.9, 1.5]`，`h=0.5`（每个）。下方 gain/w* 值由公式逐项算出（已用脚本复核），bestSplit 的 gain 确为候选最大。

- [ ] **Step 1: 实现 XGBoost 数据**

创建 `src/data/boostingTrilogy/xgboost.ts`：

```ts
// 中文注释：XGBoost 演示预计算数据
// 5 样本按 x 排序：g=[-1.5,-0.8,0.2,0.9,1.5]，h=0.5。
// 增益公式：gain = ½·[G_L²/(H_L+λ) + G_R²/(H_R+λ) − (G_L+G_R)²/(H_L+H_R+λ)] − λ，λ=1。
// 叶子权重：w* = -G/(H+λ)。所有 gain/w* 均由公式逐项算出，bestSplit.gain 为候选最大值。
import type { DemoData, XgboostVisual } from './types';

// 五个样本的梯度（g）和二阶导（h），按特征 x 升序排列
const SAMPLE_NODES = [
  { g: -1.5, h: 0.5 }, { g: -0.8, h: 0.5 }, { g: 0.2, h: 0.5 },
  { g: 0.9, h: 0.5 }, { g: 1.5, h: 0.5 },
];

export const xgboostDemo: DemoData<XgboostVisual> = {
  algorithmId: 'xgboost',
  algorithmName: 'XGBoost',
  algorithmLabel: 'XGBoost',
  oneLiner: '二阶导数 + 正则化 + 分裂打分公式，比 GBDT 更精准更稳健。',
  newAdditions: ['二阶导数 h（泰勒展开）', '分裂打分公式（闭式）', '正则化 Ω 控复杂度'],
  steps: [
    {
      index: 0,
      title: '回顾：GBDT 只用一阶导 g',
      narrative: 'GBDT 用一阶梯度（残差）决定每棵树学什么。XGBoost 进一步用上二阶导 h。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [],
      },
    },
    {
      index: 1,
      title: '引入二阶导 h',
      narrative: '每个样本除了 g，还有 h（二阶导）。两者一起给出更准的下降方向和步长。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [],
      },
    },
    {
      index: 2,
      title: '分裂打分公式',
      narrative: '对每个候选分裂点，用 G、H 的累加按公式算 gain，挑增益最大的。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [
          // x<1.5：左=[-1.5], 右=[-0.8,0.2,0.9,1.5]
          { threshold: 1.5, G_L: -1.5, H_L: 0.5, G_R: 1.8, H_R: 2.0, gain: 0.28 },
          // x<2.5：左=[-1.5,-0.8], 右=[0.2,0.9,1.5]
          { threshold: 2.5, G_L: -2.3, H_L: 1.0, G_R: 2.6, H_R: 1.5, gain: 1.66 },
          // x<3.5：左=[-1.5,-0.8,0.2], 右=[0.9,1.5]
          { threshold: 3.5, G_L: -2.1, H_L: 1.5, G_R: 2.4, H_R: 1.0, gain: 1.31 },
        ],
      },
    },
    {
      index: 3,
      title: '选最大增益 + 闭式最优权重',
      narrative: 'threshold=2.5 增益 1.66 最大。叶子权重直接闭式算出 w* = -G/(H+λ)，无需线性搜索。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [
          { threshold: 1.5, G_L: -1.5, H_L: 0.5, G_R: 1.8, H_R: 2.0, gain: 0.28 },
          { threshold: 2.5, G_L: -2.3, H_L: 1.0, G_R: 2.6, H_R: 1.5, gain: 1.66 },
          { threshold: 3.5, G_L: -2.1, H_L: 1.5, G_R: 2.4, H_R: 1.0, gain: 1.31 },
        ],
        bestSplit: { threshold: 2.5, gain: 1.66 },
        // 左叶（x<2.5）闭式权重：w* = -G_L/(H_L+λ) = -(-2.3)/(1.0+1) = 1.15
        bestLeafWeight: 1.15,
      },
    },
    {
      index: 4,
      title: '正则化 Ω：更稳健',
      narrative: '目标函数含 Ω = γ·叶子数 + ½λ·Σw²。λ、γ 越大越抑制复杂树，防过拟合。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [],
        bestLeafWeight: 1.15,
      },
    },
  ],
};
```

- [ ] **Step 2: 提交**

```bash
git add src/data/boostingTrilogy/xgboost.ts
git commit -m "feat(boosting-trilogy): XGBoost 演示预计算数据"
```

---

## Task 4: LightGBM 预计算数据

**Files:**
- Create: `src/data/boostingTrilogy/lightgbm.ts`

- [ ] **Step 1: 实现 LightGBM 数据**

创建 `src/data/boostingTrilogy/lightgbm.ts`：

```ts
// 中文注释：LightGBM 演示预计算数据
// 数值为教学示意：直方图桶分布、Leaf-wise 选增益最大叶子、GOSS/EFB 文字提示。
import type { DemoData, LightgbmVisual } from './types';

export const lightgbmDemo: DemoData<LightgbmVisual> = {
  algorithmId: 'lightgbm',
  algorithmName: 'LightGBM',
  algorithmLabel: 'LightGBM',
  oneLiner: '直方图 + Leaf-wise + GOSS + EFB，比 XGBoost 更快更省。',
  newAdditions: ['直方图装桶加速', 'Leaf-wise 优先生长', 'GOSS 梯度采样', 'EFB 特征捆绑'],
  steps: [
    {
      index: 0,
      title: '回顾：XGBoost 找分裂要遍历所有值',
      narrative: 'XGBoost 对每个特征的每个取值都比较分裂增益，数据大时很慢。',
      visual: {
        histogram: [],
        leaves: [{ id: 'root', depth: 0, isSplit: false }],
        note: '预排序算法：复杂度高、内存大。',
      },
    },
    {
      index: 1,
      title: '直方图：连续值装桶',
      narrative: '把连续特征分成 k 个桶，只在桶边界上找分裂，快很多。',
      visual: {
        histogram: [
          { bin: 1, count: 12, gradientSum: -3.2 },
          { bin: 2, count: 18, gradientSum: -1.1 },
          { bin: 3, count: 25, gradientSum: 0.8 },
          { bin: 4, count: 20, gradientSum: 2.4 },
          { bin: 5, count: 10, gradientSum: 3.1 },
        ],
        leaves: [{ id: 'root', depth: 0, isSplit: false }],
        note: 'k 通常取 255，从 O(n·特征数) 降到 O(桶数·特征数)。',
      },
    },
    {
      index: 2,
      title: 'Leaf-wise：总挑增益最大的叶子裂',
      narrative: '不像 Level-wise 逐层长，Leaf-wise 优先分裂当前增益最大的叶子，树更深更非对称。',
      visual: {
        histogram: [
          { bin: 1, count: 12, gradientSum: -3.2 },
          { bin: 2, count: 18, gradientSum: -1.1 },
          { bin: 3, count: 25, gradientSum: 0.8 },
          { bin: 4, count: 20, gradientSum: 2.4 },
          { bin: 5, count: 10, gradientSum: 3.1 },
        ],
        leaves: [
          { id: 'L', depth: 1, isSplit: true, gain: 1.9 },
          { id: 'R', depth: 1, isSplit: false, gain: 0.4 },
        ],
        note: '同样叶子数下误差降更多，但易过拟合（需限 num_leaves）。',
      },
    },
    {
      index: 3,
      title: 'GOSS：大梯度全留，小梯度抽样',
      narrative: '梯度大的样本对学习信息多，全保留；梯度小的样本抽样，省时省内存。',
      visual: {
        histogram: [
          { bin: 1, count: 12, gradientSum: -3.2 },
          { bin: 2, count: 9, gradientSum: -0.5 },
          { bin: 3, count: 25, gradientSum: 0.8 },
          { bin: 4, count: 10, gradientSum: 1.2 },
          { bin: 5, count: 10, gradientSum: 3.1 },
        ],
        leaves: [
          { id: 'L', depth: 1, isSplit: false },
          { id: 'R', depth: 1, isSplit: false },
        ],
        note: 'GOSS 保留 top-a% 大梯度，对剩余 b% 随机抽样并放大权重。',
      },
    },
    {
      index: 4,
      title: 'EFB：互斥特征捆绑成一个',
      narrative: '高维稀疏特征里很多互斥（几乎不同时非零），把它们捆绑成一列，大幅降维。',
      visual: {
        histogram: [
          { bin: 1, count: 12, gradientSum: -3.2 },
          { bin: 2, count: 18, gradientSum: -1.1 },
          { bin: 3, count: 25, gradientSum: 0.8 },
          { bin: 4, count: 20, gradientSum: 2.4 },
          { bin: 5, count: 10, gradientSum: 3.1 },
        ],
        leaves: [
          { id: 'L', depth: 1, isSplit: false },
          { id: 'R', depth: 1, isSplit: false },
        ],
        note: 'EFB 把 O(特征数) 降到 O(捆绑包数)，稀疏特征场景加速显著。',
      },
    },
  ],
};
```

- [ ] **Step 2: 提交**

```bash
git add src/data/boostingTrilogy/lightgbm.ts
git commit -m "feat(boosting-trilogy): LightGBM 演示预计算数据"
```

---

## Task 5: 聚合入口 + 跑数据测试

**Files:**
- Create: `src/data/boostingTrilogy/index.ts`

- [ ] **Step 1: 实现聚合入口**

创建 `src/data/boostingTrilogy/index.ts`：

```ts
// 中文注释：boostingTrilogy 数据模块入口
// 聚合三个 demo，对外暴露统一数组（时间线 + tab 用）。
import { gbdtDemo } from './gbdt';
import { xgboostDemo } from './xgboost';
import { lightgbmDemo } from './lightgbm';
import type { DemoData } from './types';

// 中文注释：统一按 DemoData<unknown> 暴露，组件层按 algorithmId 分发到具体渲染器
export const boostingTrilogy: DemoData<unknown>[] = [
  gbdtDemo as DemoData<unknown>,
  xgboostDemo as DemoData<unknown>,
  lightgbmDemo as DemoData<unknown>,
];

export { gbdtDemo, xgboostDemo, lightgbmDemo };
export * from './types';
```

- [ ] **Step 2: 运行数据测试，确认全绿**

Run: `npx vitest run tests/boostingTrilogy.test.ts`
Expected: PASS（三个 demo 的契约、索引连续、字段齐全全部通过）。

- [ ] **Step 3: 提交**

```bash
git add src/data/boostingTrilogy/index.ts
git commit -m "feat(boosting-trilogy): 聚合入口 + 数据测试通过"
```

---

## Task 6: Stepper 通用步进控件 + 步进逻辑测试

**目标：** 先做纯逻辑（step 边界 + 自动播放），用 TDD。组件渲染放后面。

**Files:**
- Test: `tests/boostingTrilogy.test.ts`（追加）
- Create: `src/components/sections/BoostingTrilogySection/Stepper.tsx`

- [ ] **Step 1: 追加步进逻辑失败测试**

在 `tests/boostingTrilogy.test.ts` 末尾追加测试用例（import 已在 Task 1 的顶部 import 块中写好，这里只追加 describe）：

```ts
// 测试意图：步进逻辑是演示器的交互核心——边界禁用、播放递进、手动干预。
// 抽成纯函数便于 node 环境测试，无需 DOM。
describe('步进逻辑', () => {
  it('nextStep 到末步不再前进', () => {
    expect(nextStep(4, 5)).toBe(4);
    expect(nextStep(2, 5)).toBe(3);
  });

  it('prevStep 到 0 不再后退', () => {
    expect(prevStep(0)).toBe(0);
    expect(prevStep(3)).toBe(2);
  });

  it('clampStep 把越界值拉回合法范围', () => {
    expect(clampStep(-1, 5)).toBe(0);
    expect(clampStep(10, 5)).toBe(4);
    expect(clampStep(2, 5)).toBe(2);
  });
});
```

- [ ] **Step 2: 运行测试，确认失败（函数未导出）**

Run: `npx vitest run tests/boostingTrilogy.test.ts`
Expected: FAIL（`nextStep/prevStep/clampStep` 未定义）。

- [ ] **Step 3: 实现 Stepper 组件 + 纯函数**

创建 `src/components/sections/BoostingTrilogySection/Stepper.tsx`：

```tsx
// 中文注释：通用步进控件 + 步进纯函数
// 纯函数抽出来便于测试；组件负责渲染按钮和步数指示。
import { useEffect, useRef, useState } from 'react';

// ---- 纯函数（可单测）----
export function clampStep(step: number, total: number): number {
  const max = Math.max(0, total - 1);
  return Math.min(Math.max(step, 0), max);
}

export function nextStep(step: number, total: number): number {
  return clampStep(step + 1, total);
}

// 中文注释：prevStep 只需下移一位且不低于 0（单参数，与 nextStep 的"total 约束"语义对称）
export function prevStep(step: number): number {
  return Math.max(step - 1, 0);
}

// ---- 组件 ----
interface StepperProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function Stepper({ current, total, onPrev, onNext, isPlaying, onTogglePlay }: StepperProps) {
  const atStart = current <= 0;
  const atEnd = current >= total - 1;

  return (
    <div className="bt-stepper">
      <button className="bt-step-btn" type="button" onClick={onPrev} disabled={atStart} aria-label="上一步">
        ◀ 上一步
      </button>
      <span className="bt-step-indicator">{current + 1} / {total}</span>
      <button className="bt-step-btn" type="button" onClick={onNext} disabled={atEnd} aria-label="下一步">
        下一步 ▶
      </button>
      <button className="bt-play-btn" type="button" onClick={onTogglePlay} aria-label={isPlaying ? '暂停' : '播放'}>
        {isPlaying ? '⏸ 暂停' : '⏯ 播放'}
      </button>
    </div>
  );
}

// ---- 自动播放 hook ----
// 中文注释：到末步自动停止；返回当前 step、播放状态和控制函数
export function useAutoPlay(total: number, intervalMs = 1500) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    // 末步停止
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    timerRef.current = setInterval(() => {
      setStep((prev) => {
        if (prev >= total - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, total, intervalMs]); // 注意：step 不进依赖，用函数式更新

  function goNext() {
    setStep((prev) => nextStep(prev, total));
  }
  function goPrev() {
    setStep((prev) => prevStep(prev));
  }
  function togglePlay() {
    // 点击播放时若已到末步，从头开始
    if (!playing && step >= total - 1) setStep(0);
    setPlaying((p) => !p);
  }

  return { step, playing, goNext, goPrev, togglePlay };
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `npx vitest run tests/boostingTrilogy.test.ts`
Expected: PASS（数据契约 + 步进逻辑全绿）。

- [ ] **Step 5: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/Stepper.tsx tests/boostingTrilogy.test.ts
git commit -m "feat(boosting-trilogy): Stepper 步进控件 + 纯函数测试"
```

---

## Task 7: EvolutionTimeline 演进时间线

**Files:**
- Create: `src/components/sections/BoostingTrilogySection/EvolutionTimeline.tsx`

- [ ] **Step 1: 实现时间线组件**

创建 `src/components/sections/BoostingTrilogySection/EvolutionTimeline.tsx`：

```tsx
// 中文注释：三代演进时间线——高亮当前算法，显示每代相对上代的新增点
import type { DemoData } from '../../../data/boostingTrilogy/types';

const CIRCLED = ['①', '②', '③']; // 三代序号

interface EvolutionTimelineProps {
  demos: DemoData<unknown>[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function EvolutionTimeline({ demos, activeId, onSelect }: EvolutionTimelineProps) {
  return (
    <ol className="bt-timeline" aria-label="三代演进时间线">
      {demos.map((demo, idx) => {
        const isActive = demo.algorithmId === activeId;
        return (
          <li
            key={demo.algorithmId}
            className={`bt-timeline-node ${isActive ? 'active' : ''}`}
          >
            <button type="button" className="bt-timeline-btn" onClick={() => onSelect(demo.algorithmId)}>
              <span className="bt-timeline-idx">{CIRCLED[idx]}</span>
              <span className="bt-timeline-name">{demo.algorithmName}</span>
            </button>
            <ul className="bt-timeline-additions">
              {demo.newAdditions.map((add) => (
                <li key={add}>{add}</li>
              ))}
            </ul>
            {idx < demos.length - 1 && <span className="bt-timeline-arrow" aria-hidden>→</span>}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/EvolutionTimeline.tsx
git commit -m "feat(boosting-trilogy): 演进时间线组件"
```

---

## Task 8: GBDT 演示渲染器

**目标：** 第一个可视化渲染器，打通"数据→SVG→步骤切换"骨架。用 SVG 画散点 + 残差柱。

**Files:**
- Create: `src/components/sections/BoostingTrilogySection/demos/GbdtDemo.tsx`

- [ ] **Step 1: 实现 GBDT 渲染器**

创建 `src/components/sections/BoostingTrilogySection/demos/GbdtDemo.tsx`：

```tsx
// 中文注释：GBDT 演示渲染器——散点 + 残差柱，随步骤变化
import type { GbdtVisual } from '../../../../data/boostingTrilogy/types';

interface GbdtDemoProps {
  visual: GbdtVisual;
}

// SVG 画布配置（viewBox 单位）
const W = 320;
const H = 200;
const PAD = 24;

// 中文注释：把 [0,1] 的数据值映射到 SVG 坐标
function sx(x: number) {
  return PAD + (x - 1) / 4 * (W - 2 * PAD); // x: 1..5
}
function sy(y: number) {
  return H - PAD - y * (H - 2 * PAD); // y: 0..1，翻转
}

export function GbdtDemo({ visual }: GbdtDemoProps) {
  const { points, round, newTree } = visual;

  return (
    <div className="bt-demo-visual">
      <svg viewBox={`0 0 ${W} ${H}`} className="bt-svg" role="img" aria-label={`GBDT 第 ${round} 轮`}>
        {/* 坐标轴 */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="bt-axis" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} className="bt-axis" />

        {/* 残差柱（真值到预测值）+ 真值点 + 预测点 */}
        {points.map((p) => {
          const yT = sy(p.yTrue);
          const yP = sy(p.yPred);
          return (
            <g key={p.x} className="bt-point-group">
              <line x1={sx(p.x)} y1={yT} x2={sx(p.x)} y2={yP} className="bt-residual-bar" />
              <circle cx={sx(p.x)} cy={yT} r={4} className="bt-true-point" />
              <circle cx={sx(p.x)} cy={yP} r={4} className="bt-pred-point" />
            </g>
          );
        })}
      </svg>

      {/* 本轮新增树说明 */}
      {newTree && (
        <p className="bt-tree-note">
          第 {round} 棵树：按 {newTree.feature} &lt; {newTree.threshold} 分裂，
          叶子值 [{newTree.leafValues[0]}, {newTree.leafValues[1]}]
        </p>
      )}
      {round === 0 && <p className="bt-tree-note">初始预测：所有样本输出均值</p>}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/demos/GbdtDemo.tsx
git commit -m "feat(boosting-trilogy): GBDT 演示 SVG 渲染器"
```

---

## Task 9: XGBoost 演示渲染器

**Files:**
- Create: `src/components/sections/BoostingTrilogySection/demos/XgboostDemo.tsx`

- [ ] **Step 1: 实现 XGBoost 渲染器**

创建 `src/components/sections/BoostingTrilogySection/demos/XgboostDemo.tsx`：

```tsx
// 中文注释：XGBoost 演示渲染器——样本的 g/h + 候选分裂增益条 + 最佳分裂高亮
import type { XgboostVisual } from '../../../../data/boostingTrilogy/types';

interface XgboostDemoProps {
  visual: XgboostVisual;
}

export function XgboostDemo({ visual }: XgboostDemoProps) {
  const { nodes, candidates, bestSplit, lambda, bestLeafWeight } = visual;
  const maxGain = Math.max(...candidates.map((c) => Math.abs(c.gain)), 0.01);

  return (
    <div className="bt-demo-visual">
      {/* 上：每个样本的 g、h */}
      <div className="bt-gh-grid">
        {nodes.map((n, i) => (
          <div key={i} className="bt-gh-cell">
            <span className="bt-gh-label">样本 {i + 1}</span>
            <span className="bt-gh-g">g={n.g.toFixed(2)}</span>
            <span className="bt-gh-h">h={n.h.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* 中：候选分裂增益条 */}
      {candidates.length > 0 && (
        <div className="bt-gain-bars">
          <p className="bt-mini-title">候选分裂增益（λ={lambda}）</p>
          {candidates.map((c) => {
            const isBest = bestSplit && c.threshold === bestSplit.threshold;
            return (
              <div key={c.threshold} className={`bt-gain-row ${isBest ? 'best' : ''}`}>
                <span className="bt-gain-thresh">x&lt;{c.threshold}</span>
                <div className="bt-gain-track">
                  <div
                    className="bt-gain-fill"
                    style={{ width: `${(Math.abs(c.gain) / maxGain) * 100}%` }}
                  />
                </div>
                <span className="bt-gain-val">{c.gain.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 下：闭式最优权重提示 */}
      {bestLeafWeight !== undefined && (
        <p className="bt-formula-note">闭式最优叶子权重 w* = −G/(H+λ)</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/demos/XgboostDemo.tsx
git commit -m "feat(boosting-trilogy): XGBoost 演示渲染器"
```

---

## Task 10: LightGBM 演示渲染器

**Files:**
- Create: `src/components/sections/BoostingTrilogySection/demos/LightgbmDemo.tsx`

- [ ] **Step 1: 实现 LightGBM 渲染器**

创建 `src/components/sections/BoostingTrilogySection/demos/LightgbmDemo.tsx`：

```tsx
// 中文注释：LightGBM 演示渲染器——直方图桶 + Leaf-wise 叶子列表 + GOSS/EFB 提示
import type { LightgbmVisual } from '../../../../data/boostingTrilogy/types';

interface LightgbmDemoProps {
  visual: LightgbmVisual;
}

export function LightgbmDemo({ visual }: LightgbmDemoProps) {
  const { histogram, leaves, note } = visual;
  const maxCount = Math.max(...histogram.map((b) => b.count), 1);

  return (
    <div className="bt-demo-visual">
      {/* 直方图 */}
      {histogram.length > 0 && (
        <div className="bt-histogram">
          <p className="bt-mini-title">特征直方图（装桶后）</p>
          <div className="bt-hist-bars">
            {histogram.map((b) => (
              <div key={b.bin} className="bt-hist-col">
                <div
                  className="bt-hist-bar"
                  style={{ height: `${(b.count / maxCount) * 100}%` }}
                  title={`桶${b.bin}: ${b.count}样本, 梯度和${b.gradientSum.toFixed(1)}`}
                />
                <span className="bt-hist-label">{b.bin}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaf-wise 叶子列表 */}
      <div className="bt-leaves">
        <p className="bt-mini-title">当前叶子（Leaf-wise：选增益最大的裂）</p>
        <ul className="bt-leaf-list">
          {leaves.map((leaf) => (
            <li key={leaf.id} className={`bt-leaf ${leaf.isSplit ? 'split' : ''}`}>
              {leaf.id} · 深度{leaf.depth}
              {leaf.gain !== undefined && ` · 增益${leaf.gain.toFixed(2)}`}
              {leaf.isSplit && <span className="bt-leaf-tag">本轮分裂</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* GOSS/EFB 提示 */}
      <p className="bt-note">{note}</p>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/demos/LightgbmDemo.tsx
git commit -m "feat(boosting-trilogy): LightGBM 演示渲染器"
```

---

## Task 11: 区块主壳组装

**目标：** 把时间线、tab、Stepper、三个渲染器组装成完整 section。tab 切换重置 step。

**Files:**
- Create: `src/components/sections/BoostingTrilogySection/index.tsx`

- [ ] **Step 1: 实现主壳**

创建 `src/components/sections/BoostingTrilogySection/index.tsx`：

```tsx
// 中文注释：梯度提升三连区块主壳
// 组合：演进时间线 + tab 切换 + 步进器 + 当前 demo 渲染器 + 讲解文字
import { useState } from 'react';
import { boostingTrilogy } from '../../../data/boostingTrilogy';
import type { AlgorithmId, DemoData } from '../../../data/boostingTrilogy/types';
import { EvolutionTimeline } from './EvolutionTimeline';
import { Stepper, useAutoPlay } from './Stepper';
import { GbdtDemo } from './demos/GbdtDemo';
import { XgboostDemo } from './demos/XgboostDemo';
import { LightgbmDemo } from './demos/LightgbmDemo';

// 中文注释：按 algorithmId 分发到具体渲染器
function renderDemo(id: AlgorithmId, visual: unknown) {
  switch (id) {
    case 'gbdt':
      return <GbdtDemo visual={visual as any} />;
    case 'xgboost':
      return <XgboostDemo visual={visual as any} />;
    case 'lightgbm':
      return <LightgbmDemo visual={visual as any} />;
  }
}

export function BoostingTrilogySection() {
  const [activeId, setActiveId] = useState<AlgorithmId>('gbdt');
  const activeDemo = boostingTrilogy.find((d) => d.algorithmId === activeId)!;

  return (
    <section id="boosting-trilogy" className="section-shell bt-section" aria-labelledby="bt-title">
      <div className="section-heading">
        <p className="eyebrow">Boosting Trilogy</p>
        <h2 id="bt-title">梯度提升三连 · 三代演进</h2>
        <p>决策树怎么做梯度下降？GBDT、XGBoost、LightGBM 如何层层加速。点击下方任一代开始演示。</p>
      </div>

      <EvolutionTimeline demos={boostingTrilogy} activeId={activeId} onSelect={setActiveId} />

      {/* tab 切换 */}
      <div className="bt-tabs" role="tablist">
        {boostingTrilogy.map((d) => (
          <button
            key={d.algorithmId}
            role="tab"
            aria-selected={d.algorithmId === activeId}
            className={`bt-tab ${d.algorithmId === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(d.algorithmId)}
          >
            {d.algorithmName}
          </button>
        ))}
      </div>

      {/* 当前 demo：用 key=activeId 重挂载，使 useAutoPlay 内部 step 随 tab 切换自动重置为 0 */}
      <DemoStage key={activeId} demo={activeDemo} />
    </section>
  );
}

// 中文注释：把"舞台 + 步进器"拆成子组件，靠父级 key 重挂载重置 useAutoPlay 状态
interface DemoStageProps {
  demo: DemoData<unknown>;
}

function DemoStage({ demo }: DemoStageProps) {
  const { step, playing, goNext, goPrev, togglePlay } = useAutoPlay(demo.steps.length);
  const current = demo.steps[step];

  return (
    <div className="bt-demo-stage">
      <div className="bt-demo-layout">
        {/* 左：可视化 */}
        <div className="bt-demo-canvas">
          {renderDemo(demo.algorithmId, current.visual)}
        </div>
        {/* 右：讲解 */}
        <div className="bt-demo-narrative">
          <h3>{current.title}</h3>
          <p>{current.narrative}</p>
          <div className="bt-new-additions">
            <span className="bt-mini-title">本代相对上一代新增：</span>
            <ul>
              {demo.newAdditions.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <Stepper
        current={step}
        total={demo.steps.length}
        onPrev={goPrev}
        onNext={goNext}
        isPlaying={playing}
        onTogglePlay={togglePlay}
      />
    </div>
  );
}
```

> 上面的 `DemoStage` 子组件用到了 `DemoData` 类型，已在上面的 import 中和 `AlgorithmId` 一起引入（`import type { AlgorithmId, DemoData } ...`）。把舞台拆成子组件 + 父级 `key={activeId}` 是 tab 切换重置 step 的干净做法（无需手动 useEffect 重置，React 重挂载自动归零）。

- [ ] **Step 2: 提交**

```bash
git add src/components/sections/BoostingTrilogySection/index.tsx
git commit -m "feat(boosting-trilogy): 区块主壳组装"
```

---

## Task 12: 样式

**Files:**
- Create: `src/styles/boosting-trilogy.css`
- Modify: `src/styles.css`（顶部加 import）

- [ ] **Step 1: 写区块样式**

创建 `src/styles/boosting-trilogy.css`，全部用 CSS 变量着色（复用 `--accent`/`--panel`/`--text` 等），关键类名：`.bt-section` `.bt-timeline` `.bt-tabs` `.bt-demo-stage` `.bt-demo-layout` `.bt-stepper` `.bt-svg` `.bt-axis` `.bt-residual-bar` `.bt-true-point` `.bt-pred-point` `.bt-gh-grid` `.bt-gain-bars` `.bt-histogram` `.bt-leaves`。含 `@media (max-width: 720px)` 纵向堆叠 + transition 动画。

```css
/* 中文注释：梯度提升三连区块样式——全部用 CSS 变量，跟随明暗主题 */
.bt-section { padding-block: 4rem; }

/* 演进时间线 */
.bt-timeline {
  list-style: none; display: flex; gap: 1rem; flex-wrap: wrap;
  padding: 1rem; margin: 1.5rem 0;
  background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
}
.bt-timeline-node { position: relative; display: flex; flex-direction: column; gap: .35rem; }
.bt-timeline-btn {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .5rem .8rem; border-radius: 8px; border: 1px solid var(--line);
  background: var(--bg); color: var(--text); cursor: pointer;
  transition: all .2s;
}
.bt-timeline-node.active .bt-timeline-btn {
  border-color: var(--accent); color: var(--accent); font-weight: 600;
}
.bt-timeline-additions {
  list-style: none; margin: 0; padding-left: .8rem; font-size: .8rem; color: var(--muted);
}
.bt-timeline-additions li::before { content: '＋ '; color: var(--accent); }
.bt-timeline-arrow { color: var(--muted); align-self: center; }

/* tab */
.bt-tabs { display: flex; gap: .5rem; border-bottom: 1px solid var(--line); margin-bottom: 1rem; }
.bt-tab {
  padding: .6rem 1rem; border: none; background: none; color: var(--muted);
  cursor: pointer; border-bottom: 2px solid transparent; transition: all .2s;
}
.bt-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* 演示舞台 */
.bt-demo-stage { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 1.5rem; }
.bt-demo-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.5rem; }
.bt-demo-canvas { min-height: 240px; }
.bt-demo-narrative h3 { color: var(--accent); margin-top: 0; }
.bt-new-additions { margin-top: 1rem; padding-top: .8rem; border-top: 1px dashed var(--line); }
.bt-mini-title { font-size: .8rem; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }

/* SVG 共用 */
.bt-svg { width: 100%; height: auto; }
.bt-axis { stroke: var(--line); stroke-width: 1; }
.bt-residual-bar { stroke: var(--accent-pink); stroke-width: 2; transition: all .4s ease; }
.bt-true-point { fill: var(--accent); transition: all .4s ease; }
.bt-pred-point { fill: var(--accent-blue); transition: all .4s ease; }
.bt-tree-note { font-size: .85rem; color: var(--muted); margin-top: .5rem; }

/* XGBoost g/h 网格 */
.bt-gh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: .4rem; margin-bottom: 1rem; }
.bt-gh-cell {
  display: flex; flex-direction: column; padding: .4rem; font-size: .75rem;
  background: var(--bg); border: 1px solid var(--line); border-radius: 6px;
}
.bt-gh-label { color: var(--muted); }
.bt-gh-g { color: var(--accent); }
.bt-gh-h { color: var(--accent-pink); }

/* 增益条 */
.bt-gain-row { display: flex; align-items: center; gap: .5rem; margin: .25rem 0; }
.bt-gain-thresh { width: 60px; font-size: .8rem; color: var(--muted); }
.bt-gain-track { flex: 1; height: 10px; background: var(--panel-strong); border-radius: 5px; overflow: hidden; }
.bt-gain-fill { height: 100%; background: var(--accent-blue); transition: width .4s ease; }
.bt-gain-row.best .bt-gain-fill { background: var(--accent); }
.bt-gain-row.best .bt-gain-val { font-weight: 700; color: var(--accent); }
.bt-gain-val { width: 40px; text-align: right; font-size: .8rem; }
.bt-formula-note { font-size: .8rem; color: var(--muted); margin-top: .8rem; }

/* 直方图 */
.bt-hist-bars { display: flex; align-items: flex-end; gap: .4rem; height: 100px; }
.bt-hist-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; }
.bt-hist-bar { width: 100%; background: var(--accent-blue); border-radius: 4px 4px 0 0; transition: height .4s ease; }
.bt-hist-label { font-size: .7rem; color: var(--muted); margin-top: .2rem; }

/* 叶子列表 */
.bt-leaf-list { list-style: none; padding: 0; }
.bt-leaf { padding: .3rem .5rem; border-radius: 6px; font-size: .85rem; background: var(--bg); margin: .2rem 0; }
.bt-leaf.split { border-left: 3px solid var(--accent); color: var(--accent); font-weight: 600; }
.bt-leaf-tag { margin-left: .5rem; font-size: .7rem; background: var(--accent); color: var(--bg); padding: .1rem .4rem; border-radius: 4px; }
.bt-note { font-size: .8rem; color: var(--muted); font-style: italic; margin-top: .8rem; }

/* 步进器 */
.bt-stepper { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--line); }
.bt-step-btn, .bt-play-btn {
  padding: .4rem .9rem; border-radius: 8px; border: 1px solid var(--line);
  background: var(--bg); color: var(--text); cursor: pointer; transition: all .2s;
}
.bt-step-btn:hover:not(:disabled), .bt-play-btn:hover { border-color: var(--accent); color: var(--accent); }
.bt-step-btn:disabled { opacity: .4; cursor: not-allowed; }
.bt-step-indicator { font-variant-numeric: tabular-nums; color: var(--muted); min-width: 50px; text-align: center; }

/* 窄屏纵向堆叠 */
@media (max-width: 720px) {
  .bt-demo-layout { grid-template-columns: 1fr; }
  .bt-timeline { flex-direction: column; }
}
```

- [ ] **Step 2: 在 styles.css 顶部加 import**

修改 `src/styles.css`，在现有 `@import` 列表后追加一行：

```css
@import './styles/boosting-trilogy.css';
```

- [ ] **Step 3: 提交**

```bash
git add src/styles/boosting-trilogy.css src/styles.css
git commit -m "feat(boosting-trilogy): 区块样式 + 挂载到 styles.css"
```

---

## Task 13: 挂载到 App + Header 导航

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: App.tsx 挂载 section**

在 `src/App.tsx` 的 import 区加：

```tsx
import { BoostingTrilogySection } from './components/sections/BoostingTrilogySection';
```

在 `<ConceptSection />` 与 `<RoadmapSection />` 之间插入：

```tsx
<ConceptSection />

<BoostingTrilogySection />

<RoadmapSection
```

- [ ] **Step 2: Header.tsx 加导航锚点**

在 `src/components/layout/Header.tsx` 的 `<nav className="nav-links">` 内，`<a href="#algorithms">算法图谱</a>` 之后加：

```tsx
<a href="#boosting-trilogy">梯度提升</a>
```

- [ ] **Step 3: 本地启动验证渲染无报错**

Run: `npm run dev`
手动检查：浏览器打开，导航栏有"梯度提升"，点击滚动到新区块，三个 tab 切换 + 步进 + 自动播放正常，明暗主题切换无破图。
Expected: 无控制台报错，演示器可交互。

- [ ] **Step 4: 提交**

```bash
git add src/App.tsx src/components/layout/Header.tsx
git commit -m "feat(boosting-trilogy): 挂载 section + Header 导航入口"
```

---

## Task 14: 扩展结构测试 + 全量验证

**目标：** 保护新增的骨架契约不被后续重构破坏。

**Files:**
- Modify: `tests/website-structure.test.cjs`

- [ ] **Step 1: 追加结构断言**

在 `tests/website-structure.test.cjs` 的 `console.log` 之前追加：

```js
// ---- 12. 梯度提升三连模块骨架契约 ----
// 意图：保护这个可视化教学模块的入口和核心结构不被无意删除。
assert(exists('src/components/sections/BoostingTrilogySection/index.tsx'), 'BoostingTrilogySection should exist');
const boostingSource = readDir('src/components/sections/BoostingTrilogySection', '.tsx');
['BoostingTrilogySection', 'EvolutionTimeline', 'useAutoPlay'].forEach((text) => {
  assert(boostingSource.includes(text), `BoostingTrilogySection should include ${text}`);
});
// Header 含锚点
const headerSource = read('src/components/layout/Header.tsx');
assert(headerSource.includes('#boosting-trilogy'), 'Header should link to #boosting-trilogy');
// App 挂载了 section
assert(app.includes('BoostingTrilogySection'), 'App should mount BoostingTrilogySection');
// CSS 含关键类
const boostingStyles = read('src/styles/boosting-trilogy.css');
['.bt-section', '.bt-timeline', '.bt-stepper', '@media'].forEach((cls) => {
  assert(boostingStyles.includes(cls), `boosting-trilogy.css should include ${cls}`);
});
// 数据契约：三个 demo 文件存在
['gbdt', 'xgboost', 'lightgbm'].forEach((id) => {
  assert(exists(`src/data/boostingTrilogy/${id}.ts`), `boostingTrilogy/${id}.ts should exist`);
});
```

- [ ] **Step 2: 跑结构测试**

Run: `npm run test:structure`
Expected: `React website structure checks passed.`

- [ ] **Step 3: 跑全量 vitest**

Run: `npx vitest run`
Expected: 全部 PASS（含原有 clusterLayout/narrative/useProgress + 新增 boostingTrilogy）。

- [ ] **Step 4: 跑构建**

Run: `npm run build`
Expected: 构建成功，无 TS 报错。

- [ ] **Step 5: 提交**

```bash
git add tests/website-structure.test.cjs
git commit -m "test(boosting-trilogy): 结构骨架契约断言"
```

---

## 验收清单（全部 ✅ 即完成）

- [ ] 导航栏有"梯度提升"入口，点击平滑滚动到区块
- [ ] 三代演进时间线显示，点击可切换
- [ ] 三个 tab（GBDT/XGBoost/LightGBM）切换正常，step 重置
- [ ] 步进器：上一步/下一步边界禁用正确，步数指示正确
- [ ] 自动播放：每 1.5s 推进，末步停止
- [ ] 三个 demo 的可视化随步骤正确变化（散点/增益条/直方图）
- [ ] 明/暗主题切换无破图
- [ ] 窄屏（<720px）纵向堆叠正常
- [ ] `npm run test:structure` 通过
- [ ] `npx vitest run` 全绿
- [ ] `npm run build` 成功
```
