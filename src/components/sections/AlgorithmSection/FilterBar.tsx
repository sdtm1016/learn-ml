import { Filter } from 'lucide-react';
import { categoryLabels, type AlgorithmCategory } from '../../../data/algorithms';

interface FilterBarProps {
  selectedCategory: AlgorithmCategory;
  onCategoryChange: (category: AlgorithmCategory) => void;
}

// 中文注释：算法筛选条组件，展示分类过滤按钮
export function FilterBar({ selectedCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="filter-bar" aria-label="算法筛选">
      <Filter size={18} />
      {categoryLabels.map((category) => (
        <button
          className={`filter ${selectedCategory === category.id ? 'active' : ''}`}
          key={category.id}
          type="button"
          data-filter={category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
