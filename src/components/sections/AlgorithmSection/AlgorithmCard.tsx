import { CheckCircle2, GitCompareArrows } from 'lucide-react';
import type { AlgorithmItem } from '../../../data/algorithms';
import { getExcalidrawScene } from '../../../data/excalidrawScenes';

interface AlgorithmCardProps {
  algorithm: AlgorithmItem;
  isSelected: boolean;
  isCompleted: boolean;
  isInComparison: boolean;
  canAddToComparison: boolean;
  onClick: (algo: AlgorithmItem) => void;
  onAddToComparison: (algo: AlgorithmItem) => void;
}

// 中文注释：算法卡片组件，展示单个算法的摘要信息
export function AlgorithmCard({
  algorithm,
  isSelected,
  isCompleted,
  isInComparison,
  canAddToComparison,
  onClick,
  onAddToComparison,
}: AlgorithmCardProps) {
  const hasSketch = Boolean(getExcalidrawScene(algorithm.name));

  return (
    <div className={`algorithm-card-wrapper ${isInComparison ? 'in-comparison' : ''}`}>
      <button
        className={`algorithm-card ${isSelected ? 'active' : ''} ${hasSketch ? 'has-sketch' : 'no-sketch'} ${isCompleted ? 'completed' : ''}`}
        data-category={algorithm.categories.join(' ')}
        data-sketch={hasSketch ? 'present' : 'missing'}
        title={hasSketch ? '已匹配手绘图解' : '暂未匹配手绘图解'}
        type="button"
        onClick={() => onClick(algorithm)}
      >
        {isCompleted && (
          <span className="algorithm-card-check">
            <CheckCircle2 size={18} />
          </span>
        )}
        <span className={`algorithm-card-badge ${hasSketch ? 'present' : 'missing'}`}>
          {hasSketch ? '有图' : '无图'}
        </span>
        <span>{algorithm.label}</span>
        <div className="algorithm-card-title">
          <h3>{algorithm.name}</h3>
          <small>{algorithm.difficulty}</small>
        </div>
        <strong>{algorithm.family}</strong>
        <p>{algorithm.description}</p>
      </button>
      
      <button
        className={`add-to-comparison-btn ${isInComparison ? 'active' : ''}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddToComparison(algorithm);
        }}
        disabled={!canAddToComparison && !isInComparison}
        title={isInComparison ? '已加入对比' : canAddToComparison ? '加入对比' : '对比列表已满'}
      >
        <GitCompareArrows size={16} />
        {isInComparison ? '已加入' : '对比'}
      </button>
    </div>
  );
}
