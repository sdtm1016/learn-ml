import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlgorithmDetail } from './sections/AlgorithmSection/AlgorithmDetail';
import type { AlgorithmItem } from '../data/algorithms';
import type { ExcalidrawScene } from '../data/excalidrawScenes';

interface AlgorithmModalProps {
  isOpen: boolean;
  algorithm: AlgorithmItem;
  sketchScene: ExcalidrawScene | null;
  isCompleted: boolean;
  onClose: () => void;
  onToggleComplete: (name: string) => void;
  onOpenSketch: () => void;
  onPrevAlgorithm: () => void;
  onNextAlgorithm: () => void;
}

// 中文注释：算法详情弹窗组件，支持键盘导航和滚动锁定
export function AlgorithmModal({
  isOpen,
  algorithm,
  sketchScene,
  isCompleted,
  onClose,
  onToggleComplete,
  onOpenSketch,
  onPrevAlgorithm,
  onNextAlgorithm,
}: AlgorithmModalProps) {
  // 中文注释：键盘快捷键支持
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc 关闭
      if (e.key === 'Escape') {
        onClose();
      }
      // 左箭头：上一个算法
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevAlgorithm();
      }
      // 右箭头：下一个算法
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNextAlgorithm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevAlgorithm, onNextAlgorithm]);

  // 中文注释：滚动锁定，打开 Modal 时禁止背景滚动
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* 中文注释：关闭按钮 */}
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          <X size={24} />
        </button>

        {/* 中文注释：导航按钮 */}
        <div className="modal-nav">
          <button
            className="modal-nav-btn prev"
            onClick={onPrevAlgorithm}
            aria-label="上一个算法"
            title="上一个算法 (←)"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="modal-nav-btn next"
            onClick={onNextAlgorithm}
            aria-label="下一个算法"
            title="下一个算法 (→)"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 中文注释：算法详情内容 */}
        <div className="modal-content">
          <AlgorithmDetail
            algorithm={algorithm}
            isCompleted={isCompleted}
            onToggleComplete={onToggleComplete}
            sketchScene={sketchScene}
            onOpenSketch={onOpenSketch}
          />
        </div>
      </div>
    </div>
  );
}
