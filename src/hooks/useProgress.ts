import { useEffect, useState } from 'react';

// 中文注释：学习进度数据结构
export interface LearningProgress {
  completedAlgorithms: string[]; // 已完成算法名称列表
  lastViewed: string; // 最后查看的算法
  lastUpdated: number; // 最后更新时间戳
}

const STORAGE_KEY = 'learn-ml-progress';

// 中文注释：默认空进度，作为加载失败/初次使用时的兜底
function defaultProgress(): LearningProgress {
  return {
    completedAlgorithms: [],
    lastViewed: '',
    lastUpdated: Date.now(),
  };
}

// 中文注释：校验从 localStorage 解析出的对象是否符合 LearningProgress 结构
// 防御场景：数据被外部篡改、旧版本格式不兼容、JSON 解析出 null/非对象等，
// 避免 completedAlgorithms 非数组时后续 .includes/.filter 抛错导致页面白屏。
function isValidProgress(data: unknown): data is LearningProgress {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as LearningProgress).completedAlgorithms) &&
    (data as LearningProgress).completedAlgorithms.every((x) => typeof x === 'string')
  );
}

// 中文注释：从 localStorage 加载进度
// 导出便于测试。损坏数据会被丢弃并回退默认值，保证应用始终可用。
export function loadProgress(): LearningProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 结构合法才采用，否则回退默认（不抛错、不打断用户）
      if (isValidProgress(parsed)) {
        return {
          completedAlgorithms: parsed.completedAlgorithms,
          lastViewed: typeof parsed.lastViewed === 'string' ? parsed.lastViewed : '',
          lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : Date.now(),
        };
      }
      console.warn('进度数据结构异常，已回退默认值');
    }
  } catch (error) {
    // JSON 解析失败（数据损坏）或 localStorage 不可用（隐私模式）
    console.error('Failed to load progress:', error);
  }

  return defaultProgress();
}

// 中文注释：保存进度到 localStorage
// 导出便于测试。配额溢出时尝试清理后重试一次，仍失败则仅记录日志——
// 此时内存中的进度仍由 React state 维持，用户当次操作不受影响，只是无法持久化。
export function saveProgress(progress: LearningProgress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    // 配额溢出(QuotaExceededError)：清掉旧值后重试一次，宁可丢历史也要保住当前状态
    if (isQuotaError(error)) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return true;
      } catch (retryError) {
        console.error('重试保存进度仍失败，本次变更将无法持久化:', retryError);
        return false;
      }
    }
    console.error('Failed to save progress:', error);
    return false;
  }
}

// 中文注释：判断是否为存储配额溢出错误（不同浏览器异常名不一，做兼容判断）
function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.code === 1014)
  );
}

export function useProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  // 中文注释：自动保存到 localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // 中文注释：标记算法为已完成
  const markComplete = (algorithmName: string) => {
    setProgress((prev) => ({
      ...prev,
      completedAlgorithms: [...new Set([...prev.completedAlgorithms, algorithmName])],
      lastUpdated: Date.now(),
    }));
  };

  // 中文注释：取消标记完成
  const markIncomplete = (algorithmName: string) => {
    setProgress((prev) => ({
      ...prev,
      completedAlgorithms: prev.completedAlgorithms.filter((name) => name !== algorithmName),
      lastUpdated: Date.now(),
    }));
  };

  // 中文注释：切换完成状态
  const toggleComplete = (algorithmName: string) => {
    if (progress.completedAlgorithms.includes(algorithmName)) {
      markIncomplete(algorithmName);
    } else {
      markComplete(algorithmName);
    }
  };

  // 中文注释：更新最后查看
  const updateLastViewed = (algorithmName: string) => {
    setProgress((prev) => ({
      ...prev,
      lastViewed: algorithmName,
      lastUpdated: Date.now(),
    }));
  };

  // 中文注释：检查算法是否已完成
  const isCompleted = (algorithmName: string): boolean => {
    return progress.completedAlgorithms.includes(algorithmName);
  };

  // 中文注释：清空所有进度
  const clearProgress = () => {
    setProgress({
      completedAlgorithms: [],
      lastViewed: '',
      lastUpdated: Date.now(),
    });
  };

  return {
    progress,
    markComplete,
    markIncomplete,
    toggleComplete,
    updateLastViewed,
    isCompleted,
    clearProgress,
  };
}
