import { useState, useMemo } from 'react';
import { algorithms, type AlgorithmItem } from '../data/algorithms';
import { getExcalidrawScene } from '../data/excalidrawScenes';

// 中文注释：筛选器状态类型定义
export interface FilterState {
  difficulties: Set<string>;      // 难度筛选：入门、进阶、高级
  hasSketch: boolean | null;      // 手绘图筛选：true=仅有图, false=仅无图, null=全部
  tags: Set<string>;               // 标签筛选（未来扩展）
}

// 中文注释：高级筛选 Hook
export function useAdvancedFilter() {
  const [filters, setFilters] = useState<FilterState>({
    difficulties: new Set(),
    hasSketch: null,
    tags: new Set(),
  });

  // 中文注释：切换难度筛选
  function toggleDifficulty(difficulty: string) {
    setFilters(prev => {
      const newDifficulties = new Set(prev.difficulties);
      if (newDifficulties.has(difficulty)) {
        newDifficulties.delete(difficulty);
      } else {
        newDifficulties.add(difficulty);
      }
      return { ...prev, difficulties: newDifficulties };
    });
  }

  // 中文注释：设置手绘图筛选
  function setHasSketchFilter(value: boolean | null) {
    setFilters(prev => ({ ...prev, hasSketch: value }));
  }

  // 中文注释：切换标签筛选
  function toggleTag(tag: string) {
    setFilters(prev => {
      const newTags = new Set(prev.tags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return { ...prev, tags: newTags };
    });
  }

  // 中文注释：重置所有筛选器
  function resetFilters() {
    setFilters({
      difficulties: new Set(),
      hasSketch: null,
      tags: new Set(),
    });
  }

  // 中文注释：根据筛选条件过滤算法
  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter((algo: AlgorithmItem) => {
      // 难度筛选（OR 逻辑）
      if (filters.difficulties.size > 0) {
        // 注意：当前算法数据中没有 difficulty 字段，暂时跳过
        // 如果未来添加了 difficulty 字段，取消注释下面的代码
        // if (!filters.difficulties.has(algo.difficulty)) return false;
      }

      // 手绘图筛选
      if (filters.hasSketch !== null) {
        const hasSketch = Boolean(getExcalidrawScene(algo.name));
        if (hasSketch !== filters.hasSketch) return false;
      }

      // 标签筛选（OR 逻辑）
      if (filters.tags.size > 0) {
        // 注意：当前算法数据中没有 tags 字段，暂时跳过
        // 如果未来添加了 tags 字段，取消注释下面的代码
        // const hasTags = Array.from(filters.tags).some(tag => algo.tags?.includes(tag));
        // if (!hasTags) return false;
      }

      return true;
    });
  }, [filters]);

  // 中文注释：检查是否有任何激活的筛选器
  const hasActiveFilters = 
    filters.difficulties.size > 0 || 
    filters.hasSketch !== null || 
    filters.tags.size > 0;

  return {
    filters,
    filteredAlgorithms,
    toggleDifficulty,
    setHasSketchFilter,
    toggleTag,
    resetFilters,
    hasActiveFilters,
  };
}
