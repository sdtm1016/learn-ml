// 中文注释：三代演进时间线——高亮当前算法，显示每代相对上代的新增点
import { Fragment } from 'react';
import type { AlgorithmId, DemoData } from '../../../data/boostingTrilogy/types';

const CIRCLED = ['①', '②', '③']; // 三代序号

interface EvolutionTimelineProps {
  demos: DemoData<unknown>[];
  activeId: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
}

export function EvolutionTimeline({ demos, activeId, onSelect }: EvolutionTimelineProps) {
  return (
    <ol className="bt-timeline" aria-label="三代演进时间线">
      {demos.map((demo, idx) => {
        const isActive = demo.algorithmId === activeId;
        return (
          // 中文注释：用 Fragment 把"节点 + 箭头"作为同级子元素，箭头才能在两个节点中间横向排列
          <Fragment key={demo.algorithmId}>
            <li className={`bt-timeline-node ${isActive ? 'active' : ''}`}>
              <button type="button" className="bt-timeline-btn" onClick={() => onSelect(demo.algorithmId)}>
                <span className="bt-timeline-idx">{CIRCLED[idx]}</span>
                <span className="bt-timeline-name">{demo.algorithmName}</span>
              </button>
              <ul className="bt-timeline-additions">
                {demo.newAdditions.map((add) => (
                  <li key={add}>{add}</li>
                ))}
              </ul>
            </li>
            {idx < demos.length - 1 && (
              <span className="bt-timeline-arrow" aria-hidden="true">→</span>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
