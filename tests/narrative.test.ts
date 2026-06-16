import { describe, it, expect } from 'vitest';
import { buildNarrative } from '../src/data/algorithms/narrative';
import { algorithms } from '../src/data/algorithms';
import type { BaseAlgorithmItem } from '../src/data/algorithms/types';

// 测试意图：buildNarrative 负责为每个算法生成四个教学叙事字段。
// 这些字段是算法详情页的核心内容（通俗原理/医疗示例/其他示例/为什么选它），
// 若生成失败或为空，详情页会变成空白——必须保证非空且语义正确。
describe('buildNarrative', () => {
  const baseVision: BaseAlgorithmItem = {
    name: '测试视觉算法',
    label: 'TestVision',
    family: '深度学习 · 视觉',
    difficulty: '高级',
    categories: ['vision'],
    description: '一种视觉测试算法。',
    intuition: '它从图像中学习模式。',
    whenToUse: ['图像分类', '目标检测'],
    strengths: ['精度高', '可端到端'],
    limitations: ['需要大量标注', '计算成本高'],
    metrics: '看 mAP、IoU。',
  };

  it('四个叙事字段都非空', () => {
    const n = buildNarrative(baseVision);
    expect(n.plainExplanation.length).toBeGreaterThan(0);
    expect(n.medicalExample.length).toBeGreaterThan(0);
    expect(n.fallbackExample.length).toBeGreaterThan(0);
    expect(n.whyItFits.length).toBeGreaterThan(0);
  });

  it('通俗原理包含算法名与直觉描述', () => {
    const n = buildNarrative(baseVision);
    expect(n.plainExplanation).toContain('测试视觉算法');
    expect(n.plainExplanation).toContain('它从图像中学习模式。');
  });

  it('为什么选它包含算法描述与优点', () => {
    const n = buildNarrative(baseVision);
    expect(n.whyItFits).toContain('一种视觉测试算法。');
    expect(n.whyItFits).toContain('精度高、可端到端');
  });

  it('不同分类触发不同的医疗示例（视觉 vs 默认）', () => {
    // 意图：证明 categoryExampleContext 的分支逻辑生效——视觉算法应提到影像相关场景
    const vision = buildNarrative(baseVision);
    const defaultAlgo: BaseAlgorithmItem = { ...baseVision, categories: ['supervised'] };
    const def = buildNarrative(defaultAlgo);
    // 视觉示例应包含"胸片"或"影像"等词，默认示例不应
    expect(vision.medicalExample).toMatch(/影像|胸片|CT/);
    expect(def.medicalExample).not.toMatch(/胸片/);
    // 两者示例文本应不同（证明走了不同分支）
    expect(vision.medicalExample).not.toBe(def.medicalExample);
  });
});

// 测试意图：对真实算法数据跑一遍 buildNarrative，保证没有算法生成空字段。
// 这是数据完整性的回归保护——新增算法时若漏填字段，这里会失败。
describe('buildNarrative 全量回归', () => {
  it('所有真实算法的叙事字段都非空', () => {
    for (const algo of algorithms) {
      expect(algo.plainExplanation.length, `${algo.name} plainExplanation 为空`).toBeGreaterThan(0);
      expect(algo.medicalExample.length, `${algo.name} medicalExample 为空`).toBeGreaterThan(0);
      expect(algo.fallbackExample.length, `${algo.name} fallbackExample 为空`).toBeGreaterThan(0);
      expect(algo.whyItFits.length, `${algo.name} whyItFits 为空`).toBeGreaterThan(0);
    }
  });
});
