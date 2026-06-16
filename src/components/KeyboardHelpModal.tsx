import { X } from 'lucide-react';
import { useEffect } from 'react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 中文注释：快捷键帮助 Modal，显示所有可用的键盘快捷键
export function KeyboardHelpModal({ isOpen, onClose }: KeyboardHelpModalProps) {
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
    <div className="modal-overlay keyboard-help-overlay" onClick={onClose}>
      <div className="keyboard-help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          <X size={24} />
        </button>

        <h2>⌨️ 键盘快捷键</h2>

        <div className="keyboard-help-sections">
          <section>
            <h3>全局导航</h3>
            <div className="keyboard-help-list">
              <div className="keyboard-help-item">
                <kbd>1</kbd>
                <span>跳转到学习路线</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>2</kbd>
                <span>跳转到算法图谱</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>/</kbd>
                <span>聚焦搜索框</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>?</kbd>
                <span>显示快捷键帮助</span>
              </div>
            </div>
          </section>

          <section>
            <h3>算法详情</h3>
            <div className="keyboard-help-list">
              <div className="keyboard-help-item">
                <kbd>←</kbd>
                <span>上一个算法</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>→</kbd>
                <span>下一个算法</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>Esc</kbd>
                <span>关闭弹窗</span>
              </div>
            </div>
          </section>

          <section>
            <h3>手绘图</h3>
            <div className="keyboard-help-list">
              <div className="keyboard-help-item">
                <kbd>F</kbd>
                <span>最大化/最小化</span>
              </div>
              <div className="keyboard-help-item">
                <kbd>Esc</kbd>
                <span>关闭手绘图</span>
              </div>
            </div>
          </section>
        </div>

        <p className="keyboard-help-footer">提示：大部分快捷键在输入框中不会触发</p>
      </div>
    </div>
  );
}
