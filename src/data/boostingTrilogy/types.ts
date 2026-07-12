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
  eta: number;          // 学习率（收缩系数），F_m = F_{m-1} + eta × 叶子值
  prevPred?: number[];  // 上一轮各样本预测值（用于展示 F_{m-1}，step 0 无）
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
