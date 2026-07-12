# 任务：梯度提升三连 · 基于 GBDT 通俗教程的内容润色

- 日期：2026-07-12
- 来源：对照微信公众号 GBDT 通俗教程分析
- 状态：已完成
- 关联：在已上线的 boosting-trilogy 模块上做教学深度补强，不改架构

## 1. 目标

对照一篇讲透 GBDT 的通俗教程，补强现有「梯度提升三连」模块中**教学价值高但讲浅或漏掉**的点。三个 demo 都润色，但 GBDT 是重点（文章只讲 GBDT）。

### 成功标准（可验证）
1. GBDT demo 显式展示学习率 η（取 0.3），数值链 `F_m = F_{m-1} + η × leafValue` 自洽（已用脚本算好）。
2. GBDT 第 0/1 步 narrative 点破"残差 = MSE 的负梯度 = ∂L/∂F"，把 GBDT 与梯度下降的概念桥梁搭起来。
3. GBDT 渲染器展示预测值更新公式 `F_m = F_{m-1} + η × 叶子值` + 本轮各样本残差小表。
4. XGBoost demo 的 narrative 点透"二阶导 = 把泰勒展开用到 Loss 上，所以能用 g、h 闭式算最优分裂"（呼应 GBDT 的负梯度视角）。
5. LightGBM demo 的 narrative 点透"直方图 + Leaf-wise 是在 XGBoost 同一套梯度框架下做工程加速"（呼应前两代的继承关系）。
6. 不破坏既有数据契约：`tests/boostingTrilogy.test.ts`（16 测试）+ `website-structure.test.cjs` 全绿；typecheck + build 通过。
7. 浏览器复验：明/暗主题 + 窄屏渲染正常，η 与公式可见。

### 非目标（YAGNI）
- 不引入新的损失函数切换演示（MAE/LogLoss）——文章只讲 MSE，加这个是过度设计。
- 不改架构、不改演示器骨架（timeline/tab/stepper 保持不动）。
- 不改 XGBoost/LightGBM 的核心机制数据（gain/直方图），只润色 narrative 和少量标注。
- 不改 `AlgorithmId` 联合类型等公共契约。

---

## 2. 改动文件清单（最小集合）

| 文件 | 改动类型 | 内容 |
|---|---|---|
| `src/data/boostingTrilogy/types.ts` | 扩展 | `GbdtVisual` 加 `eta: number` + `prevPred?: number[]`（上轮预测，用于展示递推） |
| `src/data/boostingTrilogy/gbdt.ts` | 重写数值 | 用 η=0.3 重新算的 5 步数据 + 点破残差=负梯度的 narrative |
| `src/data/boostingTrilogy/xgboost.ts` | 润色 narrative | 强化"二阶导=泰勒展开 Loss"的讲解，数据不变 |
| `src/data/boostingTrilogy/lightgbm.ts` | 润色 narrative | 强化"继承 XGBoost 梯度框架、做工程加速"的讲解，数据不变 |
| `src/components/sections/BoostingTrilogySection/demos/GbdtDemo.tsx` | 增强 | 加 η 显示、预测值更新公式行、本轮残差小表 |
| `src/styles/boosting-trilogy.css` | 小补 | 新增的公式行/残差小表样式 |

测试文件 `tests/boostingTrilogy.test.ts` 预期无需改（契约未破坏），但需跑一遍确认。

---

## 3. GBDT 数值表（η=0.3，已用脚本验证自洽）

5 样本，真值 `[0.1, 0.3, 0.5, 0.7, 0.9]`，初始预测=均值 `0.5`，η=0.3。
每轮按 `x<2.5` 分裂（左=样本0,1；右=样本2,3,4），叶子值=该叶残差均值。

| 轮次 | 叶子值 [左,右] | F (更新后) | 残差 (更新后) |
|---|---|---|---|
| 0 (初始) | — | [0.5, 0.5, 0.5, 0.5, 0.5] | [-0.4, -0.2, 0, 0.2, 0.4] |
| 1 | [-0.30, 0.20] | [0.41, 0.41, 0.56, 0.56, 0.56] | [-0.31, -0.11, -0.06, 0.14, 0.34] |
| 2 | [-0.21, 0.14] | [0.347, 0.347, 0.602, 0.602, 0.602] | [-0.247, -0.047, -0.102, 0.098, 0.298] |
| 3 | [-0.147, 0.098] | [0.303, 0.303, 0.631, 0.631, 0.631] | [-0.203, -0.003, -0.131, 0.069, 0.269] |

