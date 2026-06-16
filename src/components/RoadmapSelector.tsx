import { Check } from 'lucide-react';
import { roadmapPaths, type RoadmapPath } from '../data/roadmaps';

interface RoadmapSelectorProps {
  selectedPathId: string;
  onSelectPath: (pathId: string) => void;
}

// 中文注释：学习路径选择器组件
export function RoadmapSelector({ selectedPathId, onSelectPath }: RoadmapSelectorProps) {
  return (
    <div className="roadmap-selector">
      <div className="roadmap-selector-header">
        <h3>选择学习路径</h3>
        <p className="muted">根据你的学习目标，选择最适合的路径</p>
      </div>

      <div className="path-cards">
        {roadmapPaths.map((path: RoadmapPath) => (
          <button
            key={path.id}
            className={`path-card ${selectedPathId === path.id ? 'active' : ''}`}
            onClick={() => onSelectPath(path.id)}
            type="button"
          >
            <div className="path-card-header">
              <span className="path-icon">{path.icon}</span>
              <div className="path-meta">
                <h4>{path.name}</h4>
                <span className={`difficulty-badge ${path.difficulty}`}>{path.difficulty}</span>
              </div>
              {selectedPathId === path.id && (
                <div className="selected-indicator">
                  <Check size={20} />
                </div>
              )}
            </div>
            <p className="path-description">{path.description}</p>
            <div className="path-stats">
              <span>{path.steps.length} 步骤</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
