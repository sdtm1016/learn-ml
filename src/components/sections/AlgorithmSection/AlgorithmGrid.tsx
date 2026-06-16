import type { AlgorithmItem } from '../../../data/algorithms';
import { AlgorithmCard } from './AlgorithmCard';

interface AlgorithmGridProps {
  algorithms: AlgorithmItem[];
  selectedAlgorithm: AlgorithmItem;
  isCompleted: (name: string) => boolean;
  onSelectAlgorithm: (algo: AlgorithmItem) => void;
  isInComparison: (name: string) => boolean;
  canAddToComparison: boolean;
  onAddToComparison: (algo: AlgorithmItem) => void;
}

// 中文注释：算法网格组件，展示算法卡片列表
export function AlgorithmGrid({
  algorithms,
  selectedAlgorithm,
  isCompleted,
  onSelectAlgorithm,
  isInComparison,
  canAddToComparison,
  onAddToComparison,
}: AlgorithmGridProps) {
  return (
    <div className="algorithm-atlas">
      {algorithms.map((algorithm) => (
        <AlgorithmCard
          key={algorithm.name}
          algorithm={algorithm}
          isSelected={selectedAlgorithm.name === algorithm.name}
          isCompleted={isCompleted(algorithm.name)}
          isInComparison={isInComparison(algorithm.name)}
          canAddToComparison={canAddToComparison}
          onClick={onSelectAlgorithm}
          onAddToComparison={onAddToComparison}
        />
      ))}
    </div>
  );
}
