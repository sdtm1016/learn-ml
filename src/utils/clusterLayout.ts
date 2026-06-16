// 中文注释：家族聚类布局算法（纯函数）
// 从 AlgorithmGraph 组件中抽出，便于独立测试与复用。
// 依赖：仅依赖 AlgorithmItem 的 family 字段，无副作用、无 React 依赖。
import type { AlgorithmItem } from '../data/algorithms';

export interface Position {
  x: number;
  y: number;
}

// 中文注释：家族聚类布局
// 思路：按 family 字段把节点分组，每个 family 在大圆周上有一个中心，
// 同 family 的节点在其中心附近做小范围散开。这样同家族自然聚拢、不同家族相互分开，
// 既保留力导向的"家族感"，又是确定性布局（每次刷新位置稳定，不抖动）。
export function computeClusterLayout(algoList: AlgorithmItem[]): Map<string, Position> {
  // 1. 按 family 分组
  const familyGroups = new Map<string, AlgorithmItem[]>();
  for (const algo of algoList) {
    const family = algo.family || '其他';
    if (!familyGroups.has(family)) familyGroups.set(family, []);
    familyGroups.get(family)!.push(algo);
  }

  const families = [...familyGroups.keys()];
  const positions = new Map<string, Position>();

  // 2. 每个 family 的中心在大圆周上均匀分布
  const bigRadius = 380;
  const centerX = 500;
  const centerY = 400;

  families.forEach((family, fi) => {
    const angle = (fi / families.length) * 2 * Math.PI;
    const fcx = Math.cos(angle) * bigRadius + centerX;
    const fcy = Math.sin(angle) * bigRadius + centerY;

    // 3. 同 family 内的节点在中心附近小圆上散开
    const members = familyGroups.get(family)!;
    const smallRadius = members.length > 1 ? 70 : 0;
    members.forEach((algo, mi) => {
      const mAngle = (mi / members.length) * 2 * Math.PI;
      positions.set(algo.name, {
        x: Math.cos(mAngle) * smallRadius + fcx,
        y: Math.sin(mAngle) * smallRadius + fcy,
      });
    });
  });

  return positions;
}
