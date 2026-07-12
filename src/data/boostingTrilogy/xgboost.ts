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
      narrative:
        'GBDT 只用一阶导（负梯度 g）。XGBoost 把 Loss 对预测值做泰勒展开到二阶项，' +
        '所以每个样本除 g 还有 h（二阶导）。g 给方向、h 给曲率，下降方向和步长更准。',
      visual: {
        lambda: 1,
        nodes: SAMPLE_NODES,
        candidates: [],
      },
    },
    {
      index: 2,
      title: '分裂打分公式',
      narrative:
        '用 g、h 的累加 G、H，能闭式算出每个候选分裂的增益——不用真的去拟合回归树。' +
        '这是 XGBoost 比 GBDT 更快、更稳的关键之一。',
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
