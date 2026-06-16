import { useState, useCallback } from 'react';
import type { AlgorithmItem } from '../data/algorithms';

// 中文注释：对比功能状态管理 Hook
export function useComparison() {
  const [comparisonList, setComparisonList] = useState<AlgorithmItem[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // 中文注释：添加到对比列表
  const addToComparison = useCallback((algorithm: AlgorithmItem) => {
    setComparisonList(prev => {
      // 检查是否已存在
      if (prev.some(item => item.name === algorithm.name)) {
        return prev;
      }
      // 最多 3 个
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, algorithm];
    });
  }, []);

  // 中文注释：从对比列表移除
  const removeFromComparison = useCallback((algorithmName: string) => {
    setComparisonList(prev => prev.filter(item => item.name !== algorithmName));
  }, []);

  // 中文注释：清空对比列表
  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  // 中文注释：检查算法是否在对比列表中
  const isInComparison = useCallback((algorithmName: string) => {
    return comparisonList.some(item => item.name === algorithmName);
  }, [comparisonList]);

  // 中文注释：打开对比 Modal
  const openComparisonModal = useCallback(() => {
    if (comparisonList.length >= 2) {
      setIsComparisonModalOpen(true);
    }
  }, [comparisonList.length]);

  // 中文注释：关闭对比 Modal
  const closeComparisonModal = useCallback(() => {
    setIsComparisonModalOpen(false);
  }, []);

  // 中文注释：是否可以添加更多算法
  const canAddMore = comparisonList.length < 3;

  // 中文注释：是否可以开始对比（至少 2 个）
  const canStartComparison = comparisonList.length >= 2;

  return {
    comparisonList,
    isComparisonModalOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    openComparisonModal,
    closeComparisonModal,
    canAddMore,
    canStartComparison,
  };
}
