import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import type { AlgorithmCategory } from '../../data/algorithms';
import { getDefaultRoadmap, getRoadmapById } from '../../data/roadmaps';
import { RoadmapSelector } from '../RoadmapSelector';

interface RoadmapSectionProps {
  onOpenAlgorithmByName: (name: string, category?: AlgorithmCategory) => void;
  completedAlgorithms: string[];
}

// 中文注释：学习路线区组件，支持多条学习路径选择
export function RoadmapSection({ onOpenAlgorithmByName, completedAlgorithms }: RoadmapSectionProps) {
  const [selectedPathId, setSelectedPathId] = useState('basic');
  const [showSelector, setShowSelector] = useState(false);

  const currentPath = getRoadmapById(selectedPathId) || getDefaultRoadmap();
  const completedSteps = currentPath.steps.filter(step =>
    completedAlgorithms.includes(step.algorithmName)
  ).length;
  const progress = Math.round((completedSteps / currentPath.steps.length) * 100);

  return (
    <section className="section-shell roadmap-section" id="roadmap" aria-labelledby="roadmap-title">
      <div className="roadmap-header">
        <div>
          <p className="eyebrow">Learning Roadmap</p>
          <h2 id="roadmap-title">学习路线</h2>
          <p>
            选择适合你的学习路径，每一步推荐一个核心算法。点击算法名可直接查看详情。
          </p>
        </div>
        <button
          className="button ghost"
          type="button"
          onClick={() => setShowSelector(!showSelector)}
        >
          {showSelector ? '收起路径选择' : '切换路径'}
        </button>
      </div>

      {showSelector && (
        <RoadmapSelector selectedPathId={selectedPathId} onSelectPath={setSelectedPathId} />
      )}

      <div className="current-path-info">
        <div className="path-title">
          <span className="path-icon-large">{currentPath.icon}</span>
          <div>
            <h3>{currentPath.name}</h3>
            <p>{currentPath.description}</p>
          </div>
        </div>
        <div className="path-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            {completedSteps} / {currentPath.steps.length} 已完成 ({progress}%)
          </span>
        </div>
      </div>

      <div className="roadmap-flow">
        {currentPath.steps.map((step) => {
          const isCompleted = completedAlgorithms.includes(step.algorithmName);
          return (
            <article key={step.step} className={`roadmap-card ${isCompleted ? 'completed' : ''}`}>
              <div className="step-header">
                <span className="step-badge">{step.step}</span>
                {isCompleted && (
                  <span className="completed-badge">
                    <CheckCircle2 size={18} />
                  </span>
                )}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <button
                className="algorithm-link"
                type="button"
                onClick={() => onOpenAlgorithmByName(step.algorithmName, step.category as AlgorithmCategory)}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                查看《{step.algorithmName}》 <ChevronRight size={16} />
              </button>
            </article>
          );
        })}
        <div className="roadmap-cta">
          <ArrowRight size={32} />
          <p>
            完成这条路径后，你可以自由探索
            <a href="#algorithms">算法图谱</a>，按场景或家族继续深入。
          </p>
        </div>
      </div>
    </section>
  );
}
