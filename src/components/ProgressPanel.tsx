import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { algorithms, categoryLabels, type AlgorithmCategory } from '../data/algorithms';
import type { LearningProgress } from '../hooks/useProgress';

interface ProgressPanelProps {
  progress: LearningProgress;
}

export function ProgressPanel({ progress }: ProgressPanelProps) {
  const totalCount = algorithms.length;
  const completedCount = progress.completedAlgorithms.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 中文注释：计算各分类的完成情况
  const getCategoryProgress = (categoryId: AlgorithmCategory) => {
    if (categoryId === 'all') return { completed: completedCount, total: totalCount };

    const categoryAlgorithms = algorithms.filter((algo) => algo.categories.includes(categoryId));
    const completed = categoryAlgorithms.filter((algo) =>
      progress.completedAlgorithms.includes(algo.name)
    ).length;

    return {
      completed,
      total: categoryAlgorithms.length,
    };
  };

  return (
    <div className="progress-panel">
      <div className="progress-header">
        <TrendingUp size={20} />
        <h3>学习进度</h3>
      </div>

      <div className="progress-circle-container">
        <svg className="progress-circle" viewBox="0 0 120 120">
          <circle
            className="progress-circle-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(168, 186, 200, 0.12)"
            strokeWidth="12"
          />
          <circle
            className="progress-circle-fill"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 339.292} 339.292`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="progress-circle-text">
          <strong>{percentage}%</strong>
          <span>{completedCount} / {totalCount}</span>
        </div>
      </div>

      <div className="progress-stats">
        {categoryLabels.slice(1).map((category) => {
          const { completed, total } = getCategoryProgress(category.id);
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          if (total === 0) return null;

          return (
            <div key={category.id} className="progress-stat-item">
              <div className="progress-stat-header">
                <span className="progress-stat-label">{category.label}</span>
                <span className="progress-stat-value">
                  {completed}/{total}
                </span>
              </div>
              <div className="progress-stat-bar">
                <div
                  className="progress-stat-bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === 0 && (
        <div className="progress-empty">
          <Circle size={32} />
          <p>还没有完成任何算法</p>
          <p className="progress-empty-hint">点击算法详情中的"标记完成"按钮开始记录学习进度</p>
        </div>
      )}

      {completedCount > 0 && completedCount === totalCount && (
        <div className="progress-complete">
          <CheckCircle2 size={32} />
          <p>🎉 恭喜！你已完成所有算法学习</p>
        </div>
      )}
    </div>
  );
}
