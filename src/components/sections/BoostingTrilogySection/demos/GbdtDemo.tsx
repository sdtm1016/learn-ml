// 中文注释：GBDT 演示渲染器——散点 + 残差柱 + 学习率 + 预测值更新公式 + 残差小表
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

// 中文注释：把数值格式化为 2 位小数（残差/预测展示用）
const f2 = (n: number) => n.toFixed(2);

export function GbdtDemo({ visual }: GbdtDemoProps) {
  const { points, round, eta, prevPred, newTree } = visual;

  // 中文注释：构造预测值更新公式示例（取第 3 个样本，即右叶代表样本，便于展示右叶叶子值）
  // step 0 没有 newTree，不展示公式
  const showFormula = !!(newTree && prevPred);
  const sampleIdx = 2; // 右叶第一个样本（x=3）
  const formulaPrev = showFormula ? prevPred![sampleIdx] : 0;
  const formulaLeaf = showFormula ? newTree!.leafValues[1] : 0;
  const formulaNew = showFormula ? points[sampleIdx].yPred : 0;

  return (
    <div className="bt-demo-visual">
      {/* 学习率徽标 */}
      <div className="bt-eta-badge">学习率 η = {eta}</div>

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

      {/* 预测值更新公式行：F_m = F_{m-1} + η × 叶子值 */}
      {showFormula && (
        <p className="bt-formula-row">
          F<sub>{round}</sub> = F<sub>{round - 1}</sub> + η × 叶子值
          <span className="bt-formula-nums">
            {' '}= {f2(formulaPrev)} + {eta} × {f2(formulaLeaf)} = <strong>{f2(formulaNew)}</strong>
          </span>
        </p>
      )}

      {/* 本轮新增树说明 */}
      {newTree && (
        <p className="bt-tree-note">
          第 {round} 棵树：按 {newTree.feature} &lt; {newTree.threshold} 分裂，
          叶子值 [{f2(newTree.leafValues[0])}, {f2(newTree.leafValues[1])}]
        </p>
      )}
      {round === 0 && <p className="bt-tree-note">初始预测：所有样本输出均值 0.5</p>}

      {/* 本轮各样本残差小表 */}
      <div className="bt-residual-table" aria-label="本轮各样本残差">
        <span className="bt-mini-title">本轮残差（= 负梯度）：</span>
        <div className="bt-residual-cells">
          {points.map((p) => (
            <span
              key={p.x}
              className={`bt-residual-cell ${p.residual > 0 ? 'pos' : p.residual < 0 ? 'neg' : 'zero'}`}
              title={`样本 x=${p.x}：残差 ${f2(p.residual)}`}
            >
              {f2(p.residual)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
