// 中文注释：algorithms 数据模块的兼容入口
// 数据已按家族粗粒度拆分到 src/data/algorithms/ 目录下，本文件仅做 re-export，
// 保持所有现有 import 路径（from '../data/algorithms'）零改动。
// 真实实现见 ./algorithms/index.ts
export { algorithms } from './algorithms/index';
export type {
  AlgorithmCategory,
  AlgorithmItem,
  NarrativeFields,
  BaseAlgorithmItem,
} from './algorithms/types';
export { categoryLabels } from './algorithms/types';
