// 中文注释：集成学习两大流派对比块——Bagging（随机森林）vs Boosting（GBDT 系列）
// 静态教学表格，数据内嵌（固定文案，无需进 data 体系）。
// 放在 section 顶部，为下面的三代演进铺垫"Boosting 是两大流派之一"。

// 中文注释：对比维度数据。每行一个维度，两列分别是两大流派。
const ROWS: { dimension: string; bagging: string; boosting: string }[] = [
  {
    dimension: '训练方式',
    bagging: '并行：多棵树各自独立训练，互不依赖',
    boosting: '串行：后一棵拟合前一棵的残差，层层修正',
  },
  {
    dimension: '目标',
    bagging: '降方差——多棵树投票/平均，结果更稳',
    boosting: '降偏差——逐步逼近真值，结果更准',
  },
  {
    dimension: '样本/特征',
    bagging: '有放回采样（bootstrap）+ 每棵树随机选部分特征',
    boosting: '用全量样本，每轮拟合负梯度（残差）',
  },
  {
    dimension: '优劣',
    bagging: '抗过拟合、好调参；精度上限相对低',
    boosting: '精度高、常胜竞赛；对噪声敏感、易过拟合',
  },
];

export function BaggingVsBoosting() {
  return (
    <div className="bt-paradigm" aria-label="集成学习两大流派对比">
      <p className="bt-mini-title">集成学习两大流派</p>
      <div className="bt-paradigm-table" role="table">
        {/* 表头：两大流派 */}
        <div className="bt-paradigm-header" role="row">
          <span className="bt-paradigm-dim" role="columnheader">维度</span>
          <span className="bt-paradigm-bag" role="columnheader">
            <strong>Bagging</strong>
            <em>随机森林</em>
          </span>
          <span className="bt-paradigm-boo" role="columnheader">
            <strong>Boosting</strong>
            <em>GBDT 一族</em>
          </span>
        </div>
        {/* 4 行对比 */}
        {ROWS.map((row) => (
          <div className="bt-paradigm-row" role="row" key={row.dimension}>
            <span className="bt-paradigm-dim" role="rowheader">{row.dimension}</span>
            <span className="bt-paradigm-bag" role="cell">{row.bagging}</span>
            <span className="bt-paradigm-boo" role="cell">{row.boosting}</span>
          </div>
        ))}
      </div>
      <p className="bt-paradigm-transition">
        下面三代（GBDT → XGBoost → LightGBM）都属于 <strong>Boosting</strong> 流派，层层演进。
      </p>
    </div>
  );
}
