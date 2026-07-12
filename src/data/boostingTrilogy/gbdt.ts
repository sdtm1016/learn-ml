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
        round: 4,
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
