import { useEffect } from 'react';
import { X, Download, CheckCircle2, XCircle } from 'lucide-react';
import type { AlgorithmItem } from '../data/algorithms';
import { getExcalidrawScene } from '../data/excalidrawScenes';

interface ComparisonModalProps {
  isOpen: boolean;
  algorithms: AlgorithmItem[];
  onClose: () => void;
  onRemove: (name: string) => void;
  isCompleted: (name: string) => boolean;
}

// 中文注释：算法对比 Modal 组件
export function ComparisonModal({
  isOpen,
  algorithms,
  onClose,
  onRemove,
  isCompleted,
}: ComparisonModalProps) {
  // 中文注释：Esc 键关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 中文注释：滚动锁定
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 中文注释：导出对比结果为文本
  function exportComparison() {
    let text = '# 算法对比报告\n\n';
    text += `对比时间：${new Date().toLocaleString()}\n\n`;

    algorithms.forEach((algo, index) => {
      text += `## ${index + 1}. ${algo.name}\n\n`;
      text += `**分类**：${algo.categories.join(', ')}\n\n`;
      text += `**通俗原理**：\n${algo.plainExplanation}\n\n`;
      text += `**医疗示例**：\n${algo.medicalExample}\n\n`;
      if (algo.strengths.length > 0) {
        text += `**优点**：\n${algo.strengths.join('; ')}\n\n`;
      }
      if (algo.limitations.length > 0) {
        text += `**局限性**：\n${algo.limitations.join('; ')}\n\n`;
      }
      text += '---\n\n';
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `算法对比_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isOpen) return null;

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="comparison-modal-header">
          <div>
            <h2>算法对比</h2>
            <p>并排查看 {algorithms.length} 个算法的详细信息</p>
          </div>
          <div className="comparison-modal-actions">
            <button
              className="button ghost"
              type="button"
              onClick={exportComparison}
              title="导出对比结果"
            >
              <Download size={18} />
            </button>
            <button
              className="comparison-modal-close"
              type="button"
              onClick={onClose}
              aria-label="关闭对比"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className={`comparison-grid cols-${algorithms.length}`}>
          {algorithms.map((algo) => {
            const hasSketch = Boolean(getExcalidrawScene(algo.name));
            const completed = isCompleted(algo.name);

            return (
              <div key={algo.name} className="comparison-column">
                <div className="comparison-column-header">
                  <div>
                    <h3>{algo.name}</h3>
                    <div className="comparison-badges">
                      {completed && (
                        <span className="badge success">
                          <CheckCircle2 size={14} /> 已完成
                        </span>
                      )}
                      {hasSketch && <span className="badge info">有手绘图</span>}
                    </div>
                  </div>
                  <button
                    className="comparison-remove-btn"
                    type="button"
                    onClick={() => onRemove(algo.name)}
                    title="移除此算法"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="comparison-column-body">
                  <section className="comparison-section">
                    <h4>分类</h4>
                    <div className="comparison-tags">
                      {algo.categories.map((cat) => (
                        <span key={cat} className="tag">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="comparison-section">
                    <h4>通俗原理</h4>
                    <p>{algo.plainExplanation}</p>
                  </section>

                  <section className="comparison-section">
                    <h4>医疗示例</h4>
                    <p>{algo.medicalExample}</p>
                  </section>

                  {algo.strengths.length > 0 && (
                    <section className="comparison-section">
                      <h4>
                        <CheckCircle2 size={16} className="icon-success" /> 优点
                      </h4>
                      <ul>
                        {algo.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {algo.limitations.length > 0 && (
                    <section className="comparison-section">
                      <h4>
                        <XCircle size={16} className="icon-warning" /> 局限性
                      </h4>
                      <ul>
                        {algo.limitations.map((limitation, i) => (
                          <li key={i}>{limitation}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {algo.codeExamples && Object.keys(algo.codeExamples).length > 0 && (
                    <section className="comparison-section">
                      <h4>代码示例</h4>
                      <div className="code-example-links">
                        {algo.codeExamples.colab && (
                          <a
                            href={algo.codeExamples.colab}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="code-link"
                          >
                            🔗 Colab
                          </a>
                        )}
                        {algo.codeExamples.kaggle && (
                          <a
                            href={algo.codeExamples.kaggle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="code-link"
                          >
                            📊 Kaggle
                          </a>
                        )}
                        {algo.codeExamples.github && (
                          <a
                            href={algo.codeExamples.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="code-link"
                          >
                            💻 GitHub
                          </a>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
