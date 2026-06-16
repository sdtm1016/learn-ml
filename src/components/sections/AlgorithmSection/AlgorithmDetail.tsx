import { CheckCircle2, Circle, PenLine } from 'lucide-react';
import type { AlgorithmItem } from '../../../data/algorithms';
import type { ExcalidrawScene } from '../../../data/excalidrawScenes';

interface AlgorithmDetailProps {
  algorithm: AlgorithmItem;
  isCompleted: boolean;
  onToggleComplete: (name: string) => void;
  sketchScene: ExcalidrawScene | null;
  onOpenSketch: () => void;
}

// 中文注释：算法详情组件，展示算法的完整信息
export function AlgorithmDetail({
  algorithm,
  isCompleted,
  onToggleComplete,
  sketchScene,
  onOpenSketch,
}: AlgorithmDetailProps) {
  return (
    <article className="algorithm-detail" id="algorithm-detail" aria-live="polite">
      <div className="algorithm-detail-header">
        <div>
          <p className="eyebrow">Algorithm Detail</p>
          <h3>{algorithm.name}</h3>
          <p>{algorithm.description}</p>
        </div>
        <div className="algorithm-badges">
          <span>{algorithm.label}</span>
          <span>{algorithm.family}</span>
          <span>{algorithm.difficulty}</span>
          <button
            className={`mark-complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={() => onToggleComplete(algorithm.name)}
            type="button"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} /> 已完成
              </>
            ) : (
              <>
                <Circle size={18} /> 标记完成
              </>
            )}
          </button>
        </div>
      </div>
      {sketchScene ? (
        <div className="sketch-entry">
          <div>
            <h4>手绘图解</h4>
            <p>{sketchScene.fileName} 已匹配到当前算法，点击后在大弹窗中查看。</p>
          </div>
          <button type="button" onClick={onOpenSketch}>
            <PenLine size={18} /> 查看手绘图解
          </button>
        </div>
      ) : null}
      {algorithm.codeExamples && (
        <div className="code-examples">
          <h4>代码示例</h4>
          <p className="code-examples-hint">以下是可运行的代码示例，点击在新标签页打开</p>
          <div className="code-examples-links">
            {algorithm.codeExamples.kaggle && (
              <a
                href={algorithm.codeExamples.kaggle}
                target="_blank"
                rel="noopener noreferrer"
                className="code-example-link kaggle"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358"></path>
                </svg>
                Kaggle Notebook
              </a>
            )}
            {algorithm.codeExamples.github && (
              <a
                href={algorithm.codeExamples.github}
                target="_blank"
                rel="noopener noreferrer"
                className="code-example-link github"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                GitHub 示例
              </a>
            )}
            {algorithm.codeExamples.colab && (
              <a
                href={algorithm.codeExamples.colab}
                target="_blank"
                rel="noopener noreferrer"
                className="code-example-link colab"
              >
                <svg width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
                  <path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M37.5,30.958 c-1.077,0-1.958-0.881-1.958-1.958c0-1.077,0.881-1.958,1.958-1.958c1.077,0,1.958,0.881,1.958,1.958 C39.458,30.077,38.577,30.958,37.5,30.958z M14.5,23c-1.077,0-1.958-0.881-1.958-1.958c0-1.077,0.881-1.958,1.958-1.958 c1.077,0,1.958,0.881,1.958,1.958C16.458,22.119,15.577,23,14.5,23z"></path>
                </svg>
                Google Colab
              </a>
            )}
          </div>
        </div>
      )}
      <div className="algorithm-detail-grid">
        <section className="principle-card wide">
          <h4>通俗原理</h4>
          <p>{algorithm.plainExplanation}</p>
        </section>
        <section className="example-card">
          <h4>医疗场景示例</h4>
          <p>{algorithm.medicalExample}</p>
        </section>
        <section className="example-card">
          <h4>其他场景示例</h4>
          <p>{algorithm.fallbackExample}</p>
        </section>
        <section className="wide">
          <h4>为什么选它</h4>
          <p>{algorithm.whyItFits}</p>
        </section>
        <section>
          <h4>适合场景</h4>
          <ul>
            {algorithm.whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>优点</h4>
          <ul>
            {algorithm.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>局限</h4>
          <ul>
            {algorithm.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="wide">
          <h4>指标与调参提示</h4>
          <p>{algorithm.metrics}</p>
        </section>
      </div>
    </article>
  );
}
