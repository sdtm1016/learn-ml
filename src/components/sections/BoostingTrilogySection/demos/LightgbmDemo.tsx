// 中文注释：LightGBM 演示渲染器——直方图桶 + Leaf-wise 叶子列表 + GOSS/EFB 提示
import type { LightgbmVisual } from '../../../../data/boostingTrilogy/types';

interface LightgbmDemoProps {
  visual: LightgbmVisual;
}

export function LightgbmDemo({ visual }: LightgbmDemoProps) {
  const { histogram, leaves, note } = visual;
  const maxCount = Math.max(...histogram.map((b) => b.count), 1);

  return (
    <div className="bt-demo-visual">
      {/* 直方图 */}
      {histogram.length > 0 && (
        <div className="bt-histogram">
          <p className="bt-mini-title">特征直方图（装桶后）</p>
          <div className="bt-hist-bars">
            {histogram.map((b) => (
              <div key={b.bin} className="bt-hist-col">
                <div
                  className="bt-hist-bar"
                  style={{ height: `${(b.count / maxCount) * 100}%` }}
                  title={`桶${b.bin}: ${b.count}样本, 梯度和${b.gradientSum.toFixed(1)}`}
                />
                <span className="bt-hist-label">{b.bin}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaf-wise 叶子列表 */}
      <div className="bt-leaves">
        <p className="bt-mini-title">当前叶子（Leaf-wise：选增益最大的裂）</p>
        <ul className="bt-leaf-list">
          {leaves.map((leaf) => (
            <li key={leaf.id} className={`bt-leaf ${leaf.isSplit ? 'split' : ''}`}>
              {leaf.id} · 深度{leaf.depth}
              {leaf.gain !== undefined && ` · 增益${leaf.gain.toFixed(2)}`}
              {leaf.isSplit && <span className="bt-leaf-tag">本轮分裂</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* GOSS/EFB 提示 */}
      <p className="bt-note">{note}</p>
    </div>
  );
}
