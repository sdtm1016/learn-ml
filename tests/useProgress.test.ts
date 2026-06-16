import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadProgress, saveProgress } from '../src/hooks/useProgress';

// 中文注释：最小 localStorage mock，避免引入 jsdom 依赖
// 实现 getItem/setItem/removeItem，内部用 Map 存储；支持配额溢出模拟。
function createLocalStorageMock() {
  const store = new Map<string, string>();
  let shouldQuotaExceed = false;
  return {
    getItem: vi.fn((key: string) => (store.has(key) ? store.get(key)! : null)),
    setItem: vi.fn((key: string, value: string) => {
      if (shouldQuotaExceed) {
        const err = new DOMException('quota exceeded', 'QuotaExceededError');
        throw err;
      }
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: () => store.clear(),
    _setQuotaExceed: (v: boolean) => {
      shouldQuotaExceed = v;
    },
    _rawStore: store,
  };
}

// 测试意图：useProgress 的持久化层必须在 localStorage 异常时保证应用不崩溃、
// 且尽力保住用户数据。这些防御对"隐私模式/存储满/数据被篡改"等真实场景至关重要。
describe('loadProgress 防御', () => {
  let mock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mock = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', { value: mock, configurable: true, writable: true });
  });

  afterEach(() => {
    mock.clear();
  });

  it('无数据时返回默认空进度', () => {
    const p = loadProgress();
    expect(p.completedAlgorithms).toEqual([]);
    expect(p.lastViewed).toBe('');
    expect(typeof p.lastUpdated).toBe('number');
  });

  it('合法数据正常加载', () => {
    mock.setItem('learn-ml-progress', JSON.stringify({
      completedAlgorithms: ['线性回归', '决策树'],
      lastViewed: '决策树',
      lastUpdated: 12345,
    }));
    const p = loadProgress();
    expect(p.completedAlgorithms).toEqual(['线性回归', '决策树']);
    expect(p.lastViewed).toBe('决策树');
  });

  it('损坏的 JSON 回退默认值（不抛错）', () => {
    mock.setItem('learn-ml-progress', '{这不是合法json');
    const p = loadProgress();
    expect(p.completedAlgorithms).toEqual([]);
  });

  it('结构异常(completedAlgorithms 非数组)回退默认值', () => {
    // 意图：防止外部篡改或旧版本数据导致后续 .includes 崩溃
    mock.setItem('learn-ml-progress', JSON.stringify({ completedAlgorithms: '不是数组' }));
    const p = loadProgress();
    expect(Array.isArray(p.completedAlgorithms)).toBe(true);
    expect(p.completedAlgorithms).toEqual([]);
  });

  it('null/非对象数据回退默认值', () => {
    mock.setItem('learn-ml-progress', 'null');
    const p = loadProgress();
    expect(p.completedAlgorithms).toEqual([]);
  });
});

describe('saveProgress 防御', () => {
  let mock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mock = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', { value: mock, configurable: true, writable: true });
  });

  afterEach(() => {
    mock.clear();
  });

  it('正常保存返回 true', () => {
    const ok = saveProgress({ completedAlgorithms: ['A'], lastViewed: 'A', lastUpdated: 1 });
    expect(ok).toBe(true);
    expect(mock.setItem).toHaveBeenCalled();
  });

  it('配额溢出时清理后重试，仍失败则返回 false（不抛错）', () => {
    // 意图：隐私模式/存储满时，saveProgress 不能让应用崩溃；本次保存丢失但内存状态仍由 React 维持
    mock._setQuotaExceed(true);
    const ok = saveProgress({ completedAlgorithms: ['A'], lastViewed: 'A', lastUpdated: 1 });
    expect(ok).toBe(false);
    // 应至少尝试过 setItem 和 removeItem（重试逻辑）
    expect(mock.removeItem).toHaveBeenCalled();
  });
});