**教学说明**：残差随轮次稳步缩小但**不会 3 轮归零**——这正是 η<1 的意义（收缩防过拟合，要更多轮才完全拟合）。比原版"3 轮完美拟合"更真实，也更点题。

为简洁，数据里 F/残差保留 2 位小数（0.347→0.35 等），教学场景 2 位足够。

---

## 4. 步骤分解与验收

### Step 1：扩展 GbdtVisual 类型
- 改 `types.ts`：`GbdtVisual` 加 `eta: number`、`prevPred?: number[]`（上轮预测值，用于展示 F_{m-1}）。
- 验收：`tsc -b` 通过；既有字段不删（向后兼容 XGBoost/LightGBM 不受影响）。

### Step 2：重写 GBDT 数据（gbdt.ts）
- 用上面数值表的 η=0.3 数据重写 5 步。
- narrative 强化：
  - step 0："残差 = 真值 − 预测。在 MSE 损失下，残差恰好就是损失函数对预测值的**负梯度**——所以拟合残差 = 沿梯度方向下降一步。"
  - step 1："新树拟合负梯度（残差）。但每步只走 η=0.3 的小步：F₁ = F₀ + 0.3 × 叶子值。学习率小，防过拟合。"
  - step 2/3：强调残差稳步缩小、η 控制步长。
  - step 4 小结："GBDT = 用决策树做梯度下降。每棵树沿负梯度（残差）方向走一小步 η，多棵弱树累加成强模型。"
- 验收：数据契约测试通过（steps 4-6 步、index 连续、字段齐全）。

### Step 3：增强 GBDT 渲染器（GbdtDemo.tsx）
- 顶部显示 `学习率 η = 0.3` 标签。
- 当 `newTree` 存在时，显示更新公式行：`F₁ = F₀ + η × 叶子值`（用实际数值，如 `0.56 = 0.5 + 0.3 × 0.20`，取该步右叶示例）。
- 加"本轮残差"小表（5 个样本的 residual 值，正负不同色）。
- 验收：浏览器可见 η、公式、残差表；typecheck 通过。

### Step 4：润色 XGBoost narrative（xgboost.ts）
- step 1（引入二阶导）：补"GBDT 只用一阶导（负梯度）。XGBoost 把 Loss 做泰勒展开到二阶项，所以每个样本除 g 还有 h（二阶导），下降方向和步长更准。"
- step 2（分裂打分）：补"用 g、h 的累加 G、H，能闭式算出每个分裂的增益——不用真的去拟合回归树。"
- 数据数值**不动**。
- 验收：narrative 文字更新、数据契约测试仍过。

### Step 5：润色 LightGBM narrative（lightgbm.ts）
- step 0：补"LightGBM 继承 XGBoost 的二阶导 + 分裂打分框架，只是把'找最优分裂'这一步做得更快更省。"
- step 1（直方图）：补"直方图不改算法本质（还是找让增益最大的分裂），只是把连续值装桶、在桶边界上比，从 O(样本数) 降到 O(桶数)。"
- 数据数值**不动**。
- 验收：同上。

### Step 6：补样式（boosting-trilogy.css）
- 新增 `.bt-eta-badge`（学习率徽标）、`.bt-formula-row`（更新公式行）、`.bt-residual-table`（残差小表）样式，全部用 CSS 变量。
- 验收：明暗主题都正常。

### Step 7：全量验证 + 浏览器复验
- `tsc -b` + `test:structure` + `vitest run`（32 测试全绿）+ `npm run build`。
- Playwright 截图：GBDT step1（看 η、公式、残差表）、XGBoost、LightGBM、暗色、窄屏。
- 验收：所有可见、无破图。

---

## 5. 进度跟踪

- [x] Step 1：扩展类型
- [x] Step 2：重写 GBDT 数据
- [x] Step 3：增强 GBDT 渲染器
- [x] Step 4：润色 XGBoost narrative
- [x] Step 5：润色 LightGBM narrative
- [x] Step 6：补样式
- [x] Step 7：全量验证 + 浏览器复验
