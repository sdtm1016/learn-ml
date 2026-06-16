import { Filter, X } from 'lucide-react';
import type { FilterState } from '../hooks/useAdvancedFilter';

interface AdvancedFilterProps {
  filters: FilterState;
  resultCount: number;
  totalCount: number;
  onToggleDifficulty: (difficulty: string) => void;
  onSetHasSketch: (value: boolean | null) => void;
  onToggleTag: (tag: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

// 中文注释：难度选项
const difficulties = ['入门', '进阶', '高级'];

// 中文注释：热门标签（示例数据，未来可从算法数据中提取）
const popularTags = [
  '分类',
  '回归',
  '聚类',
  '降维',
  '集成学习',
  '深度学习',
  '时序分析',
  '推荐系统',
];

// 中文注释：高级筛选组件
export function AdvancedFilter({
  filters,
  resultCount,
  totalCount,
  onToggleDifficulty,
  onSetHasSketch,
  onToggleTag,
  onReset,
  hasActiveFilters,
}: AdvancedFilterProps) {
  return (
    <div className="advanced-filter">
      <div className="advanced-filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>高级筛选</h3>
        </div>
        <div className="filter-result">
          找到 <strong>{resultCount}</strong> / {totalCount} 个算法
        </div>
        {hasActiveFilters && (
          <button className="filter-reset" type="button" onClick={onReset}>
            <X size={16} /> 重置
          </button>
        )}
      </div>

      <div className="filter-groups">
        {/* 难度筛选 */}
        <div className="filter-group">
          <label className="filter-label">难度级别</label>
          <div className="filter-options">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                className={`filter-chip ${filters.difficulties.has(difficulty) ? 'active' : ''}`}
                onClick={() => onToggleDifficulty(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
          <p className="filter-hint">注意：当前算法数据暂无难度标注，此筛选暂不生效</p>
        </div>

        {/* 手绘图筛选 */}
        <div className="filter-group">
          <label className="filter-label">手绘图解</label>
          <div className="filter-options">
            <button
              type="button"
              className={`filter-chip ${filters.hasSketch === null ? 'active' : ''}`}
              onClick={() => onSetHasSketch(null)}
            >
              全部
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.hasSketch === true ? 'active' : ''}`}
              onClick={() => onSetHasSketch(true)}
            >
              仅有手绘图
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.hasSketch === false ? 'active' : ''}`}
              onClick={() => onSetHasSketch(false)}
            >
              仅无手绘图
            </button>
          </div>
        </div>

        {/* 标签云筛选 */}
        <div className="filter-group">
          <label className="filter-label">热门标签</label>
          <div className="filter-tags">
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`filter-tag ${filters.tags.has(tag) ? 'active' : ''}`}
                onClick={() => onToggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="filter-hint">注意：当前算法数据暂无标签标注，此筛选暂不生效</p>
        </div>
      </div>
    </div>
  );
}
