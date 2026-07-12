// 中文注释：梯度提升三连区块主壳
// 组合：演进时间线 + tab 切换 + 步进器 + 当前 demo 渲染器 + 讲解文字
import { useState } from 'react';
import { boostingTrilogy } from '../../../data/boostingTrilogy';
import type { AlgorithmId, DemoData } from '../../../data/boostingTrilogy/types';
import { EvolutionTimeline } from './EvolutionTimeline';
import { Stepper, useAutoPlay } from './Stepper';
import { GbdtDemo } from './demos/GbdtDemo';
import { XgboostDemo } from './demos/XgboostDemo';
import { LightgbmDemo } from './demos/LightgbmDemo';

// 中文注释：按 algorithmId 分发到具体渲染器
function renderDemo(id: AlgorithmId, visual: unknown) {
  switch (id) {
    case 'gbdt':
      return <GbdtDemo visual={visual as any} />;
    case 'xgboost':
      return <XgboostDemo visual={visual as any} />;
    case 'lightgbm':
      return <LightgbmDemo visual={visual as any} />;
  }
}

export function BoostingTrilogySection() {
  const [activeId, setActiveId] = useState<AlgorithmId>('gbdt');
  const activeDemo = boostingTrilogy.find((d) => d.algorithmId === activeId)!;

  return (
    <section id="boosting-trilogy" className="section-shell bt-section" aria-labelledby="bt-title">
      <div className="section-heading">
        <p className="eyebrow">Boosting Trilogy</p>
        <h2 id="bt-title">梯度提升三连 · 三代演进</h2>
        <p>决策树怎么做梯度下降？GBDT、XGBoost、LightGBM 如何层层加速。点击下方任一代开始演示。</p>
      </div>

      <EvolutionTimeline demos={boostingTrilogy} activeId={activeId} onSelect={setActiveId} />

      {/* tab 切换 */}
      <div className="bt-tabs" role="tablist">
        {boostingTrilogy.map((d) => (
          <button
            key={d.algorithmId}
            role="tab"
            aria-selected={d.algorithmId === activeId}
            className={`bt-tab ${d.algorithmId === activeId ? 'active' : ''}`}
            onClick={() => setActiveId(d.algorithmId)}
          >
            {d.algorithmName}
          </button>
        ))}
      </div>

      {/* 当前 demo：用 key=activeId 重挂载，使 useAutoPlay 内部 step 随 tab 切换自动重置为 0 */}
      <DemoStage key={activeId} demo={activeDemo} />
    </section>
  );
}

// 中文注释：把"舞台 + 步进器"拆成子组件，靠父级 key 重挂载重置 useAutoPlay 状态
interface DemoStageProps {
  demo: DemoData<unknown>;
}

function DemoStage({ demo }: DemoStageProps) {
  const { step, playing, goNext, goPrev, togglePlay } = useAutoPlay(demo.steps.length);
  const current = demo.steps[step];

  return (
    <div className="bt-demo-stage">
      <div className="bt-demo-layout">
        {/* 左：可视化 */}
        <div className="bt-demo-canvas">
          {renderDemo(demo.algorithmId, current.visual)}
        </div>
        {/* 右：讲解 */}
        <div className="bt-demo-narrative">
          <h3>{current.title}</h3>
          <p>{current.narrative}</p>
          <div className="bt-new-additions">
            <span className="bt-mini-title">本代相对上一代新增：</span>
            <ul>
              {demo.newAdditions.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <Stepper
        current={step}
        total={demo.steps.length}
        onPrev={goPrev}
        onNext={goNext}
        isPlaying={playing}
        onTogglePlay={togglePlay}
      />
    </div>
  );
}
