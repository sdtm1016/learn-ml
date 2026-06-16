import { describe, it, expect } from 'vitest';
import { computeClusterLayout } from '../src/utils/clusterLayout';
import type { AlgorithmItem } from '../src/data/algorithms';

// 中文注释：构造最小测试数据，覆盖"同家族/不同家族/单成员家族"三种情况
function makeAlgo(name: string, family: string): AlgorithmItem {
  return {
    name,
    label: name,
    family,
    difficulty: '入门',
    categories: ['supervised'],
    description: '',
    intuition: '',
    whenToUse: [],
    strengths: [],
    limitations: [],
    metrics: '',
    plainExplanation: '',
    medicalExample: '',
    fallbackExample: '',
    whyItFits: '',
  };
}

// 测试意图：家族聚类布局的核心契约是"同家族聚拢、不同家族分开、确定性"。
// 这些是关系图谱直观性的根本——若布局把同家族算法撒开，图谱就失去了家族感。
describe('computeClusterLayout', () => {
  const sample = [
    makeAlgo('A1', '家族一'),
    makeAlgo('A2', '家族一'),
    makeAlgo('B1', '家族二'),
    makeAlgo('B2', '家族二'),
    makeAlgo('C1', '家族三'), // 单成员家族
  ];

  it('为每个输入算法返回一个位置', () => {
    const pos = computeClusterLayout(sample);
    expect(pos.size).toBe(5);
    for (const a of sample) {
      expect(pos.has(a.name)).toBe(true);
    }
  });

  it('同家族节点间的距离应小于不同家族节点间的距离', () => {
    const pos = computeClusterLayout(sample);
    const dist = (n1: string, n2: string) => {
      const p1 = pos.get(n1)!;
      const p2 = pos.get(n2)!;
      return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    };
    // 同家族(家族一的A1,A2)应聚拢：距离 < 大圆半径
    const sameFamilyDist = dist('A1', 'A2');
    // 不同家族(A1 vs B1)应分开：距离 > 同家族距离
    const crossFamilyDist = dist('A1', 'B1');
    expect(sameFamilyDist).toBeLessThan(crossFamilyDist);
  });

  it('同输入应产生相同输出（确定性布局，不抖动）', () => {
    const pos1 = computeClusterLayout(sample);
    const pos2 = computeClusterLayout(sample);
    for (const a of sample) {
      expect(pos1.get(a.name)).toEqual(pos2.get(a.name));
    }
  });

  it('单成员家族的节点位于其家族中心（小圆半径为0）', () => {
    const pos = computeClusterLayout(sample);
    // C1 是家族三唯一成员，smallRadius=0，应位于大圆周上的家族中心
    const c1 = pos.get('C1')!;
    // 家族三是第3个家族(index=2)，共3个家族中 angle = 2/3 * 2π
    const angle = (2 / 3) * 2 * Math.PI;
    const expectedX = Math.cos(angle) * 380 + 500;
    const expectedY = Math.sin(angle) * 380 + 400;
    expect(c1.x).toBeCloseTo(expectedX, 5);
    expect(c1.y).toBeCloseTo(expectedY, 5);
  });
});
