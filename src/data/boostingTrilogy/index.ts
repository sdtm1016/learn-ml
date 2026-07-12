// 中文注释：boostingTrilogy 数据模块入口
// 聚合三个 demo，对外暴露统一数组（时间线 + tab 用）。
import { gbdtDemo } from './gbdt';
import { xgboostDemo } from './xgboost';
import { lightgbmDemo } from './lightgbm';
import type { DemoData } from './types';

// 中文注释：统一按 DemoData<unknown> 暴露，组件层按 algorithmId 分发到具体渲染器
export const boostingTrilogy: DemoData<unknown>[] = [
  gbdtDemo as DemoData<unknown>,
  xgboostDemo as DemoData<unknown>,
  lightgbmDemo as DemoData<unknown>,
];

export { gbdtDemo, xgboostDemo, lightgbmDemo };
export * from './types';
