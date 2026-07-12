// 中文注释：GBDT 演示渲染器——散点 + 残差柱，随步骤变化
import type { GbdtVisual } from '../../../../data/boostingTrilogy/types';

interface GbdtDemoProps {
  visual: GbdtVisual;
}

// SVG 画布配置（viewBox 单位）
const W = 320;
const H = 200;
const PAD = 24;

// 中文注释：把 [0,1] 的数据值映射到 SVG 坐标
function sx(x: number) {
  return PAD + (x - 1) / 4 * (W - 2 * PAD); // x: 1..5
}
function sy(y: number) {
  return H - PAD - y * (H - 2 * PAD); // y: 0..1，翻转
}

export function GbdtDemo({ visual }: GbdtDemoProps) {
  const { points, round, newTree } = visual;

  return (
    <div className="bt-demo-visual">
      <svg viewBox={`0 0 ${W} ${H}`} className="bt-svg" role="img" aria-label={`GBDT 第 ${round} 轮`}>
        {/* 坐标轴 */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} className="bt-axis" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} className="bt-axis" />

        {/* 残差柱（真值到预测值）+ 真值点 + 预测点 */}
        {points.map((p) => {
          const yT = sy(p.yTrue);
          const yP = sy(p.yPred);
          return (
            <g key={p.x} className="bt-point-group">
              <line x1={sx(p.x)} y1={yT} x2={sx(p.x)} y2={yP} className="bt-residual-bar" />
              <circle cx={sx(p.x)} cy={yT} r={4} className="bt-true-point" />
              <circle cx={sx(p.x)} cy={yP} r={4} className="bt-pred-point" />
            </g>
          );
        })}
      </svg>

      {/* 本轮新增树说明 */}
      {newTree && (
        <p className="bt-tree-note">
          第 {round} 棵树：按 {newTree.feature} &lt; {newTree.threshold} 分裂，
          叶子值 [{newTree.leafValues[0]}, {newTree.leafValues[1]}]
        </p>
      )}
      {round === 0 && <p className="bt-tree-note">初始预测：所有样本输出均值</p>}
    </div>
  );
}
