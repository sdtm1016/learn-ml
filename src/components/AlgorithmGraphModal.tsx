import { X } from 'lucide-react';
import { lazy, Suspense, useEffect } from 'react';
import type { AlgorithmItem } from '../data/algorithms';

// 中文注释：懒加载算法关系图——reactflow 及其依赖(dagre 等)体积较大，
// 仅在用户打开图谱时才加载，避免拖慢首屏。这与 SketchModal 懒加载 Excalidraw 的策略一致。
const AlgorithmGraph = lazy(() =>
  import('./AlgorithmGraph').then((mod) => ({ default: mod.AlgorithmGraph }))
);

interface AlgorithmGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlgorithm: (algo: AlgorithmItem) => void;
  isCompleted: (name: string) => boolean;
}

// 中文注释：全屏算法关系图 Modal
export function AlgorithmGraphModal({
  isOpen,
  onClose,
  onSelectAlgorithm,
  isCompleted,
}: AlgorithmGraphModalProps) {
  // 中文注释：Esc 关闭
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay algorithm-graph-modal-overlay" onClick={onClose}>
      <div className="algorithm-graph-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          <X size={24} />
        </button>

        <div className="algorithm-graph-modal-header">
          <h2>🕸️ 算法关系图谱</h2>
          <p>探索算法之间的关系，点击节点查看详情</p>
        </div>

        <div className="algorithm-graph-modal-content">
          {/* 中文注释：图谱加载时显示占位，加载完成后再渲染 reactflow 画布 */}
          <Suspense fallback={<div className="algorithm-graph-loading">算法关系图加载中…</div>}>
            <AlgorithmGraph onSelectAlgorithm={onSelectAlgorithm} isCompleted={isCompleted} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
