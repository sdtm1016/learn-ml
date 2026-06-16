import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { AlgorithmCategory, AlgorithmItem } from '../../../data/algorithms';
import { algorithms } from '../../../data/algorithms';
import { getExcalidrawScene } from '../../../data/excalidrawScenes';
import { useAdvancedFilter } from '../../../hooks/useAdvancedFilter';
import { AdvancedFilter } from '../../AdvancedFilter';
import { FilterBar } from './FilterBar';
import { AlgorithmGrid } from './AlgorithmGrid';

// 中文注释：计算手绘图覆盖率
const sketchCoverage = (() => {
  const total = algorithms.length;
  const matched = algorithms.filter((algorithm) => getExcalidrawScene(algorithm.name)).length;

  return {
    total,
    matched,
    missing: total - matched,
  };
})();

interface AlgorithmSectionProps {
  selectedCategory: AlgorithmCategory;
  selectedAlgorithm: AlgorithmItem;
  onCategoryChange: (category: AlgorithmCategory) => void;
  onSelectAlgorithm: (algo: AlgorithmItem) => void;
  isCompleted: (name: string) => boolean;
  isInComparison: (name: string) => boolean;
  canAddToComparison: boolean;
  onAddToComparison: (algo: AlgorithmItem) => void;
}

// 中文注释：算法区主组件，包含筛选、网格
export function AlgorithmSection({
  selectedCategory,
  selectedAlgorithm,
  onCategoryChange,
  onSelectAlgorithm,
  isCompleted,
  isInComparison,
  canAddToComparison,
  onAddToComparison,
}: AlgorithmSectionProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  const {
    filters,
    filteredAlgorithms: advancedFilteredAlgorithms,
    toggleDifficulty,
    setHasSketchFilter,
    toggleTag,
    resetFilters,
    hasActiveFilters,
  } = useAdvancedFilter();

  // 中文注释：根据选中分类过滤算法
  const filteredAlgorithms = useMemo(() => {
    const baseFiltered = selectedCategory === 'all'
      ? advancedFilteredAlgorithms
      : advancedFilteredAlgorithms.filter((algorithm) => algorithm.categories.includes(selectedCategory));
    
    return baseFiltered;
  }, [selectedCategory, advancedFilteredAlgorithms]);

  return (
    <section id="algorithms" className="section-shell" aria-labelledby="algorithms-title">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">Algorithm Compass</p>
          <h2 id="algorithms-title">算法图谱</h2>
          <p>不只看十大算法。这里按算法家族整理常见机器学习算法与模型，点击任一卡片可查看详情。</p>
        </div>
        <div className="algorithm-toolbar">
          <div className="algorithm-stats" aria-label="手绘图覆盖情况">
            <div className="algorithm-stat present">
              <strong>
                {sketchCoverage.matched}/{sketchCoverage.total}
              </strong>
              <span>手绘图覆盖</span>
            </div>
            <div className={`algorithm-stat ${sketchCoverage.missing ? 'missing' : 'quiet'}`}>
              <strong>{sketchCoverage.missing}</strong>
              <span>未接入</span>
            </div>
          </div>
          <button
            className="button ghost"
            type="button"
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          >
            <SlidersHorizontal size={18} />
            {showAdvancedFilter ? '收起筛选' : '高级筛选'}
          </button>
          <FilterBar selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
        </div>
      </div>

      {showAdvancedFilter && (
        <AdvancedFilter
          filters={filters}
          resultCount={filteredAlgorithms.length}
          totalCount={algorithms.length}
          onToggleDifficulty={toggleDifficulty}
          onSetHasSketch={setHasSketchFilter}
          onToggleTag={toggleTag}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      <AlgorithmGrid
        algorithms={filteredAlgorithms}
        selectedAlgorithm={selectedAlgorithm}
        isCompleted={isCompleted}
        onSelectAlgorithm={onSelectAlgorithm}
        isInComparison={isInComparison}
        canAddToComparison={canAddToComparison}
        onAddToComparison={onAddToComparison}
      />
    </section>
  );
}
