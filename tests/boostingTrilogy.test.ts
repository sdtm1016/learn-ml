import { describe, it, expect } from 'vitest';
import { gbdtDemo } from '../src/data/boostingTrilogy/gbdt';
import { xgboostDemo } from '../src/data/boostingTrilogy/xgboost';
import { lightgbmDemo } from '../src/data/boostingTrilogy/lightgbm';
import { boostingTrilogy } from '../src/data/boostingTrilogy/index';
import type { DemoData } from '../src/data/boostingTrilogy/types';
// 步进纯函数（Task 6 实现，先放在顶部 import 块，避免末尾追加触发 import/first 规则）
import { nextStep, prevStep, clampStep } from '../src/components/sections/BoostingTrilogySection/Stepper';

// 测试意图：三个 demo 的数据结构必须满足教学演示契约。
// 若 steps 为空、索引断裂或元信息缺失，演示器会渲染崩坏——这是核心契约。
describe('boostingTrilogy 数据契约', () => {
  const demos: DemoData<unknown>[] = [gbdtDemo, xgboostDemo, lightgbmDemo];

  it('恰好三个 demo，顺序为 GBDT → XGBoost → LightGBM', () => {
    expect(boostingTrilogy).toHaveLength(3);
    expect(boostingTrilogy[0].algorithmId).toBe('gbdt');
    expect(boostingTrilogy[1].algorithmId).toBe('xgboost');
    expect(boostingTrilogy[2].algorithmId).toBe('lightgbm');
  });

  for (const demo of demos) {
    describe(`${demo.algorithmId} demo`, () => {
      it('steps 非空且 4-6 步', () => {
        expect(demo.steps.length).toBeGreaterThanOrEqual(4);
        expect(demo.steps.length).toBeLessThanOrEqual(6);
      });

      it('step.index 从 0 连续递增', () => {
        demo.steps.forEach((step, i) => {
          expect(step.index).toBe(i);
        });
      });

      it('每步 title/narrative/visual 齐全', () => {
        for (const step of demo.steps) {
          expect(step.title.length).toBeGreaterThan(0);
          expect(step.narrative.length).toBeGreaterThan(0);
          expect(step.visual).toBeDefined();
        }
      });

      it('元信息齐全（一句话定位 + 相对上一代新增）', () => {
        expect(demo.oneLiner.length).toBeGreaterThan(0);
        expect(demo.newAdditions.length).toBeGreaterThan(0);
      });
    });
  }
});
