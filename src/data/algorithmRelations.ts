// 中文注释：算法关系数据，定义算法之间的各种关系类型
// 所有 source/target 必须与 algorithms.ts 中的 name 字段完全一致，否则关系图会出现悬空边。

export type RelationType =
  | 'derives_from'   // 派生自（例如：Random Forest 派生自 Decision Tree）
  | 'similar_to'     // 相似于（例如：KNN 与 K-Means 相似）
  | 'combines'       // 组合（例如：XGBoost 组合了多个 Decision Tree）
  | 'improved_by'    // 改进版（例如：Adam 是 SGD 的改进）
  | 'used_in';       // 用于（例如：Backpropagation 用于 Neural Network）

export interface AlgorithmRelation {
  source: string;      // 源算法名称（须等于 algorithms.ts 的 name）
  target: string;      // 目标算法名称（须等于 algorithms.ts 的 name）
  type: RelationType;
  label?: string;      // 关系说明
  strength?: number;   // 关系强度 0-1，用于边的粗细
}

// 中文注释：算法关系数据集
// 维护规则：新增/删除算法时，需同步检查这里的 source/target 是否仍然指向真实存在的节点。
export const algorithmRelations: AlgorithmRelation[] = [
  // 决策树家族
  { source: '决策树', target: '随机森林', type: 'improved_by', strength: 0.9 },
  { source: '决策树', target: '梯度提升树', type: 'improved_by', strength: 0.9 },
  { source: '决策树', target: 'XGBoost', type: 'improved_by', strength: 0.8 },
  { source: '决策树', target: 'LightGBM', type: 'improved_by', strength: 0.8 },
  { source: '决策树', target: 'CatBoost', type: 'improved_by', strength: 0.8 },
  { source: '梯度提升树', target: 'XGBoost', type: 'improved_by', strength: 0.9 },
  { source: '梯度提升树', target: 'LightGBM', type: 'improved_by', strength: 0.9 },
  { source: 'XGBoost', target: 'LightGBM', type: 'similar_to', strength: 0.8 },
  { source: 'XGBoost', target: 'CatBoost', type: 'similar_to', strength: 0.8 },

  // 线性模型家族
  { source: '线性回归', target: '岭回归', type: 'improved_by', strength: 0.8 },
  { source: '线性回归', target: 'Lasso回归', type: 'improved_by', strength: 0.8 },
  { source: '线性回归', target: 'Elastic Net', type: 'improved_by', strength: 0.8 },
  { source: '岭回归', target: 'Elastic Net', type: 'combines', strength: 0.7 },
  { source: 'Lasso回归', target: 'Elastic Net', type: 'combines', strength: 0.7 },
  { source: '线性回归', target: '逻辑回归', type: 'similar_to', strength: 0.7 },

  // 聚类家族
  { source: 'K-Means', target: 'DBSCAN', type: 'similar_to', strength: 0.5 },
  { source: 'K-Means', target: '层次聚类', type: 'similar_to', strength: 0.6 },

  // 神经网络家族
  { source: '感知机', target: '多层感知机', type: 'improved_by', strength: 0.9 },
  { source: '多层感知机', target: 'CNN', type: 'derives_from', strength: 0.9 },
  { source: '多层感知机', target: 'RNN/LSTM/GRU', type: 'derives_from', strength: 0.9 },
  { source: '多层感知机', target: '自编码器', type: 'derives_from', strength: 0.8 },
  { source: '多层感知机', target: 'Transformer', type: 'derives_from', strength: 0.8 },
  { source: '多层感知机', target: 'GAN', type: 'derives_from', strength: 0.8 },

  // 降维技术
  { source: '主成分分析', target: 't-SNE', type: 'similar_to', strength: 0.6 },
  { source: 't-SNE', target: 'UMAP', type: 'improved_by', strength: 0.8 },
  { source: '主成分分析', target: '自编码器', type: 'similar_to', strength: 0.5 },

  // 优化算法家族（梯度下降 → SGD → Momentum/Adam，关系图"改进版"故事线）
  { source: '梯度下降', target: 'SGD', type: 'improved_by', strength: 0.8 },
  { source: 'SGD', target: 'Momentum', type: 'improved_by', strength: 0.8 },
  { source: 'SGD', target: 'Adam', type: 'improved_by', strength: 0.9 },
  { source: 'Momentum', target: 'Adam', type: 'combines', strength: 0.7 },

  // KNN 与其他
  { source: 'K近邻', target: 'K-Means', type: 'similar_to', strength: 0.6 },

  // 集成学习
  { source: '随机森林', target: '梯度提升树', type: 'similar_to', strength: 0.7 },
  { source: 'AdaBoost', target: '梯度提升树', type: 'similar_to', strength: 0.8 },
];
