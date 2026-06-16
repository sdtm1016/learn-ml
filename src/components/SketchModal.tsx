import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import type { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';

const LazyExcalidraw = lazy(async () => {
  const mod = await import('@excalidraw/excalidraw');

  return { default: mod.Excalidraw };
});

type SketchModalProps = {
  open: boolean;
  title: string;
  rawScene: string | null;
  onClose: () => void;
};

function parseScene(rawScene: string | null) {
  if (!rawScene) {
    return null;
  }

  try {
    const scene = JSON.parse(rawScene) as ExcalidrawInitialDataState;

    // 中文注释：原始 .excalidraw 文件含 type/version/source 等外层字段，组件只需要画布初始数据。
    return {
      elements: scene.elements ?? [],
      appState: scene.appState ?? {},
      files: scene.files ?? {},
    } as ExcalidrawInitialDataState;
  } catch {
    return null;
  }
}

export function SketchModal({ open, title, rawScene, onClose }: SketchModalProps) {
  const initialData = useMemo(() => parseScene(rawScene), [rawScene]);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
      // 中文注释：F11 或 F 键切换最大化
      if (event.key === 'f' || event.key === 'F') {
        setIsMaximized(prev => !prev);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="sketch-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div 
        className={`sketch-modal__panel ${isMaximized ? 'maximized' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="sketch-modal__header">
          <div>
            <p className="eyebrow">手绘图解</p>
            <h3>{title}</h3>
            <p>只读预览，适合放大查看算法思路图。</p>
          </div>
          <div className="sketch-modal__actions">
            <button 
              className="sketch-modal__maximize" 
              type="button" 
              onClick={() => setIsMaximized(!isMaximized)}
              aria-label={isMaximized ? '退出全屏' : '全屏显示'}
              title={isMaximized ? '退出全屏 (F)' : '全屏显示 (F)'}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button className="sketch-modal__close" type="button" onClick={onClose} aria-label="关闭弹窗">
              <X size={18} />
            </button>
          </div>
        </header>
        <div className="sketch-modal__canvas">
          {initialData ? (
            <Suspense fallback={<div className="sketch-modal__empty">手绘图解正在加载...</div>}>
              <LazyExcalidraw
                initialData={initialData}
                viewModeEnabled
                zenModeEnabled
                gridModeEnabled={false}
                theme="light"
                detectScroll={false}
                handleKeyboardGlobally={false}
              />
            </Suspense>
          ) : (
            <div className="sketch-modal__empty">当前图解暂时无法解析。</div>
          )}
        </div>
      </div>
    </div>
  );
}
