# 任务：梯度提升三连 · 加入随机森林对比块

- 日期：2026-07-12
- 状态：已完成
- 关联：在已上线的 boosting-trilogy 模块顶部加"Bagging vs Boosting 两大流派"对比块

## 1. 目标

集成学习有两大流派——Bagging（代表：随机森林）和 Boosting（代表：GBDT 系列）。现有模块只讲 Boosting 三代演进，缺少流派对照。在 section 顶部加一个静态对比块，讲清两大流派区别，再自然过渡到三代演进。

### 设计决策（已确认）
- **方案 B**：开头加对比块，不打乱现有三代演进骨架，随机森林不塞进演进时间线（它是平行流派，不是 GBDT 前身）。
- **4 个对比维度**：训练方式（并行/串行）、目标（降方差/降偏差）、样本/特征使用、优劣对比。

### 成功标准（可验证）
1. section 标题下方、演进时间线上方，新增"集成学习两大流派"对比块。
2. 对比块是静态两列表格（Bagging/随机森林 vs Boosting/GBDT），含 4 行：训练方式、目标、样本/特征、优劣。
3. 现有演进时间线、3 个 demo、步进器、tab 全部不动，行为不变。
4. 复用 CSS 变量，明/暗主题 + 窄屏正常。
5. `tsc` + `test:structure` + `vitest`(32) + `build` 全过；浏览器复验对比块渲染正确。

### 非目标（YAGNI）
- 不给随机森林做分步互动 demo（那是方案 C，工作量大；本次只做静态对比）。
- 不改 `AlgorithmId` 联合类型（随机森林不进 demo 数据体系）。
- 不改演进时间线（仍是 3 代）。
- 不改三个 demo 的数据和渲染器。

---

## 2. 改动文件清单（最小集合）

| 文件 | 改动 | 内容 |
|---|---|---|
| `src/components/sections/BoostingTrilogySection/BaggingVsBoosting.tsx` | 新建 | 静态对比块组件（两列 + 4 行） |
| `src/components/sections/BoostingTrilogySection/index.tsx` | 改 1 处 | 在标题块和时间线之间挂载对比块 |
| `src/styles/boosting-trilogy.css` | 补样式 | 对比块表格样式（`.bt-paradigm-*`） |

数据用静态常量内嵌在组件里（4 行 × 2 列，固定教学文案，无需进 data 体系）。

---

## 3. 对比块内容（4 维度，已起草）

| 维度 | Bagging · 随机森林 | Boosting · GBDT |
|---|---|---|
| **训练方式** | 并行：多棵树各自独立训练 | 串行：后一棵拟合前一棵的残差 |
| **目标** | 降方差（多棵树投票/平均，稳） | 降偏差（逐步修正，准） |
| **样本/特征** | 有放回采样 + 随机选特征 | 用全量样本，每轮拟合负梯度 |
| **优劣** | 抗过拟合、好调参；精度上限低 | 精度高、常胜竞赛；对噪声敏感、易过拟合 |

底部一句过渡："下面三代（GBDT→XGBoost→LightGBM）都属于 Boosting 流派，层层演进。"

---

## 4. 步骤分解与验收

### Step 1：新建 BaggingVsBoosting 组件
- 静态两列表格，4 行数据内嵌为常量。
- 验收：`tsc` 通过；组件导出 `BaggingVsBoosting`。

### Step 2：挂载到 section 主壳
- 在 `<EvolutionTimeline />` 之前插入 `<BaggingVsBoosting />`。
- 验收：页面渲染出对比块；现有功能不受影响。

### Step 3：补样式
- `.bt-paradigm-table` 等类，用 CSS 变量，窄屏下表格横向可滑。
- 验收：明暗主题正常、窄屏可读。

### Step 4：全量验证 + 浏览器复验
- `tsc` + `test:structure` + `vitest`(32) + `build`。
- Playwright 截图：明色 + 暗色 + 窄屏。

---

## 5. 进度跟踪

- [ ] Step 1：新建 BaggingVsBoosting 组件
- [ ] Step 2：挂载到 section
- [ ] Step 3：补样式
- [ ] Step 4：全量验证 + 浏览器复验
