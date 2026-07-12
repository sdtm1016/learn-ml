// 中文注释：XGBoost 演示渲染器——样本的 g/h + 候选分裂增益条 + 最佳分裂高亮
import type { XgboostVisual } from '../../../../data/boostingTrilogy/types';

interface XgboostDemoProps {
  visual: XgboostVisual;
}

export function XgboostDemo({ visual }: XgboostDemoProps) {
  const { nodes, candidates, bestSplit, lambda, bestLeafWeight } = visual;
  const maxGain = Math.max(...candidates.map((c) => Math.abs(c.gain)), 0.01);

  return (
    <div className="bt-demo-visual">
      {/* 上：每个样本的 g、h */}
      <div className="bt-gh-grid">
        {nodes.map((n, i) => (
          <div key={i} className="bt-gh-cell">
            <span className="bt-gh-label">样本 {i + 1}</span>
            <span className="bt-gh-g">g={n.g.toFixed(2)}</span>
            <span className="bt-gh-h">h={n.h.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* 中：候选分裂增益条 */}
      {candidates.length > 0 && (
        <div className="bt-gain-bars">
          <p className="bt-mini-title">候选分裂增益（λ={lambda}）</p>
          {candidates.map((c) => {
            const isBest = bestSplit && c.threshold === bestSplit.threshold;
            return (
              <div key={c.threshold} className={`bt-gain-row ${isBest ? 'best' : ''}`}>
                <span className="bt-gain-thresh">x&lt;{c.threshold}</span>
                <div className="bt-gain-track">
                  <div
                    className="bt-gain-fill"
                    style={{ width: `${(Math.abs(c.gain) / maxGain) * 100}%` }}
                  />
                </div>
                <span className="bt-gain-val">{c.gain.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* 下：闭式最优权重提示 */}
      {bestLeafWeight !== undefined && (
        <p className="bt-formula-note">闭式最优叶子权重 w* = −G/(H+λ)</p>
      )}
    </div>
  );
}
