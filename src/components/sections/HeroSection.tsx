import { Binary, Sparkles, Network } from 'lucide-react';
import { algorithms, categoryLabels } from '../../data/algorithms';
import type { AlgorithmCategory } from '../../data/algorithms';

interface HeroSectionProps {
  onOpenAlgorithmByName: (name: string, category?: AlgorithmCategory) => void;
  onOpenGraph?: () => void;
}

// 中文注释：英雄区组件，展示网站标题、介绍和主要行动按钮
export function HeroSection({ onOpenAlgorithmByName, onOpenGraph }: HeroSectionProps) {
  return (
    <section className="hero section-shell">
      <div className="hero-copy">
        <p className="eyebrow">Vite + React 机器学习学习站</p>
        <h1>
          <span>机器学习入门，</span>
          <span>从概念走到实战。</span>
        </h1>
        <p className="hero-lead">
          先理解机器学习、深度学习、神经网络的关系，再用算法图谱建立选型直觉，
          最后走完整个建模流程。docs 资料作为知识参考，页面重点呈现算法解释、医疗示例和可点击详情。
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#roadmap">
            <Sparkles size={18} /> 开始学习
          </a>
          <button
            className="button ghost"
            type="button"
            onClick={() => onOpenAlgorithmByName('逻辑回归', 'supervised')}
          >
            <Binary size={18} /> 看一个算法示例
          </button>
          {onOpenGraph && (
            <button
              className="button ghost"
              type="button"
              onClick={onOpenGraph}
            >
              <Network size={18} /> 算法关系图谱
            </button>
          )}
        </div>
      </div>

      {/* 中文注释：用视觉层级表达 ML、DL、NN 的包含关系 */}
      <div className="hero-panel" aria-label="机器学习关系图">
        <div className="orbit orbit-ml">
          <span>机器学习 ML</span>
          <div className="orbit orbit-dl">
            <span>深度学习 DL</span>
            <div className="orbit orbit-nn">
              <span>神经网络 NN</span>
            </div>
          </div>
        </div>
        <div className="metric-grid">
          <div>
            <strong>100+</strong>
            <span>参考资料沉淀</span>
          </div>
          <div>
            <strong>{categoryLabels.length - 1}</strong>
            <span>算法家族</span>
          </div>
          <div>
            <strong>{algorithms.length}</strong>
            <span>详情示例</span>
          </div>
        </div>
      </div>
    </section>
  );
}
