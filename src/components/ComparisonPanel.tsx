import { GitCompare, X, ArrowRight } from 'lucide-react';
import type { AlgorithmItem } from '../data/algorithms';

interface ComparisonPanelProps {
  comparisonList: AlgorithmItem[];
  onRemove: (name: string) => void;
  onClear: () => void;
  onStartComparison: () => void;
  canStartComparison: boolean;
}

// 中文注释：浮动对比面板组件，固定在右下角
export function ComparisonPanel({
  comparisonList,
  onRemove,
  onClear,
  onStartComparison,
  canStartComparison,
}: ComparisonPanelProps) {
  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div className="comparison-panel">
      <div className="comparison-panel-header">
        <div className="comparison-title">
          <GitCompare size={18} />
          <span>算法对比 ({comparisonList.length}/3)</span>
        </div>
        <button
          className="comparison-clear"
          type="button"
          onClick={onClear}
          aria-label="清空对比列表"
        >
          清空
        </button>
      </div>

      <div className="comparison-list">
        {comparisonList.map((algo) => (
          <div key={algo.name} className="comparison-item">
            <span className="comparison-item-name">{algo.name}</span>
            <button
              className="comparison-item-remove"
              type="button"
              onClick={() => onRemove(algo.name)}
              aria-label={`移除 ${algo.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        className="comparison-start-btn"
        type="button"
        onClick={onStartComparison}
        disabled={!canStartComparison}
      >
        开始对比 <ArrowRight size={16} />
      </button>

      {!canStartComparison && (
        <p className="comparison-hint">至少选择 2 个算法才能开始对比</p>
      )}
    </div>
  );
}
