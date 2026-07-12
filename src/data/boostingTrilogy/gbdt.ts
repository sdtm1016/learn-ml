// 中文注释：GBDT 演示预计算数据
// 数值来源：5 样本，真值 [0.1,0.3,0.5,0.7,0.9]，初始预测=均值 0.5，学习率 η=0.3。
// 每轮按 x<2.5 分裂，叶子值=该叶残差均值，更新 F_m = F_{m-1} + η × 叶子值。
// 残差随轮次稳步缩小但不归零——正是 η<1 的意义（收缩防过拟合，需更多轮才完全拟合）。
// 所有数值由脚本逐项算出，保证 F_m = F_{m-1} + η×leafValue 自洽。
import type { DemoData, GbdtVisual } from './types';

export const gbdtDemo: DemoData<GbdtVisual> = {
  algorithmId: 'gbdt',
  algorithmName: '梯度提升树',
  algorithmLabel: 'GBDT',
  oneLiner: '用决策树做梯度下降，每棵新树拟合前一轮的负梯度（残差）。',
  newAdditions: ['拟合负梯度（残差）', '学习率 η 控步长', '串行加法模型 F = F + η·h'],
  steps: [
    {
      index: 0,
      title: '初始：预测=均值',
      narrative:
        '第 0 轮，模型输出所有样本真值的均值 0.5。残差 = 真值 − 预测。' +
        '关键：在 MSE 损失下，残差恰好就是损失函数对预测值的负梯度——所以"拟合残差"本质上就是"沿梯度下降方向走一步"。',
      visual: {
        round: 0,
        eta: 0.3,
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
      title: '第 1 棵树：拟合负梯度（残差）',
      narrative:
        '种一棵树去拟合当前的负梯度（残差）。但每步只走 η=0.3 的小步：' +
        'F₁ = F₀ + η × 叶子值。学习率小，防过拟合——这是 GBDT 调参的第一参数。',
      visual: {
        round: 1,
        eta: 0.3,
        prevPred: [0.5, 0.5, 0.5, 0.5, 0.5],
        newTree: { feature: 'x', threshold: 2.5, leafValues: [-0.3, 0.2] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.41, residual: -0.31 },
          { x: 2, yTrue: 0.3, yPred: 0.41, residual: -0.11 },
          { x: 3, yTrue: 0.5, yPred: 0.56, residual: -0.06 },
          { x: 4, yTrue: 0.7, yPred: 0.56, residual: 0.14 },
          { x: 5, yTrue: 0.9, yPred: 0.56, residual: 0.34 },
        ],
      },
    },
    {
      index: 2,
      title: '第 2 棵树：再拟合新残差',
      narrative:
        '对更新后的残差再种一棵树，仍只走 η=0.3 的小步。注意残差在稳步缩小，但远未归零——小步长意味着需要更多棵树才能完全拟合。',
      visual: {
        round: 2,
        eta: 0.3,
        prevPred: [0.41, 0.41, 0.56, 0.56, 0.56],
        newTree: { feature: 'x', threshold: 2.5, leafValues: [-0.21, 0.14] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.35, residual: -0.25 },
          { x: 2, yTrue: 0.3, yPred: 0.35, residual: -0.05 },
          { x: 3, yTrue: 0.5, yPred: 0.6, residual: -0.1 },
          { x: 4, yTrue: 0.7, yPred: 0.6, residual: 0.1 },
          { x: 5, yTrue: 0.9, yPred: 0.6, residual: 0.3 },
        ],
      },
    },
    {
      index: 3,
      title: '第 3 棵树：残差继续缩小',
      narrative:
        '再来一棵，预测值继续逼近真值，残差进一步收敛。η 越小越稳但越慢——实际任务常配几十到几百棵树。',
      visual: {
        round: 3,
        eta: 0.3,
        prevPred: [0.35, 0.35, 0.6, 0.6, 0.6],
        newTree: { feature: 'x', threshold: 2.5, leafValues: [-0.15, 0.1] },
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.3, residual: -0.2 },
          { x: 2, yTrue: 0.3, yPred: 0.3, residual: 0.0 },
          { x: 3, yTrue: 0.5, yPred: 0.63, residual: -0.13 },
          { x: 4, yTrue: 0.7, yPred: 0.63, residual: 0.07 },
          { x: 5, yTrue: 0.9, yPred: 0.63, residual: 0.27 },
        ],
      },
    },
    {
      index: 4,
      title: '小结：用决策树做梯度下降',
      narrative:
        'GBDT = 用决策树做梯度下降。每棵树沿负梯度（残差）方向走一小步 η，多棵弱树累加成强模型。' +
        '后续 XGBoost 把"一阶导"升级到"二阶导"，LightGBM 在同一框架下做得更快——三代同源。',
      visual: {
        round: 4,
        eta: 0.3,
        points: [
          { x: 1, yTrue: 0.1, yPred: 0.3, residual: -0.2 },
          { x: 2, yTrue: 0.3, yPred: 0.3, residual: 0.0 },
          { x: 3, yTrue: 0.5, yPred: 0.63, residual: -0.13 },
          { x: 4, yTrue: 0.7, yPred: 0.63, residual: 0.07 },
          { x: 5, yTrue: 0.9, yPred: 0.63, residual: 0.27 },
        ],
      },
    },
  ],
};
