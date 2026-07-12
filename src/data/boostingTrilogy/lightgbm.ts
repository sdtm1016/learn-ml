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
      narrative:
        'LightGBM 继承 XGBoost 的二阶导 + 分裂打分框架，只是把"找最优分裂"这一步做得更快更省。' +
        '先看 XGBoost 的痛点：它对每个特征的每个取值都比较分裂增益，数据大时很慢。',
      visual: {
        histogram: [],
        leaves: [{ id: 'root', depth: 0, isSplit: false }],
        note: '预排序算法：复杂度高、内存大。',
      },
    },
    {
      index: 1,
      title: '直方图：连续值装桶',
      narrative:
        '直方图不改算法本质（还是找让增益最大的分裂），只是把连续值装进 k 个桶、' +
        '在桶边界上比，从 O(样本数) 降到 O(桶数)，快很多。',
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
