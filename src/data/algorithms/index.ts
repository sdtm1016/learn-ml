// 中文注释：algorithms 数据模块入口
// 聚合 6 个分组的基础数据，统一应用 buildNarrative 生成完整 AlgorithmItem，保持对外 API 不变。
import type { AlgorithmItem } from './types';
import { buildNarrative } from './narrative';
import { supervised } from './supervised';
import { ensemble } from './ensemble';
import { unsupervised } from './unsupervised';
import { deeplearning } from './deep-learning';
import { applied } from './applied';
import { misc } from './misc';

// 中文注释：基础条目保留算法事实信息，叙事字段统一生成，保证每个详情页都有完整教学解释。
export const algorithms: AlgorithmItem[] = [
  ...supervised,
  ...ensemble,
  ...unsupervised,
  ...deeplearning,
  ...applied,
  ...misc,
].map((algorithm) => ({
  ...algorithm,
  ...buildNarrative(algorithm),
}));
